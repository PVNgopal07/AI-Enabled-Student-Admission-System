# Student Admissions Portal - User Guide & Workflow Manual

This manual explains how the AI-Enabled Student Admission System works from a functional perspective. It covers the user journeys for both prospective students and counselor administrators, detailing how they interact with each module.

---

## 1. Prospective Student Journey

The student journey is designed to be self-explanatory, taking applicants from initial inquiry on the landing page to a successful admission registration ticket.

### Step 1: Navigating the Landing Page
* **User Interaction**:
  - The student visits the landing page (`http://localhost:3001/`).
  - They can view placement success rates, facilities, and available programs.
  - They can use the **Program Finder** dropdowns to filter available degrees and areas of study relative to the main Bhimavaram campus.
  - Clicking **Enroll Now** or **Find Your Program** redirects them to the multi-step admission wizard.

### Step 2: Form Intake (Steps 1 & 2)
* **User Interaction**:
  - **Step 1 (Personal Info)**: The candidate enters details like their Full Name, Date of Birth, Gender, Nationality (e.g. Indian), and Category (General, OBC, SC, ST).
  - **Step 2 (Academic Profile)**: The candidate inputs their 10th and 12th details. They must choose their **Entrance Exam Type** (AP EAPCET for first-year admission, or AP ECET for lateral diploma second-year entry) and input their respective rank score.

### Step 3: Branch Selection & Merit Cutoff Validation (Step 3)
* **User Interaction**:
  - The student selects their **Primary Branch Preference** (e.g., Computer Science & Engineering) and **Secondary Branch Preference**.
  - **Dynamic Cutoff Checks**: The page automatically verifies their entrance rank against institutional cutoffs for their selected course:
    * E.g., The AP EAPCET merit cutoff for CSE is **8,000**. If the candidate enters rank **12,000** and selects CSE as their primary choice under the Merit Quota, the form displays a red warning and blocks progress:
      > ⚠️ "Your AP EAPCET Rank (12000) exceeds the Merit Quota cutoff for CSE (8000). Please select another course or apply under General/No Scholarship."

### Step 4: Quota Selection & Live Fee Calculator
* **User Interaction**:
  - The student chooses a **Scholarship Quota / Category** from a select dropdown:
    * *General / No Scholarship*: flat 0% Discount.
    * *Sports Quota*: flat 20% Discount.
    * *EWS (Economically Weaker Section)*: flat 30% Discount.
    * *Board Topper (12th Grade 95%+)*: flat 50% Discount.
    * *Merit Quota*: Dynamically calculates a discount percentage based on their competitive entrance rank score (under 5k rank = 50% waiver, under 15k = 30%, under 30k = 15%).
  - **Interactive Widget**: As they toggle quotas, the live fee invoice updates at the bottom showing:
    * `Standard Tuition Fee` (e.g., ₹120,000)
    * `Applied Discount` (e.g., 30%)
    * `Final Payable Fee` (e.g., ₹84,000)

### Step 5: Submission & Ticket Receipt
* **User Interaction**:
  - The student selects the data authorization checklist and clicks **Submit**.
  - The application is written directly to the PostgreSQL database.
  - The student is presented with a success confirmation card with their unique student reference ticket (e.g. `VITB2026-A48293`).

---

## 2. Counselor Administrator Journey

The counselor portal allows university admissions officers to securely review, inspect, and approve pending applications.

### Step 1: Secure Administrator Login
* **User Interaction**:
  - The counselor goes to `/counselor/login`.
  - Enters secure administrative credentials.
  - On submission, the backend issues an HMAC-SHA256 authenticated security web token (JWT) which is stored for that browser session (expiring in 1 hour).

### Step 2: Dashboard Queue & Application Inspection
* **User Interaction**:
  - The counselor is redirected to their Dashboard.
  - They see a list of all applicants fetched dynamically from the database.
  - **Search & Filter Actions**: The counselor can type names in the search bar, filter by course branch, or isolate candidates by their approval status (Approved, Pending, Rejected).
  - Clicking on a candidate's line item opens the applicant details panel list.

### Step 3: Triggering AI Candidate analysis
* **User Interaction**:
  - The counselor clicks the **AI Insights** button on a student's card.
  - **Behind the Scenes**: The system queries Google Gemini AI using applicant data. Gemini evaluates qualifying credentials, discount parameters, and flags potential risks (such as a high discount requested with marginal entrance marks).
  - The AI returns status recommendations (e.g., "Normal priority" or "Requires Manager Override due to 40% discount").

### Step 4: Verification Override Actions
* **User Interaction**:
  - The counselor decides to approve or reject the application:
    * Standard discount applications can be approved instantly.
    * If the student requested a high discount (over 30%), the system flags it as "High Risk." The counselor can execute a **Manager Override** decision to authorize the seat.
  - When the counselor clicks **Approve**, the database updates the status to "Approved."
  - This trigger automatically syncs the contact details with the **Salesforce CRM Lead Pipeline** and sends a seat confirmation notice to the student's **WhatsApp via Twilio**.
