# 🩺 Symptom Identifier

A full-stack AI-powered disease prediction and epidemic tracking web application built with **React**, **Vite**, **Supabase**, and a custom **KNN prediction model**.

---

## ✨ Features

### 🔍 Symptom Checker
- Enter your symptoms to receive AI-powered disease predictions
- KNN (K-Nearest Neighbours) model trained on 55+ diseases from the Supabase `diseases` table
- Fuzzy & weighted symptom matching for accurate predictions
- Confidence scores, severity levels, matched symptoms, precautions & medications shown per prediction
- Links to Apollo Pharmacy, 1mg, PharmEasy & Netmeds for medications
- Report any predicted case directly for epidemic tracking

### 🗺️ Disease Map
- Interactive Leaflet.js map showing disease case reports across India
- Filter by disease type and time period (24h / 7 days / 30 days / all time)
- Severity-coded map markers; alert regions are highlighted in red
- Top hotspot regions listed with case counts
- Real-time updates via Supabase Realtime subscriptions

### 🔔 Epidemic Alerts
- Real-time monitoring of disease outbreak thresholds by region
- Auto-generated alerts when case counts exceed configurable thresholds
- Colour-coded alert levels: Low → Medium → High → Critical
- Disease distribution bar charts (last 7 days)
- Communicable disease breakdown stats

### 👤 User Authentication & Profiles
- Supabase Auth (email/password + OAuth)
- Auto-created user profile on signup
- Row Level Security (RLS) on all tables

---

## 🧠 Prediction Model

The prediction engine is a **custom KNN model** with fuzzy matching:

| Component | Detail |
|---|---|
| Algorithm | K-Nearest Neighbours (k=5) with weighted scoring |
| Training data | `diseases` table in Supabase (55+ diseases, 400+ symptoms) |
| Matching | Fuzzy + word-level partial matching |
| Scoring | 60% user-symptom match ratio + 40% disease-symptom coverage |
| Confidence | Scaled 0–100%, with bonus for 3+ matched symptoms |
| Location | Runs server-side via **Supabase Edge Function** (`predict-disease`) |

---

## 🗄️ Database Schema

| Table | Purpose |
|---|---|
| `diseases` | Master list of 55+ diseases with symptoms, precautions, medications |
| `disease_reports` | Case reports submitted by users (with lat/lng for map) |
| `epidemic_alerts` | Auto-generated alerts when case thresholds are exceeded by region |
| `profiles` | User profile data (auto-created on signup) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/)
- A [Supabase](https://supabase.com/) project

### Installation

1. **Clone the repository:**
   ```sh
   git clone <YOUR_GIT_URL>
   cd symptom-identifier
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**

   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-public-key>
   VITE_SUPABASE_PROJECT_ID=<your-project-id>
   ```

4. **Set up the database schema:**

   In your Supabase dashboard → **SQL Editor**, run:
   ```
   supabase/migrations/20260117144352_*.sql
   ```

5. **Seed the diseases dataset (required for predictions):**

   In your Supabase dashboard → **SQL Editor**, run the full contents of:
   ```
   supabase/seed_diseases.sql
   ```
   This seeds **55+ diseases** and sample epidemic data for the map/alerts tabs.

6. **Deploy the prediction Edge Function:**
   ```sh
   npx supabase functions deploy predict-disease --project-ref <your-project-id>
   ```

7. **Start the development server:**
   ```sh
   npm run dev
   ```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Map | [React Leaflet](https://react-leaflet.js.org/) + OpenStreetMap |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Realtime) |
| Prediction | Custom KNN model via [Supabase Edge Functions](https://supabase.com/docs/guides/functions) (Deno) |
| State / Data | [TanStack Query (React Query)](https://tanstack.com/query) |
| Notifications | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── symptom-checker/   # Symptom input + prediction results
│   ├── map/               # Disease map (Leaflet)
│   ├── epidemic/          # Epidemic alerts panel
│   ├── report/            # Report case dialog
│   └── layout/            # Header, navigation
├── hooks/
│   └── useDiseases.tsx    # React Query hooks for Supabase data
├── integrations/
│   └── supabase/          # Supabase client + TypeScript types
├── lib/
│   ├── knn.ts             # KNN prediction algorithm
│   ├── types.ts           # Shared TypeScript types
│   └── utils.ts           # Alert calculation utilities
└── pages/
    └── Dashboard.tsx       # Main application page

supabase/
├── functions/
│   └── predict-disease/   # Deno Edge Function for server-side KNN
├── migrations/            # Database schema
└── seed_diseases.sql      # 55+ disease training data + sample reports
```

---

## 📝 Recent Changes

- ✅ Fixed **Disease Map** tab crash (`INDIA_CENTER` constant missing + `alerts` prop not destructured)
- ✅ Fixed **Alerts** tab crash (same root cause as above)
- ✅ **Expanded diseases database** from 10 → **55+ diseases** across 10 categories
- ✅ Added **sample disease reports** across 7 Indian states for map visualization
- ✅ Added **7 seed epidemic alerts** so the Alerts tab shows real data

---

## ⚠️ Disclaimer

This application is for informational and educational purposes only. Predictions are AI-generated and **should not replace professional medical advice**. Always consult a qualified healthcare provider for medical diagnosis.
