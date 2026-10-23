import { useCallback, useState } from 'react';
import { Activity, BarChart3, Bell, BrainCircuit, FileText, LayoutDashboard, Map, Menu, Radio, Search, Settings, ShieldAlert, X } from 'lucide-react';
import { api, IS_DEMO } from './services/api';
import { useAsync } from './hooks';
import { Async, Card, DemoBadge } from './components/ui';
import Overview from './pages/Overview';
import Live from './pages/Live';
import StationDetail from './pages/StationDetail';
import Alerts from './pages/Alerts';
import StationMap from './components/StationMap';

const NAV = [
  ['Overview', LayoutDashboard], ['Live Monitoring', Activity], ['Risk Prediction', BrainCircuit], ['Landslide Risk Map', Map],
  ['Alerts & Notifications', Bell], ['Sensor Management', Radio], ['Historical Analytics', BarChart3], ['Reports', FileText], ['Settings', Settings]
] as const;

export default function App() {
  const [page, setPage] = useState<string>('Overview');
  const [sel, setSel] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const st = useAsync(api.stations, []);
  const al = useAsync(api.alerts, []);
  const stations = st.data ?? []; const alerts = al.data ?? [];
  const open = useCallback((id: string) => { setSel(id); setPage('Live Monitoring'); }, []);
  const go = (p: string) => { setPage(p); setSel(null); setMenu(false); };
  const ack = async (id: string) => { await api.acknowledge(id); al.reload(); };
  const unread = alerts.filter(a => !a.acknowledged).length;
  const station = stations.find(s => s.id === sel);

  const body = () => {
    if (page === 'Overview') return <Overview stations={stations} alerts={alerts} open={open} />;
    if (page === 'Live Monitoring') return station ? <StationDetail station={station} back={() => setSel(null)} /> : <Live stations={stations} open={open} />;
    if (page === 'Alerts & Notifications') return <Alerts alerts={alerts} ack={ack} />;
    if (page === 'Landslide Risk Map') return <Card title="Landslide risk map" right={<DemoBadge />}><StationMap stations={stations} onSelect={open} /></Card>;
    return <Card title={page}><p className="py-10 text-center text-slate-400">This page is planned for the next iteration. See the README for the build order.</p></Card>;
  };

  return (
    <div className="flex min-h-screen">
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-line bg-panel p-3 transition-transform md:static md:translate-x-0 ${menu ? 'translate-x-0' : '-translate-x-full'}`} aria-label="Main navigation">
        <div className="mb-4 flex items-center justify-between px-2 py-2"><span className="flex items-center gap-2 font-semibold text-white"><ShieldAlert className="text-accent" />LandslideGuard AI</span>
          <button className="md:hidden" onClick={() => setMenu(false)} aria-label="Close menu"><X /></button></div>
        <nav className="space-y-1">{NAV.map(([n, Icon]) => (
          <button key={n} onClick={() => go(n)} aria-current={page === n} className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm ${page === n ? 'bg-accent/15 text-accent' : 'text-slate-300 hover:bg-navy'}`}><Icon size={18} />{n}</button>))}</nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 flex flex-wrap items-center gap-3 border-b border-line bg-navy/95 px-4 py-3 backdrop-blur">
          <button className="md:hidden" onClick={() => setMenu(true)} aria-label="Open menu"><Menu /></button>
          <label className="relative hidden sm:block"><Search size={16} className="absolute left-2 top-2.5 text-slate-400" /><input aria-label="Search" placeholder="Search stations" className="w-56 rounded-md border border-line bg-panel py-1.5 pl-8 pr-2 text-sm" /></label>
          <select aria-label="Monitoring location" className="rounded-md border border-line bg-panel px-2 py-1.5 text-sm"><option>All sample locations</option>{stations.map(s => <option key={s.id}>{s.name}</option>)}</select>
          <div className="ml-auto flex items-center gap-4 text-xs text-slate-400">
            {IS_DEMO && <DemoBadge />}
            <span className="hidden lg:inline">Last update: {new Date().toLocaleTimeString()}</span>
            <button className="relative" onClick={() => go('Alerts & Notifications')} aria-label={`${unread} unread alerts`}><Bell size={20} className="text-slate-200" />
              {unread > 0 && <span className="absolute -right-2 -top-2 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">{unread}</span>}</button>
            <span className="hidden text-slate-200 sm:block">Demo User<br /><span className="text-slate-400">Field engineer</span></span>
          </div>
        </header>
        <main className="p-4 lg:p-6">
          <p className="mb-4 rounded-md border border-line bg-panel px-3 py-2 text-xs text-slate-400">Decision-support prototype. Simulated readings and risk estimates cannot predict real landslides and are not a certified life-safety system.</p>
          <Async loading={st.loading || al.loading} error={st.error || al.error} retry={() => { st.reload(); al.reload(); }}>{body()}</Async>
        </main>
      </div>
    </div>
  );
}
