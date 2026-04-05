# SupplyAlert: AI-Powered Supply Chain Intelligence

Next-Generation Supply Chain Resilience Platform featuring the **Navi Multi-Agent Intelligence System**.

## 🏗️ Architecture
- **Frontend**: Next.js 15, Tailwind CSS, Lucide, Recharts, Framer Motion.
- **Backend**: Express.js, Navi AI Pipeline (RAG + Agents), weather/news API integration.
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 🌐 Deployment (Vercel)

1. **Frontend**: Connect the `frontend` directory to a Vercel project.
2. **Backend**: Host the `backend` directory on a platform like Render or Railway.
3. **Connect**: Set `NEXT_PUBLIC_API_URL` in your Vercel project to your backend's URL.

## 🤖 Navi Intelligence
Navi uses an autonomous agent pipeline:
- **RAG Pipeline**: Retrieves relevant historical disruption data.
- **Signal Agent**: Ingests live weather and news.
- **Impact Agent**: Quantifies logistics risks.
- **Decision Agent**: Generates actionable recommendations.
