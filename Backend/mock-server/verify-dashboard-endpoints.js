const fs = require('fs');

async function testDashboardEndpoints() {
    console.log("Starting Portal Salesforce-Alignment Endpoints Verification...");
    const rootUrl = "http://localhost:8080";

    // 1. GET /api/courses
    console.log("\n1. Testing GET /api/courses...");
    try {
        const coursesRes = await fetch(`${rootUrl}/api/courses`);
        const courses = await coursesRes.json();
        if (coursesRes.ok && Array.isArray(courses)) {
            console.log(`SUCCESS: Fetched ${courses.length} courses.`);
            console.log("Sample Course CSE fee:", courses.find(c => c.id === "cse")?.fee);
        } else {
            console.error("FAIL: Failed to fetch courses", coursesRes.status, courses);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: Could not connect to /api/courses. Is the server running?", e);
        process.exit(1);
    }

    let token = "";
    // 0. Login to retrieve Token
    console.log("\n0. Testing POST /api/counselor/login...");
    try {
        const loginRes = await fetch(`${rootUrl}/api/counselor/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: "counselor", password: "counselor@vit" })
        });
        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.token) {
            token = loginData.token;
            console.log("SUCCESS: Received JWT token:", token.substring(0, 15) + "...");
        } else {
            console.error("FAIL: Login endpoint rejected credentials", loginRes.status, loginData);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: Could not connect to counselor login API", e);
        process.exit(1);
    }

    // 2. POST /api/enrollments (Low Discount -> Auto-Approval)
    console.log("\n2. Testing POST /api/enrollments (Low Discount: 15% -> Auto-Approved)...");
    let testEnrollmentId = "";
    try {
        const payload = {
            fullName: "Auto Approved Candidate",
            email: "auto@example.com",
            phone: "+91 99999 88888",
            expectedStartDate: "2028-12-31",
            choiceOption1: "cse-aiml",
            discountPercentage: "15"
        };
        const enrollRes = await fetch(`${rootUrl}/api/enrollments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await enrollRes.json();
        if (enrollRes.ok && data.id) {
            testEnrollmentId = data.id;
            console.log("SUCCESS: Created student enrollment:", data.id);
            console.log("Calculated Final Payable Amount:", data.finalPayableAmount);
            console.log("Approval Status:", data.approvalStatus);
            console.log("Enrollment Status:", data.enrollmentStatus);
            console.log("AI Priority Score:", data.aiPriorityScore);
            console.log("Risk Level:", data.riskLevel);
            if (data.approvalStatus !== "Approved") {
                console.error("FAIL: Expected discount 15% to be Auto-Approved but got status:", data.approvalStatus);
                process.exit(1);
            }
        } else {
            console.error("FAIL: Post enrollment failed", enrollRes.status, data);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: Post enrollment exception", e);
        process.exit(1);
    }

    // 3. POST /api/enrollments (High Discount -> Submitted for Approval Escalation)
    console.log("\n3. Testing POST /api/enrollments (High Discount: 40% -> Escalation)...");
    let pendingEnrollmentId = "";
    try {
        const payload = {
            fullName: "Pending Escalated Candidate",
            email: "escalation@example.com",
            phone: "+91 88888 77777",
            expectedStartDate: "2028-10-15",
            choiceOption1: "it",
            discountPercentage: "40"
        };
        const enrollRes = await fetch(`${rootUrl}/api/enrollments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await enrollRes.json();
        if (enrollRes.ok && data.id) {
            pendingEnrollmentId = data.id;
            console.log("SUCCESS: Created student enrollment:", data.id);
            console.log("Calculated Final Payable Amount:", data.finalPayableAmount);
            console.log("Approval Status:", data.approvalStatus);
            console.log("Enrollment Status:", data.enrollmentStatus);
            console.log("AI Priority Score:", data.aiPriorityScore);
            console.log("Risk Level:", data.riskLevel);
            if (data.approvalStatus !== "Pending") {
                console.error("FAIL: Expected discount 40% to be Pending but got status:", data.approvalStatus);
                process.exit(1);
            }
        } else {
            console.error("FAIL: Post enrollment failed", enrollRes.status, data);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: Post enrollment exception", e);
        process.exit(1);
    }

    // 4. GET /api/enrollments/ai-insights
    console.log("\n4. Testing GET /api/enrollments/ai-insights...");
    try {
        const insightsRes = await fetch(`${rootUrl}/api/enrollments/ai-insights?id=${pendingEnrollmentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        const data = await insightsRes.json();
        if (insightsRes.ok && data.studentApplicationSummary) {
            console.log("SUCCESS: Fetched Agentforce insights output.");
            console.log("--- SUMMARY PROMPT OUTPUT ---");
            console.log(data.studentApplicationSummary);
            console.log("--- RISK ANALYSIS PROMPT OUTPUT ---");
            console.log(data.admissionRiskAnalysis);
        } else {
            console.error("FAIL: Failed to fetch insights", insightsRes.status, data);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: AI insights fetch exception", e);
        process.exit(1);
    }

    // 5. POST /api/enrollments/action (Manual Approval Override)
    console.log("\n5. Testing POST /api/enrollments/action (Approve manual override)...");
    try {
        const payload = {
            id: pendingEnrollmentId,
            action: "approve"
        };
        const actionRes = await fetch(`${rootUrl}/api/enrollments/action`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        const data = await actionRes.json();
        if (actionRes.ok && data.approvalStatus === "Approved") {
            console.log("SUCCESS: Enrollment updated to APPROVED.");
        } else {
            console.error("FAIL: Failed to execute override approve action", actionRes.status, data);
            process.exit(1);
        }
    } catch (e) {
        console.error("FAIL: Manual approval override execution exception", e);
        process.exit(1);
    }

    console.log("\n==============================================");
    console.log("🎯 ALL LIVE ADMISSIONS ALIGNMENT TESTS PASSED!");
    console.log("==============================================");
}

testDashboardEndpoints();
