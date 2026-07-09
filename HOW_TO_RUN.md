# How to Run the Admissions Portal Application

This guide contains the instructions to set up, launch, and test the admissions portal application.

---

## 1. Prerequisites
Ensure you have the following installed on your system:
* **Node.js** (v18 or higher recommended)
* **PostgreSQL** database service (running locally)

---

## 2. Environment Configuration
Check the dotenv configuration file located at:  
📂 `Backend/mock-server/.env`

Make sure the PostgreSQL credentials match your environment:
```dotenv
DATABASE_URL=postgresql://<database_user>:<database_password>@localhost:5432/vit_admissions
JWT_SECRET=<your_jwt_secret_key>
COUNSELOR_USERNAME=<your_counselor_username>
COUNSELOR_PASSWORD=<your_counselor_password>
```
*Note: The mock backend server contains automatic schema migration. If the `vit_admissions` database does not exist, the server will create it automatically on startup as long as the connection to the base `postgres` administrative service succeeds.*

---

## 3. Launching the Application

### Option A: Automatic Launch (Windows PowerShell)
Run the script in the project root to start both servers in separate windows:
```powershell
.\run-local.ps1
```

### Option B: Manual Launch (Command Line)
If you prefer running them in separate terminals:

1. **Start the Mock Backend Server**:
   ```bash
   cd Backend/mock-server
   npm install
   node server.js
   ```
   *Will be live at: http://localhost:8080*

2. **Start the Next.js Frontend Server**:
   ```bash
   cd Frontend
   npm install
   npm run dev
   ```
   *Will be live at: http://localhost:3001*

---

## 4. Application Access URLs & Credentials

Once running, access the web pages using these links:

* **Student Application Portal (Anonymous Registration)**:  
  🔗 [http://localhost:3001/](http://localhost:3001/) or [http://localhost:3001/apply](http://localhost:3001/apply)

* **Counselor Admissions Portal (Protected Dashboard)**:  
  🔗 [http://localhost:3001/counselor/login](http://localhost:3001/counselor/login)  
  * **Counselor Username**: The `COUNSELOR_USERNAME` value set in your `.env` (e.g. `counselor`)
  * **Counselor Password**: The `COUNSELOR_PASSWORD` value set in your `.env` (e.g. `counselor@vit`)  

---

## 5. Verification Test Suite
To verify backend routing, JWT tokens, PostgreSQL db insertions, and AI insights calculations, run the integration test script:
```bash
cd Backend/mock-server
node verify-dashboard-endpoints.js
```
All tests should display `SUCCESS` and finish with `🎯 ALL LIVE ADMISSIONS ALIGNMENT TESTS PASSED!`.
