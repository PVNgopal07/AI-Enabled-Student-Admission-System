const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8080;

// Setup CORS headers
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept, Authorization",
    "Access-Control-Max-Age": 2592000, // 30 days
};

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

// Session store for multi-turn conversations
// Key: sessionId, Value: Array of Gemini message objects: { role: 'user'|'model', parts: [{ text: '...' }] }
const sessions = new Map();

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
  - Step A: Wait for them to choose their preferred timeframe (2 hours or business hours).
  - Step B: Once they choose, TRIGGER the handoff.

## Handoff Trigger Protocol (CRITICAL)
If the student agrees to speak with an advisor AND they have chosen their preferred contact timing ("within 2 hours" or "during business hours"), you MUST prefix your response with exactly:
[TRIGGER_ADVISOR_HANDOFF]
Followed by a brief explanation and the confirmation message for the student.

DO NOT output [TRIGGER_ADVISOR_HANDOFF] until they have confirmed the contact and timing preference.
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

    // Salesforce Contact/Lead Submission Mock Route
    if (req.method === "POST" && req.url === "/createFormLead") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const payload = JSON.parse(body);
                console.log("\n========================================");
                console.log("[SALESFORCE MOCK] Lead Form Submitted:");
                console.log(`  Name: ${payload.firstName} ${payload.lastName}`);
                console.log(`  Email: ${payload.email}`);
                console.log(`  Phone: ${payload.cellPhone}`);
                console.log(`  Program Interest: ${payload.programType}`);
                console.log(`  Location: ${payload.headquarters}`);
                console.log("========================================\n");

                sendJson(res, 200, {
                    statusCode: 200,
                    message: "Lead created successfully",
                    data: {
                        leadId: "mock-lead-id-" + Math.floor(Math.random() * 1000000),
                    },
                });
            } catch (err) {
                console.error("[SALESFORCE MOCK] Error parsing body:", err);
                sendJson(res, 400, { error: "Invalid JSON body" });
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
                    console.log("[SALESFORCE MOCK] Lead status updated to 'Working - Connected'.");
                    console.log("[SALESFORCE MOCK] Created Task: 'AI Chat Summary - Advisor Handoff'.");
                    console.log(`[TWILIO WHATSAPP MOCK] Outbound WhatsApp sent to ${phoneNumber}:`);
                    console.log(`  "Hi! Thanks for your interest in Vishnu Institute of Technology. A counselor has been assigned and will contact you shortly."`);
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

    // 404 Route
    res.writeHead(404, corsHeaders);
    res.end("Not Found");
});

server.listen(PORT, () => {
    console.log(`🚀 Admissions Agent Live-Gemini Simulator running at http://localhost:${PORT}`);
    console.log("Press Ctrl+C to terminate");
});
