const fs = require('fs');
const path = require('path');

const processEnv = {};
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
        processEnv[key] = val.trim();
      }
    }
  }
} catch (err) {
  console.error(err);
}

const clientId = processEnv.SF_CLIENT_ID;
const clientSecret = processEnv.SF_CLIENT_SECRET;
let myDomain = processEnv.SF_MY_DOMAIN || "";

// Clean up domain format
if (myDomain && !myDomain.startsWith("http")) {
  myDomain = "https://" + myDomain;
}
if (myDomain && myDomain.endsWith("/")) {
  myDomain = myDomain.slice(0, -1);
}

console.log("Testing OAuth 2.0 Client Credentials Flow...");
console.log("Client ID:", clientId);
console.log("My Domain URL:", myDomain);

async function testConnection() {
  const tokenUrl = myDomain
    ? `${myDomain}/services/oauth2/token`
    : "https://login.salesforce.com/services/oauth2/token";

  console.log("Configured Token Endpoint:", tokenUrl);

  const params = new URLSearchParams();
  params.append('grant_type', 'client_credentials');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);

  try {
    const tokenResponse = await fetch(tokenUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: params.toString()
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      console.error("Authentication FAILED:", tokenData);
      return;
    }

    console.log("AUTHENTICATION SUCCESS!");
    console.log("Instance URL:", tokenData.instance_url);
    console.log("Access Token starts with:", tokenData.access_token.slice(0, 15) + "...");

    // Test creating a mock Lead in Salesforce
    console.log("\nAttempting to create a test Lead in Salesforce...");
    const leadBody = {
      FirstName: "Test",
      LastName: "Salesforce Integration",
      Company: "Vishnu Institute of Technology (VIT)",
      Email: "test.integration@example.com",
      Phone: "+15551234567"
    };

    const createLeadRes = await fetch(`${tokenData.instance_url}/services/data/v58.0/sobjects/Lead`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadBody)
    });

    const createLeadData = await createLeadRes.json();
    if (createLeadRes.ok) {
      console.log("LEAD CREATION SUCCESS!");
      console.log("New Lead ID:", createLeadData.id);
    } else {
      console.error("Lead creation FAILED:", createLeadData);
    }

  } catch (err) {
    console.error("Error during connection test:", err);
  }
}

testConnection();
