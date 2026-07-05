# Vishnu Institute of Technology (VIT) - AI-Enabled Student Admission System

An AI-enabled admissions web application customized for the **Vishnu Institute of Technology (VIT)**. The system features a responsive **Next.js frontend** integrated with a **Node.js/Express mock-server backend** that facilitates student lead capture, AI-powered conversational support, Salesforce CRM syncing, and WhatsApp notifications via Twilio (using free-tier sandbox/hosting services like Vercel and Render).

---

## Table of Contents

| Section | Description |
| :--- | :--- |
| [Key Features](#key-features) | Core capabilities of the platform |
| [Directory Structure](#directory-structure) | Repository layout and folder description |
| [Getting Started](#getting-started) | Local development setup for frontend and backend |
| [Free-Tier Deployment](#free-tier-deployment) | Production hosting instructions |
| [Subpages & Routing](#subpages--routing) | Available route systems and features |
| [License](#license) | Project license information |

---

## Key Features

- **Intelligent Admissions Chatbot (Nemo)**: Assists students with program structures, admissions schedules, and university details.
- **Smart Inquiry Form**: Seamlessly captures student leads and transfers them directly into the Admissions interface.
- **Multi-Step Application Wizard (`/apply`)**: High-fidelity B.Tech registration wizard capturing personal, entrance exam (EAPCET/VITB code), and branch choice fields.
- **Salesforce CRM Sync**: Automatically pushes inquiry submissions and handoffs as Leads/Tasks to a Salesforce Developer Sandbox.
- **WhatsApp Follow-Ups**: Dynamically coordinates Twilio WhatsApp Sandbox templates to confirm admissions officer handoffs.
- **Responsive Program Finder**: Lets students search and self-route straight to B.Tech, M.Tech, and Ph.D. curriculum resources.

---

## Directory Structure

```
AI-Enabled Student Admission System/
├── Backend/
│   └── mock-server/                 # Express.js API Platform
│       ├── .env                     # Server Env credentials (Salesforce/Twilio)
│       └── server.js                # Host router and API endpoints
│
├── Frontend/                        # Next.js Web App
│   ├── app/                         # App Router (Home, About, Help, Apply, Programmes, Scholarships)
│   ├── components/                  # UI Components (Header, Landing, Nemo Chat, inquiry-form)
│   ├── public/                      # Brand assets (logo-vishnu.png, favicons)
│   └── package.json                 # Project dependencies
│
├── docs/                            # Developer guides and API specifications
│   ├── APIdoc.md
│   ├── architectureDeepDive.md
│   ├── deploymentGuide.md
│   ├── modificationGuide.md
│   └── userGuide.md
│
├── LICENSE                          # MIT License
└── README.md                        # This file
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/)

### 1. Run the Backend API Server

Open a terminal window and set up the server:

```bash
cd Backend/mock-server
npm install
node server.js
```

Ensure you configure a `.env` file containing your Salesforce and Twilio sandbox credentials (see `Backend/mock-server/.env` template).

### 2. Run the Next.js Frontend

Open another terminal window and start the dev server:

```bash
cd Frontend
npm install
npm run dev
```

Browse to [http://localhost:3000](http://localhost:3000) to view the portal.

---

## Free-Tier Deployment

To host this setup for free, consult a hosting flow leveraging:
1. **Frontend**: Host the `Frontend` Next.js codebase on the [Vercel Hobby Tier](https://vercel.com).
2. **Backend**: Host the `Backend/mock-server` Node.js code on the [Render Web Services Free Tier](https://render.com).
3. **Database/CRM**: Use a free [Salesforce Developer Sandbox](https://developer.salesforce.com/).
4. **SMS/WhatsApp Gateway**: Use the [Twilio Developer Sandbox](https://www.twilio.com/).

---

## Subpages & Routing

- **Home Page (`/`)**: Main portal showcasing the hero slides, academics/placements/research sidebars, and program search tools.
- **Admission Wizard (`/apply`)**: Step-by-step seat registration capturing EAPCET ranks and branch selection.
- **Academic Specifications (`/programmes/ug`, `/programmes/pg`, `/programmes/phd`)**: Fee catalogs, branch information, and intake allocations.
- **Scholarships Section (`/scholarships`)**: Detailed Andhra Pradesh Jaganna Vidya Deevena (JVD) qualifications and checklists.
- **About Info (`/about`)**: Constituent college statistics (2 states, 4 campuses, autonomous NAAC/NBA status).
- **Get Help (`/get-help`)**: Fast support options linking directly to phone logs and live chatbot redirection.

---

## License

This project is distributed under the [MIT License](./LICENSE). Refer to the license file for full details.
