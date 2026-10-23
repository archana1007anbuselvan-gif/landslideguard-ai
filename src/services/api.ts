// Swap-ready API layer. Without VITE_API_URL it serves DEMO DATA.
// Proposed FastAPI endpoints (must be implemented by the backend before use):
//   GET /api/stations · GET /api/stations/{id}/readings · GET /api/alerts · POST /api/alerts/{id}/acknowledge
import type { Alert, Reading, Station } from '../types';
import { alerts as mockAlerts, makeReadings, stations as mockStations } from '../data/mock';

const BASE: string = import.meta.env.VITE_API_URL ?? '';
export const IS_DEMO = !BASE;
const wait = <T,>(v: T) => new Promise<T>(r => setTimeout(() => r(v), 400));

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(BASE + path, { headers: { 'Content-Type': 'application/json' }, ...init });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  stations: (): Promise<Station[]> => (IS_DEMO ? wait(mockStations) : http('/api/stations')),
  readings: (id: string): Promise<Reading[]> => (IS_DEMO ? wait(makeReadings(id)) : http(`/api/stations/${id}/readings`)),
  alerts: (): Promise<Alert[]> => (IS_DEMO ? wait(mockAlerts.map(a => ({ ...a }))) : http('/api/alerts')),
  acknowledge: async (id: string): Promise<void> => {
    if (IS_DEMO) { const a = mockAlerts.find(x => x.id === id); if (a) { a.acknowledged = true; a.responder = 'You (demo)'; } return wait(undefined); }
    await http(`/api/alerts/${id}/acknowledge`, { method: 'POST' });
  }
};
