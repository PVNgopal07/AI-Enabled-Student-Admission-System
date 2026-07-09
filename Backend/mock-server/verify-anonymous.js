const fs = require('fs');

async function valAnonymous() {
    console.log("Starting Anonymous Chat Handoff verification...");

    const uniqueId = Date.now();
    const testPhone = "+1555" + Math.floor(1000000 + Math.random() * 9000000);
    console.log(`Generated test phone number for this run: ${testPhone}`);

    // We start a chat run anonymously (phoneNumber = "anonymous")
    const chatSessionId = "anon-session-" + uniqueId;

    // Turn 1: Ask for advisor without pre-existing phone number
    console.log("\n1. Turn 1: Asking to speak to an admissions advisor (anonymous)...");
    const payload1 = {
        runtimeSessionId: chatSessionId,
        payload: {
            prompt: "Hello! I am a prospective student. Can I speak to an admissions advisor?",
            phone_number: "anonymous"
        }
    };

    let botResponse1 = "";

    try {
        const res1 = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload1)
        });

        if (res1.status !== 200) {
            console.error("FAIL: Turn 1 failed with status:", res1.status);
            return;
        }

        const reader = res1.body.getReader();
        const decoder = new TextDecoder();
        let done = false;

        while (!done) {
            const { value, done: rd } = await reader.read();
            done = rd;
            if (value) {
                const text = decoder.decode(value);
                // Look for final reply chunks
                const lines = text.split("\n");
                for (const line of lines) {
                    if (line.trim().startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.trim().slice(6));
                            if (data.response) {
                                botResponse1 += data.response;
                            }
                        } catch (e) { }
                    }
                }
            }
        }

        console.log("Bot Response to Turn 1:");
        console.log(botResponse1);

    } catch (error) {
        console.error("FAIL: Turn 1 error:", error);
        return;
    }

    // Turn 2: Provide the phone number and timing preference
    console.log("\n2. Turn 2: Providing phone number and timing preference...");
    const payload2 = {
        runtimeSessionId: chatSessionId,
        payload: {
            prompt: `Sure! My phone number is ${testPhone}. I also prefer to be contacted sooner, within the next 2 hours.`,
            phone_number: "anonymous"
        }
    };

    try {
        const res2 = await fetch("http://localhost:8080/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload2)
        });

        if (res2.status !== 200) {
            console.error("FAIL: Turn 2 failed with status:", res2.status);
            return;
        }

        const reader = res2.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let botResponse2 = "";
        let toolResultFound = false;

        while (!done) {
            const { value, done: rd } = await reader.read();
            done = rd;
            if (value) {
                const text = decoder.decode(value);
                const lines = text.split("\n");
                for (const line of lines) {
                    if (line.trim().startsWith("data: ")) {
                        try {
                            const data = JSON.parse(line.trim().slice(6));
                            if (data.response) {
                                botResponse2 += data.response;
                            }
                            if (data.tool_result) {
                                toolResultFound = true;
                                console.log("Found tool result event:", data.tool_result);
                            }
                        } catch (e) { }
                    }
                }
            }
        }

        console.log("Bot Response to Turn 2:");
        console.log(botResponse2);

        if (toolResultFound) {
            console.log("\nSUCCESS: Anonymous chat handoff triggered successfully!");
        } else {
            console.log("\nFAIL: Handoff was not triggered (tool_result missing).");
        }

    } catch (error) {
        console.error("FAIL: Turn 2 error:", error);
    }
}

valAnonymous();
