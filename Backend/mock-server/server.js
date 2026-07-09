const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;

const COURSES = [
    { id: "cse", name: "Computer Science & Engineering (CSE)", code: "CSE", fee: 120000 },
    { id: "cse-aiml", name: "CSE (Artificial Intelligence & Machine Learning)", code: "CSE-AI&ML", fee: 120000 },
    { id: "it", name: "Information Technology (IT)", code: "IT", fee: 110000 },
    { id: "ece", name: "Electronics & Communication Engineering (ECE)", code: "ECE", fee: 90000 },
    { id: "eee", name: "Electrical & Electronics Engineering (EEE)", code: "EEE", fee: 80000 },
    { id: "mech", name: "Mechanical Engineering (ME)", code: "ME", fee: 75000 },
    { id: "civil", name: "Civil Engineering (CE)", code: "CE", fee: 70000 }
];

const crypto = require("crypto");

// Zero-dependency .env parser helper
try {
    const envPath = path.join(__dirname, ".env");
    if (fs.existsSync(envPath)) {
        const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
        for (const line of lines) {
            if (line.trim().startsWith("#")) continue;
            const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let val = match[2] || "";
                if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
                if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
                process.env[key] = val.trim();
            }
        }
    }
} catch (err) {
    console.error("[ENV PARSER] Error reading .env file:", err);
}

const enrollments = [];
const DB_FILE = path.join(__dirname, "data", "enrollments.json");

// Security settings
const JWT_SECRET = process.env.JWT_SECRET || "counselorSecretKey2026!";
const COUNSELOR_USER = process.env.COUNSELOR_USERNAME || "counselor";
const COUNSELOR_PASS = process.env.COUNSELOR_PASSWORD || "counselor@vit";

function signJwt(payload, secret) {
    const header = { alg: "HS256", typ: "JWT" };
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString("base64url");
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
    const signature = crypto
        .createHmac("sha256", secret)
        .update(`${encodedHeader}.${encodedPayload}`)
        .digest("base64url");
    return `${encodedHeader}.${encodedPayload}.${signature}`;
}

function verifyJwt(token, secret) {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const [headerPart, payloadPart, signaturePart] = parts;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(`${headerPart}.${payloadPart}`)
            .digest("base64url");
        if (signaturePart !== expectedSignature) return null;

        const payload = JSON.parse(Buffer.from(payloadPart, "base64url").toString("utf-8"));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}

// Database Layer
let pgClient = null;
let useDatabase = false;

async function initPostgres() {
    if (!process.env.DATABASE_URL) {
        console.log("[MOCK DB] DATABASE_URL not set in .env. Using local json store.");
        loadDb();
        return;
    }

    let connectionString = process.env.DATABASE_URL;
    const { Client } = require("pg");

    try {
        let client = new Client({
            connectionString,
            ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
                ? false
                : { rejectUnauthorized: false }
        });

        try {
            await client.connect();
        } catch (connErr) {
            // Postgres error code '3D000' means the target database does not exist
            if (connErr.code === '3D000') {
                console.log(`📡 [MOCK DB] Database does not exist. Attempting to create database dynamically.`);
                const urlMatch = connectionString.match(/\/([a-zA-Z0-9_-]+)(?:\?.*)?$/);
                const targetDbName = urlMatch ? urlMatch[1] : null;

                if (targetDbName) {
                    // Connect to default 'postgres' database to create the new database
                    const defaultConnString = connectionString.replace(/\/([a-zA-Z0-9_-]+)(?:\?.*)?$/, "/postgres");
                    const adminClient = new Client({
                        connectionString: defaultConnString,
                        ssl: defaultConnString.includes("localhost") || defaultConnString.includes("127.0.0.1")
                            ? false
                            : { rejectUnauthorized: false }
                    });
                    await adminClient.connect();
                    await adminClient.query(`CREATE DATABASE ${targetDbName}`);
                    await adminClient.end();
                    console.log(`📡 [MOCK DB] Created database '${targetDbName}' successfully.`);

                    // Reconnect to newly created database
                    client = new Client({
                        connectionString,
                        ssl: connectionString.includes("localhost") || connectionString.includes("127.0.0.1")
                            ? false
                            : { rejectUnauthorized: false }
                    });
                    await client.connect();
                } else {
                    throw connErr;
                }
            } else {
                throw connErr;
            }
        }

        await client.query(`
            CREATE TABLE IF NOT EXISTS enrollments (
                id VARCHAR(50) PRIMARY KEY,
                fullName VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(30) NOT NULL,
                expectedStartDate VARCHAR(20) NOT NULL,
                choiceOption1 VARCHAR(50) NOT NULL,
                courseName VARCHAR(200) NOT NULL,
                courseCategory VARCHAR(55),
                courseFee INTEGER,
                discountPercentage NUMERIC,
                finalPayableAmount NUMERIC,
                enrollmentStatus VARCHAR(50) DEFAULT 'Draft',
                approvalStatus VARCHAR(50) DEFAULT 'Pending',
                aiPriorityScore INTEGER,
                riskLevel VARCHAR(30),
                createdDate VARCHAR(50)
            );
        `);
        pgClient = client;
        useDatabase = true;
        console.log("🐘 [MOCK DB] Connected to PostgreSQL. Initialized table.");

        const res = await pgClient.query("SELECT * FROM enrollments ORDER BY createdDate DESC");
        enrollments.length = 0;
        for (const row of res.rows) {
            enrollments.push({
                id: row.id,
                fullName: row.fullname,
                email: row.email,
                phone: row.phone,
                expectedStartDate: row.expectedstartdate,
                choiceOption1: row.choiceoption1,
                courseName: row.coursename,
                courseCategory: row.coursecategory,
                courseFee: parseInt(row.coursefee) || 0,
                discountPercentage: parseFloat(row.discountpercentage) || 0,
                finalPayableAmount: parseFloat(row.finalpayableamount) || 0,
                enrollmentStatus: row.enrollmentstatus,
                approvalStatus: row.approvalstatus,
                aiPriorityScore: parseInt(row.aipriorityscore) || 0,
                riskLevel: row.risklevel,
                createdDate: row.createddate
            });
        }
        console.log(`🐘 [MOCK DB] Loaded ${enrollments.length} records dynamically from Postgres table query.`);
    } catch (err) {
        console.error("🐘 [MOCK DB] PostgreSQL initialization failed:", err.message);
        console.log("[MOCK DB] Gracefully falling back to local JSON database caching.");
        loadDb();
    }
}

function saveDb() {
    try {
        const dir = path.dirname(DB_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(DB_FILE, JSON.stringify(enrollments, null, 2), "utf8");
        console.log(`[MOCK DB] Saved ${enrollments.length} records to local cache backup: ${DB_FILE}`);
    } catch (err) {
        console.error("[MOCK DB] Error writing database backup:", err);
    }
}

async function saveEnrollmentDb(record) {
    if (useDatabase && pgClient) {
        try {
            await pgClient.query(`
                INSERT INTO enrollments (
                    id, fullName, email, phone, expectedStartDate, choiceOption1, 
                    courseName, courseCategory, courseFee, discountPercentage, 
                    finalPayableAmount, enrollmentStatus, approvalStatus, aiPriorityScore, riskLevel, createdDate
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
                ON CONFLICT (id) DO UPDATE SET
                    fullName = EXCLUDED.fullName,
                    email = EXCLUDED.email,
                    phone = EXCLUDED.phone,
                    expectedStartDate = EXCLUDED.expectedStartDate,
                    choiceOption1 = EXCLUDED.choiceOption1,
                    courseName = EXCLUDED.courseName,
                    courseCategory = EXCLUDED.courseCategory,
                    courseFee = EXCLUDED.courseFee,
                    discountPercentage = EXCLUDED.discountPercentage,
                    finalPayableAmount = EXCLUDED.finalPayableAmount,
                    enrollmentStatus = EXCLUDED.enrollmentStatus,
                    approvalStatus = EXCLUDED.approvalStatus,
                    aiPriorityScore = EXCLUDED.aiPriorityScore,
                    riskLevel = EXCLUDED.riskLevel,
                    createdDate = EXCLUDED.createdDate
            `, [
                record.id, record.fullName, record.email, record.phone, record.expectedStartDate, record.choiceOption1,
                record.courseName, record.courseCategory, record.courseFee, record.discountPercentage,
                record.finalPayableAmount, record.enrollmentStatus, record.approvalStatus, record.aiPriorityScore, record.riskLevel, record.createdDate
            ]);
            console.log(`🐘 [MOCK DB] Synchronized record ${record.id} in PostgreSQL backend database.`);
        } catch (err) {
            console.error(`🐘 [MOCK DB] Failed to sync record ${record.id} in Postgres:`, err.message);
        }
    }
    saveDb();
}

function loadDb() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, "utf8");
            const parsed = JSON.parse(data);
            if (Array.isArray(parsed)) {
                enrollments.length = 0;
                enrollments.push(...parsed);
                console.log(`[MOCK DB] Loaded ${enrollments.length} records from local cache fallback: ${DB_FILE}`);
            }
        }
    } catch (err) {
        console.error("[MOCK DB] Error loading database cache fallback:", err);
    }
}

// Initialize datastore
initPostgres();

// Setup CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": 2592000, // 30 days
};

// Session store for multi-turn conversations
// Key: sessionId, Value: Array of Gemini message objects: { role: 'user'|'model', parts: [{ text: '...' }] }
const sessions = new Map();

// Salesforce OAuth 2.0 token caching and helper
let cachedToken = null;
let tokenExpiry = 0;
let cachedInstanceUrl = "";

async function getSalesforceConnection() {
    if (cachedToken && Date.now() < tokenExpiry - 300000) {
        return { accessToken: cachedToken, instanceUrl: cachedInstanceUrl };
    }

    console.log("[SALESFORCE] Authenticating with Salesforce using Client Credentials Flow...");
    const clientId = process.env.SF_CLIENT_ID;
    const clientSecret = process.env.SF_CLIENT_SECRET;
    let myDomain = process.env.SF_MY_DOMAIN || "";

    if (myDomain && !myDomain.startsWith("http")) {
        myDomain = "https://" + myDomain;
    }
    if (myDomain && myDomain.endsWith("/")) {
        myDomain = myDomain.slice(0, -1);
    }

    const tokenUrl = myDomain
        ? `${myDomain}/services/oauth2/token`
        : "https://login.salesforce.com/services/oauth2/token";

    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');
    params.append('client_id', clientId);
    params.append('client_secret', clientSecret);

    const response = await fetch(tokenUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: params.toString()
    });

    const tokenData = await response.json();
    if (!response.ok) {
        throw new Error("Salesforce authentication failed: " + JSON.stringify(tokenData));
    }

    cachedToken = tokenData.access_token;
    cachedInstanceUrl = tokenData.instance_url;
    tokenExpiry = Date.now() + 7200000; // 2 hours cached validity

    console.log("[SALESFORCE] Authentication successful. Token cached.");
    return { accessToken: cachedToken, instanceUrl: cachedInstanceUrl };
}

async function sendTwilioWhatsApp(toPhone, messageBody) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_PHONE_NUMBER || "+14155238886";

    if (!accountSid || !authToken) {
        console.warn("[TWILIO API] Warning: Twilio credentials not configured in .env. Skipping message.");
        return;
    }

    console.log(`[TWILIO API] Sending outbound WhatsApp to ${toPhone}...`);

    const formatFrom = fromPhone.startsWith("whatsapp:") ? fromPhone : `whatsapp:${fromPhone}`;
    const formatTo = toPhone.startsWith("whatsapp:") ? toPhone : `whatsapp:${toPhone}`;

    const authString = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

    const params = new URLSearchParams();
    params.append("From", formatFrom);
    params.append("To", formatTo);
    params.append("Body", messageBody);

    try {
        const res = await fetch(twilioUrl, {
            method: "POST",
            headers: {
                "Authorization": `Basic ${authString}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params.toString()
        });

        const data = await res.json();
        if (res.ok) {
            console.log(`[TWILIO API] Message sent successfully. SID: ${data.sid}`);
        } else {
            console.error("[TWILIO API] Failed to send message:", data);
        }
    } catch (err) {
        console.error("[TWILIO API] Error hitting Twilio REST API:", err);
    }
}



// Vishnu Institute of Technology Handbook context (RAG Embedded Instructions)
const VISHNU_INSTITUTE_OF_TECHNOLOGY_HANDBOOK = `
VISHNU INSTITUTE OF TECHNOLOGY HANDBOOK & INFORMATION SHEET:
- Overview: Established in 2008 in Bhimavaram, Andhra Pradesh, India. It is a part of Sri Vishnu Educational Society (SVES) founded by the late Dr. B. V. Raju. It is autonomous and affiliated with JNTUK, Kakinada. It is widely known for high placement rates, lush green campus, and state-of-the-art labs.
- Campus Location: Vishnupur, Bhimavaram, West Godavari District, Andhra Pradesh, India (Pin: 534202).
- Academic Program Offerings (UG - B.Tech):
  * Computer Science and Engineering (CSE)
  * CSE (Artificial Intelligence and Machine Learning)
  * CSE (Data Science)
  * Information Technology (IT)
  * Electronics and Communication Engineering (ECE)
  * Electrical and Electronics Engineering (EEE)
  * Mechanical Engineering (ME)
  * Civil Engineering (CE)
- PG Offerings (M.Tech & MBA):
  * M.Tech in Computer Science and Engineering
  * Master of Business Administration (MBA)
- Annual Tuition Fees (approximate, subject to convener/management quota):
  * B.Tech Programs: ₹70,000 - ₹1,20,000 per year (depending on convener quota or management seats).
  * MBA: ₹40,000 - ₹80,000 per year.
  * Scholarships are available via Jagannanna Amma Vodi, Jnanabhumi, and merit-based institutional fee waivers.
- Admissions Requirements:
  * Undergraduate (B.Tech Convener Quota): Must qualify in AP EAPCET (formerly AP EAMCET) exam and participate in state counseling.
  * Management Quota: Based on JEE Mains rank or Intermediate (12th class) board marks (minimum 60% in MPC).
  * Required Documents: SSC (10th) marksheet, Intermediate (12th) TC & marksheet, EAPCET Rank Card, Study/Bonafide certificates, Caste/Income certificate (if applicable).
- Admissions Office Working Hours:
  * Weekdays (Monday to Friday): 9:00 AM to 5:00 PM.
  * Saturdays: 9:00 AM to 1:00 PM.
- Admissions contact: admissions@vishnu.edu.in
`;

// System Prompt for Nemo
const NEMO_SYSTEM_PROMPT = `
You are a friendly and personable university admissions chat assistant named Nemo at Vishnu Institute of Technology (VIT). Your primary mission is to have genuine, helpful conversations with prospective students visiting the university website, understand their educational goals and concerns, and guide interested students toward connecting with an admissions advisor.

${VISHNU_INSTITUTE_OF_TECHNOLOGY_HANDBOOK}

## Core Objectives
1. **Engage in Natural Conversation**: Build rapport through warm, consultative dialogue that helps students explore their options.
2. **Understand Student Needs**: Learn about their motivations, career goals, and what matters most in their university decision.
3. **Guide Toward Advisor Connection**: When the student shows genuine interest/engagement, offer to connect them with an admissions advisor.

## Conversation Flow
* Phase 1 (First 2-3 exchanges): Greet warmly, learn what brought them here. Reference their name, program, and department interest immediately if provided in the system message.
* Phase 2 (Exploration): Dive deeper into career goals and practical concerns (tuition, entrance examinations).
* Phase 3 (Knowledge Sharing): Use the handbook details above to answer specific questions accurately.
* Phase 4 (Transition): After 4+ exchanges or multiple engaged questions, offer to connect with an advisor: "Would you prefer contact during business hours (10am-5pm) or sooner, within the next 2 hours?"
* Phase 5 (Handoff Consent):
  - Step A: Verify if you possess the student's contact phone number. If NOT, you MUST ask the student for their phone number first (e.g. "I'd display to connect you! Could you please share your phone number so an advisor can reach out?").
  - Step B: Once you have their phone number AND they have chosen their preferred contact timing ("within 2 hours" or "during business hours"), you MUST prefix your response with exactly:
[TRIGGER_ADVISOR_HANDOFF]
Followed by a brief explanation and the confirmation message for the student.

DO NOT output [TRIGGER_ADVISOR_HANDOFF] until you have obtained their contact phone number and preferred timing.
Keep responses concise, friendly, and pressure-free.
`;

// Helper to write JSON responses
const sendJson = (res, statusCode, data) => {
    res.writeHead(statusCode, {
        ...corsHeaders,
        "Content-Type": "application/json",
    });
    res.end(JSON.stringify(data));
};

const server = http.createServer((req, res) => {
    // Handle CORS Preflight
    if (req.method === "OPTIONS") {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
    }

    // Salesforce Contact/Lead Submission Route
    if (req.method === "POST" && req.url === "/createFormLead") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                console.log("\n========================================");
                console.log("[SALESFORCE API] Pushing Lead Form Submission:");
                console.log(`  Name: ${payload.firstName} ${payload.lastName}`);
                console.log(`  Email: ${payload.email}`);
                console.log(`  Phone: ${payload.cellPhone}`);
                console.log(`  Program Interest: ${payload.programType}`);
                console.log(`  Location: ${payload.headquarters}`);
                console.log("========================================\n");

                const sfConn = await getSalesforceConnection();
                const leadPayload = {
                    FirstName: payload.firstName || "",
                    LastName: payload.lastName || "Unknown",
                    Company: "Vishnu Institute of Technology (VIT)",
                    Email: payload.email || "",
                    Phone: payload.cellPhone || "",
                    Description: `Campus Location: ${payload.headquarters || ""}\nProgram Interest: ${payload.programType || ""}\nHome Phone: ${payload.homePhone || ""}\nData Authorization: ${payload.dataAuthorization || false}`
                };

                const leadResponse = await fetch(`${sfConn.instanceUrl}/services/data/v58.0/sobjects/Lead`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${sfConn.accessToken}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(leadPayload)
                });

                const leadResult = await leadResponse.json();
                if (!leadResponse.ok) {
                    console.error("[SALESFORCE API] Lead creation failed:", leadResult);
                    throw new Error("Salesforce Lead insertion error: " + JSON.stringify(leadResult));
                }

                console.log(`[SALESFORCE API] Lead created successfully with ID: ${leadResult.id}`);

                sendJson(res, 200, {
                    statusCode: 200,
                    message: "Lead created successfully",
                    data: {
                        leadId: leadResult.id,
                    },
                });
            } catch (err) {
                console.error("[SALESFORCE API] Error processing /createFormLead:", err);
                sendJson(res, 500, { error: err.message || "Failed to process lead in Salesforce" });
            }
        });
        return;
    }


    // Google Gemini API Proxy SSE Stream
    if (req.method === "POST" && req.url === "/") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", async () => {
            try {
                const requestData = JSON.parse(body);
                const runtimeSessionId = requestData.runtimeSessionId;
                const payload = requestData.payload || {};
                const prompt = payload.prompt || "";
                const phoneNumber = payload.phone_number || "+1-555-000-0000";

                console.log(`\n[GEMINI PROXY] Message Request - Session ID: ${runtimeSessionId}`);
                console.log(`[GEMINI PROXY] Query: "${prompt}"`);

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                    console.error("[GEMINI PROXY] Missing GEMINI_API_KEY in .env");
                    res.writeHead(500, corsHeaders);
                    res.end("Error: GEMINI_API_KEY is not configured on the mock server.");
                    return;
                }

                // Set Headers for SSE streaming output to client
                res.writeHead(200, {
                    ...corsHeaders,
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                });

                // 1. Send simulated tool status before getting Gemini response
                res.write(`data: ${JSON.stringify({ thinking: "🔍 Searching Vishnu Institute of Technology KB..." })}\n\n`);
                await new Promise((resolve) => setTimeout(resolve, 500));

                // 2. Fetch history for this session
                if (!sessions.has(runtimeSessionId)) {
                    sessions.set(runtimeSessionId, []);
                }
                const sessionHistory = sessions.get(runtimeSessionId);

                // Append user prompt to history
                sessionHistory.push({
                    role: "user",
                    parts: [{ text: prompt }],
                });

                // 3. Request Google Gemini streamGenerateContent API
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`;
                const geminiPayload = {
                    contents: sessionHistory,
                    systemInstruction: {
                        parts: [{ text: NEMO_SYSTEM_PROMPT }],
                    },
                };

                const geminiResponse = await fetch(geminiUrl, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(geminiPayload),
                });

                if (!geminiResponse.ok) {
                    const errText = await geminiResponse.text();
                    console.error("[GEMINI PROXY] API request failed:", geminiResponse.status, errText);
                    res.write(`data: ${JSON.stringify({ error: `Gemini API Error: ${geminiResponse.statusText}` })}\n\n`);
                    res.end();
                    return;
                }

                const reader = geminiResponse.body.getReader();
                const decoder = new TextDecoder();
                let buffer = "";
                let fullReply = "";
                let isHandoffTriggered = false;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split("\n");
                    buffer = lines.pop(); // Keep unfinished line in buffer

                    for (const line of lines) {
                        const trimmedLine = line.trim();
                        if (!trimmedLine.startsWith("data: ")) continue;

                        const jsonStr = trimmedLine.slice(6).trim();
                        if (!jsonStr) continue;

                        try {
                            const chunkData = JSON.parse(jsonStr);
                            let textChunk = chunkData.candidates?.[0]?.content?.parts?.[0]?.text;
                            if (textChunk) {
                                fullReply += textChunk;

                                // Check for Handoff Trigger tag
                                if (fullReply.includes("[TRIGGER_ADVISOR_HANDOFF]")) {
                                    isHandoffTriggered = true;
                                    textChunk = textChunk.replace("[TRIGGER_ADVISOR_HANDOFF]", "");
                                }

                                // If handoff is triggered, clean up textChunk of the tag
                                if (isHandoffTriggered) {
                                    textChunk = textChunk.replace(/\[TRIGGER_ADVISOR_HANDOFF\]/gi, "");
                                }

                                if (textChunk) {
                                    // Forward content chunk to client
                                    res.write(`data: ${JSON.stringify({ response: textChunk })}\n\n`);
                                }
                            }
                        } catch (pErr) {
                            console.error("[GEMINI PROXY] Chunk parse error:", pErr);
                        }
                    }
                }

                // Clean final reply text for history storage
                const cleanedReply = fullReply.replace(/\[TRIGGER_ADVISOR_HANDOFF\]/gi, "").trim();

                // 4. Handle Advisor Handoff actions
                if (isHandoffTriggered) {
                    console.log("\n------------------ REAL-AI HANDOFF DETECTED ------------------");
                    let targetPhone = phoneNumber;
                    try {
                        const sfConn = await getSalesforceConnection();
                        let leadId = null;

                        // Resolve Target Phone from Context or History
                        if (targetPhone === "anonymous" || !targetPhone) {
                            // Match phone numbers like +91 9392532859, +15555022388, etc.
                            const phoneRegex = /(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+?\d{10,12}/g;
                            for (let i = sessionHistory.length - 1; i >= 0; i--) {
                                const text = sessionHistory[i].parts?.[0]?.text || "";
                                const matches = text.match(phoneRegex);
                                if (matches && matches.length > 0) {
                                    targetPhone = matches[0].trim();
                                    break;
                                }
                            }
                        }

                        if (targetPhone === "anonymous" || !targetPhone) {
                            console.warn("[SALESFORCE API] Warning: Handoff triggered but no phone number found in chat history. Falling back to default.");
                            targetPhone = "+1-555-000-0000";
                        }

                        // Look up lead by phone
                        const escapedPhone = targetPhone.replace(/'/g, "\\'");
                        const queryUrl = `${sfConn.instanceUrl}/services/data/v58.0/query?q=SELECT+Id+FROM+Lead+WHERE+Phone='${encodeURIComponent(escapedPhone)}'+OR+MobilePhone='${encodeURIComponent(escapedPhone)}'+ORDER+BY+CreatedDate+DESC+LIMIT+1`;

                        const queryRes = await fetch(queryUrl, {
                            method: "GET",
                            headers: {
                                "Authorization": `Bearer ${sfConn.accessToken}`
                            }
                        });

                        if (queryRes.ok) {
                            const queryData = await queryRes.json();
                            if (queryData.records && queryData.records.length > 0) {
                                leadId = queryData.records[0].Id;
                                console.log(`[SALESFORCE API] Found existing lead with ID: ${leadId}`);
                            }
                        }

                        if (leadId) {
                            // Update Lead Status to 'Working - Contacted'
                            console.log(`[SALESFORCE API] Updating lead status to 'Working - Contacted'...`);
                            await fetch(`${sfConn.instanceUrl}/services/data/v58.0/sobjects/Lead/${leadId}`, {
                                method: "PATCH",
                                headers: {
                                    "Authorization": `Bearer ${sfConn.accessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ Status: "Working - Contacted" })
                            });
                        } else {
                            // Create a new lead for handoff
                            console.log(`[SALESFORCE API] Lead not found. Creating new handoff lead...`);
                            const newLeadBody = {
                                FirstName: "Chat Handoff",
                                LastName: "Admissions Prospect",
                                Company: "Vishnu Institute of Technology (VIT)",
                                Phone: targetPhone,
                                Description: "Lead created automatically by Nemo AI chatbot on advisor handoff.",
                                Status: "Working - Contacted"
                            };
                            const createLeadRes = await fetch(`${sfConn.instanceUrl}/services/data/v58.0/sobjects/Lead`, {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${sfConn.accessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(newLeadBody)
                            });
                            const createLeadData = await createLeadRes.json();
                            if (createLeadRes.ok) {
                                leadId = createLeadData.id;
                                console.log(`[SALESFORCE API] Handoff lead created successfully with ID: ${leadId}`);
                            }
                        }

                        if (leadId) {
                            // Create follow-up Task
                            console.log(`[SALESFORCE API] Creating Task associated with Lead ${leadId}...`);
                            const taskBody = {
                                Subject: "Admissions Advisor Handoff - AI Chat Summary",
                                WhoId: leadId,
                                Description: `AI Advisor Handoff Requested for student with phone number ${targetPhone}.\n\nChat Transcript Summary:\n${cleanedReply}`,
                                Status: "Not Started",
                                Priority: "High"
                            };
                            const createTaskRes = await fetch(`${sfConn.instanceUrl}/services/data/v58.0/sobjects/Task`, {
                                method: "POST",
                                headers: {
                                    "Authorization": `Bearer ${sfConn.accessToken}`,
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify(taskBody)
                            });
                            const createTaskData = await createTaskRes.json();
                            if (createTaskRes.ok) {
                                console.log(`[SALESFORCE API] High-Priority Task created: ${createTaskData.id}`);
                            } else {
                                console.error("[SALESFORCE API] Task creation failed:", createTaskData);
                            }
                        }
                    } catch (sfErr) {
                        console.error("[SALESFORCE API] Error during live Salesforce handoff operations:", sfErr);
                    }
                    const twilioMsg = `Hi! Thanks for your interest in Vishnu Institute of Technology. A counselor has been assigned and will contact you shortly.`;
                    await sendTwilioWhatsApp(targetPhone, twilioMsg);
                    console.log("----------------------------------------------------------------\n");

                    // Write a small helper SSE indicator to UI if helpful
                    res.write(`data: ${JSON.stringify({ tool_result: "Advisor Handoff initiated in Salesforce." })}\n\n`);
                    await new Promise((resolve) => setTimeout(resolve, 300));
                }


                // Append assistant reply to history
                sessionHistory.push({
                    role: "model",
                    parts: [{ text: cleanedReply }],
                });

                // 5. Send final outcome to client
                res.write(`data: ${JSON.stringify({ final_result: cleanedReply })}\n\n`);
                res.end();

            } catch (err) {
                console.error("[GEMINI PROXY] Error processing request:", err);
                res.write(`data: ${JSON.stringify({ error: err.message || "Proxy exception occurred." })}\n\n`);
                res.end();
            }
        });
        return;
    }

    // Helper to query authorization header check
    function checkAuthorized(req, res) {
        const authHeader = req.headers["authorization"] || req.headers["Authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            sendJson(res, 401, { error: "Unauthorized access: Missing session token" });
            return null;
        }
        const token = authHeader.substring(7);
        const verified = verifyJwt(token, JWT_SECRET);
        if (!verified) {
            sendJson(res, 401, { error: "Unauthorized access: Session expired or invalid signature" });
            return null;
        }
        return verified;
    }

    // Counselor Authenticated Login Route
    if (req.method === "POST" && req.url === "/api/counselor/login") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const payload = JSON.parse(body);
                const { username, password } = payload;
                if (username === COUNSELOR_USER && password === COUNSELOR_PASS) {
                    const token = signJwt(
                        { username, role: "counselor", exp: Date.now() + 3600000 }, // 1 hour token
                        JWT_SECRET
                    );
                    sendJson(res, 200, { success: true, token });
                } else {
                    sendJson(res, 401, { success: false, error: "Invalid username or password credentials" });
                }
            } catch (err) {
                console.error("[AUTH] Counselor login error:", err);
                sendJson(res, 400, { error: "Invalid request payload" });
            }
        });
        return;
    }

    // -------------------------------------------------------------
    // NEW PORTAL ENHANCEMENT ENDPOINTS
    // -------------------------------------------------------------

    // 1. GET /api/courses
    if (req.method === "GET" && req.url === "/api/courses") {
        sendJson(res, 200, COURSES);
        return;
    }

    // 2. GET /api/enrollments
    if (req.method === "GET" && req.url === "/api/enrollments") {
        if (!checkAuthorized(req, res)) return;
        sendJson(res, 200, enrollments);
        return;
    }

    // 3. GET /api/enrollments/ai-insights (simulating Agentforce prompt templates)
    if (req.method === "GET" && req.url.startsWith("/api/enrollments/ai-insights")) {
        if (!checkAuthorized(req, res)) return;
        const queryParams = new URLSearchParams(req.url.split("?")[1] || "");
        const enrollmentId = queryParams.get("id");
        const found = enrollments.find(e => e.id === enrollmentId);

        if (!found) {
            sendJson(res, 404, { error: "Enrollment not found" });
            return;
        }

        const studentName = found.fullName || "Unknown Student";
        const courseName = found.courseName || "Unknown Course";
        const courseFee = found.courseFee || 0;
        const discount = found.discountPercentage || 0;
        const finalPayable = found.finalPayableAmount || 0;
        const status = found.enrollmentStatus || "Draft";
        const aiScore = found.aiPriorityScore || 50;
        const riskLevel = found.riskLevel || "Low";

        // Simulated AI Prompt outputs:
        const studentApplicationSummary = `Student Application Summary:
* Applicant Name: ${studentName}
* Choice Course: ${courseName} (Standard fee: ₹${courseFee.toLocaleString('en-IN')})
* Financial Structure: Applied discount of ${discount}% resulting in a Final Payable Amount of ₹${finalPayable.toLocaleString('en-IN')}.
* Admission Status: The application is currently flagged as "${status}".
* AI Evaluation Rank: Evaluated with an AI priority score of ${aiScore}/100.
${aiScore >= 80 ? "⚠️ WARNING: High priority applicant requiring immediate counselor handoff." : "✅ Normal priority - process through standard channels."}
* Risk indicators: The financial discount is within ${discount > 30 ? "high-risk levels" : "standard parameters"}.`;

        const admissionRiskAnalysis = `Student Enrollment Risk Analysis & Recommendations:
1. Probability of Admission: Estimated at ${aiScore > 75 ? "92%" : "68%"} based on entrance scores and academic background.
2. Financial Risk: ${discount > 30 ? "High risk (Revenue reduction > 30% due to discount)" : "Low risk (Within normal discount margin)"}.
3. Overall Enrollment Health: ${riskLevel} Risk.
4. Recommendations: ${discount > 30 ? "⚠️ REQUIRE MANAGER OVERRIDE. Verify eligibility scores before granting this discount." : "✅ SAFE TO APPROVE. The discount and academic parameters match all enrollment criteria."}`;

        sendJson(res, 200, {
            id: enrollmentId,
            studentApplicationSummary,
            admissionRiskAnalysis
        });
        return;
    }

    // 4. POST /api/enrollments
    if (req.method === "POST" && req.url === "/api/enrollments") {
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const courseId = payload.choiceOption1 || "cse";
                const courseItem = COURSES.find(c => c.id === courseId) || COURSES[0];
                const fee = courseItem.fee;
                const discount = parseFloat(payload.discountPercentage) || 0;
                const finalPayable = Math.max(0, fee * (1 - (discount / 100)));
                const aiScore = Math.floor(40 + Math.random() * 61); // 40 to 100

                let risk = "Low";
                if (discount > 30) risk = "High";
                else if (discount >= 15) risk = "Medium";

                let appStatus = "Approved";
                let enrollStatus = "Approved";
                if (discount > 30) {
                    appStatus = "Pending";
                    enrollStatus = "Submitted for Approval";
                }

                const brandNew = {
                    id: "ENR-" + Date.now(),
                    fullName: payload.fullName || "Test Student",
                    email: payload.email || "test@example.com",
                    phone: payload.phone || "0000000000",
                    expectedStartDate: payload.expectedStartDate || new Date().toISOString().split("T")[0],
                    choiceOption1: courseId,
                    courseName: courseItem.name,
                    courseCategory: courseItem.category || "Technical",
                    courseFee: fee,
                    discountPercentage: discount,
                    finalPayableAmount: finalPayable,
                    enrollmentStatus: enrollStatus,
                    approvalStatus: appStatus,
                    aiPriorityScore: aiScore,
                    riskLevel: risk,
                    createdDate: new Date().toISOString()
                };

                enrollments.push(brandNew);
                await saveEnrollmentDb(brandNew);
                console.log(`[MOCK SF DB] Saved new Student Enrollment: ${brandNew.id} (${brandNew.fullName})`);

                // Mock triggered flow outputs in local log
                if (aiScore >= 80) {
                    console.log(`[MOCK SF SYSTEM] Triggering flow: AI Priority score ${aiScore} >= 80. Real-time Counselor Email Alert run.`);
                }
                if (discount > 30) {
                    console.log(`[MOCK SF SYSTEM] Triggering approval process: Discount ${discount}% > 30%. Sent Manager Email Alert.`);
                }

                sendJson(res, 201, brandNew);
            } catch (err) {
                console.error("Error parsing enrollment post:", err);
                sendJson(res, 400, { error: "Invalid JSON body" });
            }
        });
        return;
    }

    // 5. POST /api/enrollments/action
    if (req.method === "POST" && req.url === "/api/enrollments/action") {
        if (!checkAuthorized(req, res)) return;
        let body = "";
        req.on("data", (chunk) => { body += chunk.toString(); });
        req.on("end", async () => {
            try {
                const payload = JSON.parse(body);
                const enrollmentId = payload.id;
                const action = payload.action; // "approve" or "reject"
                const foundIndex = enrollments.findIndex(e => e.id === enrollmentId);

                if (foundIndex === -1) {
                    sendJson(res, 404, { error: "Enrollment not found" });
                    return;
                }

                if (action === "approve") {
                    enrollments[foundIndex].approvalStatus = "Approved";
                    enrollments[foundIndex].enrollmentStatus = "Approved";
                    console.log(`[MOCK SF SYSTEM] Enrollment ${enrollmentId} APPROVED by manager.`);
                } else if (action === "reject") {
                    enrollments[foundIndex].approvalStatus = "Rejected";
                    enrollments[foundIndex].enrollmentStatus = "Rejected";
                    console.log(`[MOCK SF SYSTEM] Enrollment ${enrollmentId} REJECTED by manager.`);
                }

                await saveEnrollmentDb(enrollments[foundIndex]);
                sendJson(res, 200, enrollments[foundIndex]);
            } catch (err) {
                console.error("Error parsing enrollment action post:", err);
                sendJson(res, 400, { error: "Invalid JSON body" });
            }
        });
        return;
    }

    // 404 Route
    res.writeHead(404, corsHeaders);
    res.end("Not Found");

});

server.listen(PORT, () => {
    console.log(`🚀 Admissions Agent Live-Gemini Simulator running at http://localhost:${PORT}`);
    console.log("Press Ctrl+C to terminate");
});
