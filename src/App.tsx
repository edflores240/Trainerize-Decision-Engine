import { useState } from 'react';
import TriageDashboard from './components/TriageDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

type AppState = 'dashboard' | 'admin';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    // Basic routing trick: if URL has ?admin=true, start there
    if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
      return 'admin';
    }
    return 'dashboard';
  });

  if (appState === 'admin') {
    return <AdminDashboard onExit={() => {
        window.history.pushState({}, '', window.location.pathname);
        setAppState('dashboard');
    }} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans flex flex-col md:py-12 px-0 md:px-6">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full mb-8 flex justify-between items-center animate-fade-in px-4 lg:px-0 mt-4 md:mt-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900">
            Fitness Triage Engine
          </h1>
          <p className="text-sm text-zinc-500 mt-1">v2 Heuristic Routing Architecture</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        {appState === 'dashboard' && <TriageDashboard />}
      </main>
    </div>
  );
}
