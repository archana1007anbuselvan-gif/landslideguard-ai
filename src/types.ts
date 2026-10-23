export type Risk = 'Low' | 'Moderate' | 'High' | 'Critical';
export type ConnStatus = 'online' | 'stale' | 'offline';
export interface Station {
  id: string; name: string; lat: number; lng: number;
  rainfall: number; soil: number; tilt: number; vibration: number; // mm, %, deg, mm/s
  battery: number; signal: number; lastSeenMin: number; status: ConnStatus;
  score: number; risk: Risk;
}
export interface Reading { t: string; rainfall: number | null; soil: number | null; tilt: number | null; vibration: number | null; }
export interface Alert {
  id: string; stationId: string; location: string; severity: Risk; time: string;
  trigger: string; description: string; acknowledged: boolean; responder?: string;
}
