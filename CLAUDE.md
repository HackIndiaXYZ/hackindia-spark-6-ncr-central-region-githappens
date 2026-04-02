SupplyAlert — 3 Layer Architecture
🧱 1. Presentation Layer (Frontend / UI)
🎯 Purpose

Handles all user interaction, visualization, and demo experience

🛠️ Tech
Next.js
Tailwind CSS
Shadcn UI
Mapbox
Recharts
💡 Responsibilities
Dashboard (alerts, maps, charts)
Chat interface (AI assistant)
Simulation UI (inputs + results)
Action recommendations display
📦 Output

👉 Sends user queries → Application Layer
👉 Displays AI results, alerts, insights

⚙️ 2. Application Layer (Core Logic + AI Agents)
🎯 Purpose

The brain of the system — processes data, runs agents, makes decisions

🛠️ Tech
Node.js (or Next.js API routes)
LangChain
Azure OpenAI Service
🤖 Internal Components (VERY IMPORTANT)
1. Signal Processor
Ingests:
weather data
news events
mock disruptions
2. Agent Engine (Core USP 🔥)
Signal Agent → extracts events
Risk/Impact Agent → evaluates disruption probability
Decision Agent → suggests actions
3. Simulation Engine
Rule-based logic:
delay %
cost impact
Runs “what-if” scenarios
4. API Layer
/chat → AI responses
/simulate → scenario output
/alerts → current disruptions
📦 Output

👉 Sends structured results to frontend:

risk/impact level
reasoning
recommended actions
🗄️ 3. Data Layer (Data + Storage)
🎯 Purpose

Stores and provides data for simulation and AI reasoning

🛠️ Tech
Firebase (fastest)
OR
MongoDB
📊 Data Sources
1. Mock Data (Primary for Hackathon)
supply chain routes
suppliers
shipment data
2. External APIs (Optional)
weather API
news API
🧠 Stored Data
alerts
scenarios
simulation results
chat history