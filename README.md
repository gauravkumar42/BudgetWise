# 💰 BudgetWise — AI-Driven Expense Tracker and Budget Advisor

A modern, minimalist, full-stack **MERN** (MongoDB, Express, React, Node.js) application for tracking
personal expenses, managing category budgets, and getting AI-powered financial advice — all in
**Indian Rupees (₹)**.

---

## ✨ Features

- 📊 **Dashboard** — balance, income, expenses, savings rate, expense breakdown chart, recent transactions, AI insights
- 💸 **Transactions** — add/edit/delete income & expenses, filter by type/category/month, search by note
- 🎯 **Budgets** — set monthly category budgets with live progress bars and over-budget alerts
- 🤖 **AI Advisor** — chat interface that tries a **free, no-signup AI API** first, and **automatically
  falls back to a 100% offline, rule-based local advisor** if the AI API is ever unavailable — so advice
  is *always* available.
- 📈 **Reports** — 6-month trend line chart, income vs expense bar chart, category pie chart, top-category ranking
- ⚙️ **Settings** — update name & monthly income goal, sign out
- 🔐 **Simple auth** — no passwords. Users sign in instantly with just their email (auto-registers on first login)
- 📱 **Fully responsive** — sidebar nav on desktop, collapsible drawer + bottom nav bar on mobile
- 🎨 **Modern minimalist UI** — Indigo/Emerald/Rose color palette, Google Fonts (Poppins + Inter),
  Material Icons + Font Awesome, smooth transitions and hover/click micro-interactions

---

## 🗂️ Project Structure

```
budgetwise/
├── backend/                 # Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/         # auth, transactions, budgets, advisor
│   ├── middleware/          # JWT auth, error handler
│   ├── models/               # User, Transaction, Budget (Mongoose)
│   ├── routes/
│   ├── utils/
│   │   ├── localAdvisor.js  # 100% offline rule-based advice engine
│   │   └── aiService.js     # free no-key AI API caller (with timeout + fallback)
│   ├── server.js
│   └── package.json
│
└── frontend/                 # React (Vite) SPA
    ├── src/
    │   ├── components/       # Sidebar, forms, charts, chat UI, etc.
    │   ├── context/          # AuthContext, ToastContext
    │   ├── pages/             # Dashboard, Transactions, Budgets, Advisor, Reports, Settings, Login
    │   ├── services/          # api.js (axios), constants.js
    │   ├── index.css          # full design system
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ and npm
- **MongoDB** running locally (`mongodb://127.0.0.1:27017`) OR a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` if needed:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/budgetwise
JWT_SECRET=change_this_to_a_long_random_secret
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```

Start the API server:
```bash
npm run dev
```
The API will run at `http://localhost:5000`. Test it: `http://localhost:5000/api/health`

### 2. Frontend Setup

Open a **new terminal**:
```bash
cd frontend
npm install
npm run dev
```
The app will run at `http://localhost:5173` (Vite dev server proxies `/api` calls to the backend automatically).

### 3. Use the App
- Open `http://localhost:5173`
- Enter any valid email (and optional name) to instantly sign in — no password, no signup form.
- Start adding transactions, set budgets, and chat with the AI Advisor!

---

## 🤖 How the AI Advisor Works

1. When you ask a question, the backend first tries a **free, no-authentication AI text API**
   (Pollinations.ai — `https://text.pollinations.ai`), which requires **no API key, login, or signup**.
2. The request has a strict 8-second timeout.
3. If the AI API fails for **any reason** (network issue, downtime, rate limits, timeout, empty response),
   the backend **automatically and silently falls back** to `utils/localAdvisor.js` — a fully offline,
   rule-based financial reasoning engine that analyzes your actual transactions & budgets to generate
   relevant, useful advice (savings rate analysis, budget breach warnings, top-category detection, etc).
4. The chat UI shows a small tag ("AI Advisor" or "Local Advisor") so you always know which engine answered.

This guarantees the Advisor feature **never breaks**, even with zero internet access to third-party AI
services — satisfying the "1% AI API fails" reliability requirement.

---

## 🔒 Authentication Model

Per your requirements, there is **no traditional login/signup system** with passwords. Instead:
- User enters an email (+ optional display name)
- Backend finds or auto-creates a `User` document for that email
- A JWT is issued and stored in `localStorage`
- All API routes (except `/auth/login`) require this token

This supports multiple users cleanly while staying maximally simple for the end user.

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--primary` | `#4F46E5` (Indigo) | Primary actions, active nav, links |
| `--secondary` | `#10B981` (Emerald) | Income, positive values, success states |
| `--danger` | `#F43F5E` (Rose) | Expenses, negative values, warnings |
| `--warning` | `#F59E0B` (Amber) | Near-budget-limit alerts |
| Fonts | Poppins (headings), Inter (body) | via Google Fonts CDN |
| Icons | Material Icons Round + Font Awesome 6 | via CDN |

All currency throughout the app is formatted using `en-IN` locale with the **₹** symbol.

---

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, React Router v6, Axios, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, express-rate-limit
**AI:** Pollinations.ai free text API (primary) + custom rule-based engine (fallback)

---

## 📦 Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# outputs static files to frontend/dist — deploy to Vercel/Netlify/any static host
```

**Backend:**
```bash
cd backend
npm start
# deploy to Render/Railway/any Node host, set env vars there
```

Remember to update `CLIENT_URL` in the backend `.env` and the frontend's API base URL / proxy target
for your production domains.

---

## 📄 License

Free to use and modify for personal or educational purposes.
