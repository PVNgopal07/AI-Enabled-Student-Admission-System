const fs = require('fs');

async function valEndpoint() {
    console.log("Starting Web API Live Verification...");

    const uniqueId = Date.now();
    const testPhone = "+1555" + Math.floor(1000000 + Math.random() * 9000000);
    const testEmail = `prog.verified_${uniqueId}@example.com`;

    // 1. Test Form Submission Lead Creation
    console.log("\n1. Testing /createFormLead (Student Inquiry Form)...");
    const studentPayload = {
        firstName: "Programmatic",
        lastName: "Verification",
        email: testEmail,
        cellPhone: testPhone,
        homePhone: "08816-543210",
        programType: "Undergraduate Programmes (B.Tech)",
        headquarters: "Bhimavaram Campus (VIT)",
        dataAuthorization: true
    };

    try {
        const leadRes = await fetch("http://localhost:8080/createFormLead", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(studentPayload)
        });

        const leadData = await leadRes.json();
        if (leadRes.ok) {
            console.log("SUCCESS: /createFormLead response status is 200");
            console.log("Salesforce Lead ID created:", leadData.data.leadId);
        } else {
            console.error("FAIL: /createFormLead returned error status:", leadRes.status, leadData);
            return;
        }
    } catch (error) {
        console.error("FAIL: Could not reach /createFormLead server. Is the server running?", error);
        return;
    }

    // 2. Test Chat Handoff Trigger & Task Creation (Turn 1)
    console.log(`\n2. Testing Chat Handshake Endpoint (Turn 1 - Asking to speak to advisor with phone: ${testPhone})...`);
    const chatPayload1 = {
        runtimeSessionId: "verify-session-" + uniqueId,
        payload: {
            prompt: "Can you transfer me automatically to an human advisor?",
            phone_number: testPhone
        }
    };

    try {
        const chatRes1 = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chatPayload1)
        });

        if (chatRes1.status !== 200) {
            console.error("FAIL: Chat endpoint Turn 1 returned non-200 status:", chatRes1.status);
            return;
        }

        console.log("SUCCESS: Turn 1 responded with 200");

        // Read stream to allow history accumulation on server
        const reader = chatRes1.body.getReader();
        let done = false;
        while (!done) {
            const { value, done: rd } = await reader.read();
            done = rd;
        }

        // 3. Test Chat Handoff Trigger & Task Creation (Turn 2 - Confirming handoff time preference)
        console.log("\n3. Testing Chat Handshake Endpoint (Turn 2 - Confirming time preference to trigger handoff)...");
        const chatPayload2 = {
            runtimeSessionId: "verify-session-" + uniqueId,
            payload: {
                prompt: "Yes, I prefer to be contacted sooner, within the next 2 hours. Please arrange it.",
                phone_number: testPhone
            }
        };

        const chatRes2 = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(chatPayload2)
        });

        if (chatRes2.status === 200) {
            console.log("SUCCESS: Turn 2 responded with 200");
            const reader2 = chatRes2.body.getReader();
            const decoder = new TextDecoder();
            let done2 = false;
            let fullResponseText = "";

            while (!done2) {
                const { value, done: rd } = await reader2.read();
                done2 = rd;
                if (value) {
                    fullResponseText += decoder.decode(value);
                }
            }

            console.log("Chat response chunks output:");
            console.log(fullResponseText);
            console.log("\nVerification successfully finished!");
        } else {
            console.error("FAIL: Turn 2 returned non-200 status:", chatRes2.status);
        }
    } catch (error) {
        console.error("FAIL: Error hitting chat proxy:", error);
    }
}

valEndpoint();
