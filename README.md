# Medical Third Opinion

An advanced, AI-powered health intelligence platform designed to empower users with symptom analysis, real-time disease tracking, and comprehensive health monitoring.

## 🌟 Key Features

### 1. **Agentic AI Symptom Checker**
- **Follow-up Intelligence:** Powered by **Groq (llama-3.3-70b-versatile)**, the AI acts as an autonomous agent. If your symptoms are vague, it actively asks you follow-up questions to narrow down the diagnosis before making a prediction.
- **Massive Medical Dataset:** The underlying database uses a robust dictionary of 100+ highly detailed medical conditions, including respiratory, cardiovascular, neurological, infectious, and oncological diseases.
- **Urgency Assessment:** Evaluates symptoms to provide immediate advice (e.g., "Seek Emergency Care", "Consult a Specialist").
- **Actionable Advice:** Provides detailed precautions, medications, and general health tips for predicted conditions.

### 2. **Proactive AI Health Assistant**
- **Agentic Chatbot:** The AI chatbot utilizes Groq and native tool-calling to fetch your live health metrics and profile data on the fly. It is instructed to proactively ask probing medical questions to get to the root of your issues.
- **Streaming Responses:** Real-time conversational interface with chat history persistence.

### 3. **Smart Health Monitoring**
- **Vitals Logging:** Log heart rate, SpO2, sleep patterns, steps, and body temperature.
- **Trend Analytics:** Interactive charts (Recharts) visualizing 7-day health trends.
- **Weekly Summaries:** Aggregated reports on health activity and vitals.
- **Critical Alerts:** Real-time browser notifications for dangerous vital sign deviations (e.g., Tachycardia, Low SpO2).

### 4. **Geospatial Outbreak Tracking**
- **Sleek Minimalist Map:** A highly polished, interactive map powered by Leaflet and CartoDB Dark Matter tiles, visualizing real-time disease cases across regions without clutter.
- **Epidemic Alerts:** Automated system that triggers alerts when case density in a region exceeds safety thresholds.
- **Live Updates:** Real-time reporting and map synchronization via Supabase.

### 5. **Premium User Experience**
- **Rich Aesthetics:** Modern Teal/Medical design theme with Glassmorphism, tailored gradients, and premium animations (Framer Motion).
- **Comprehensive Landing Page:** Detailed overview of features, how it works, and testimonials.
- **Health Profile:** Maintain a baseline medical profile (Blood Group, Height, Weight, etc.) for more accurate AI predictions.

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Lucide React
- **UI Components:** Shadcn/UI (Radix UI)
- **State Management:** React Query (@tanstack/react-query)
- **Database & Auth:** Supabase (PostgreSQL)
- **Backend Logic:** Supabase Edge Functions (Deno, TypeScript)
- **AI Model:** Groq API (llama-3.3-70b-versatile) for high-speed, agentic inference
- **Charts:** Recharts
- **Mapping:** Leaflet.js with CartoDB Dark Matter

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Supabase Project
- Groq API Key

### Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd symptom-identifier-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize Database:**
   Run the SQL scripts in `supabase/migrations/` and `supabase/seed_diseases.sql` inside your Supabase SQL Editor.

5. **Deploy Edge Functions:**
   You must set the Groq API key in your Supabase secrets first:
   ```bash
   npx supabase secrets set GROQ_API_KEY=your_groq_api_key
   npx supabase functions deploy predict-disease
   npx supabase functions deploy health-chat
   ```

6. **Run the application:**
   ```bash
   npm run dev
   ```

## 📊 Database Schema

The platform uses a robust relational schema in Supabase:
- `diseases`: Massive core dataset for the prediction engine (100+ conditions).
- `disease_reports`: User-submitted disease reports for map tracking.
- `epidemic_alerts`: Automatically generated regional alerts.
- `profiles`: User health profiles and metadata.
- `health_metrics`: Time-series data for vitals and activity tracking.
- `chat_messages`: Persistent history for the AI health assistant.

## ⚖️ Disclaimer

**Medical Third Opinion is for informational and educational purposes only.** It is NOT a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
