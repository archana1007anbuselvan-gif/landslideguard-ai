# LandslideGuard AI (frontend prototype)

React + TypeScript + Vite + Tailwind + Recharts + Leaflet. **All data is simulated (DEMO DATA).**
This is a decision-support prototype, not a certified life-safety system, and it cannot predict real landslides.

## Run
    npm install
    npm run dev        # http://localhost:5173
    npm run build      # production build

## Structure
- `src/services/api.ts` – API layer. Empty `VITE_API_URL` = demo data; set it (copy `.env.example` to `.env`) to use a FastAPI backend.
- `src/data/mock.ts` – simulated stations, readings (with gaps), alerts. Sample coordinates are arbitrary.
- `src/pages/` – Overview, Live, StationDetail, Alerts. `src/components/` – Trend chart, StationMap, UI parts.

## Included now
Navigation, KPIs, risk map, charts, live monitoring filters, station details, alert acknowledgement with confirmation, loading/error/empty/stale/offline states.

## Next iterations
Risk Prediction, Sensor Management, Historical Analytics (date ranges, CSV export), Reports, Settings and notification preferences, tests.
