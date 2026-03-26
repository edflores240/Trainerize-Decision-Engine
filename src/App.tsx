// file: src/App.tsx -> Update imports and render
import { useState } from 'react';
import SurveyWizard from './components/SurveyWizard';
import ResultDispatcher from './components/ResultDispatcher';
import type { DecisionPacket, SurveyInput } from './engine';
import { triage } from './engine';

import AdminDashboard from './components/admin/AdminDashboard';

type AppState = 'survey' | 'result' | 'admin';

export default function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    // Basic routing trick: if URL has ?admin=true, start there
    if (typeof window !== 'undefined' && window.location.search.includes('admin=true')) {
      return 'admin';
    }
    return 'survey';
  });
  const [result, setResult] = useState<DecisionPacket | null>(null);
  const [input, setInput] = useState<SurveyInput | null>(null);

  if (appState === 'admin') {
    return <AdminDashboard onExit={() => {
        window.history.pushState({}, '', window.location.pathname);
        setAppState('survey');
    }} />;
  }

  const handleComplete = (surveyInput: SurveyInput) => {
    const decision = triage(surveyInput);
    setInput(surveyInput);
    setResult(decision);
    setAppState('result');
  };

  const handleReset = () => {
    setResult(null);
    setInput(null);
    setAppState('survey');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col md:py-12 px-0 md:px-6">
      
      {/* Header - Only visible on desktop where the cards are centered. Mobile is full screen */}
      <header className="hidden md:block max-w-lg mx-auto w-full mb-8 text-center animate-fade-in">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900">
          Fitness Engine
        </h1>
        <p className="text-sm text-zinc-500 mt-1">Intelligent Clinical Triage Protocol</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center w-full">
        {appState === 'survey' && (
          <SurveyWizard onComplete={handleComplete} />
        )}
        
        {appState === 'result' && result && (
          <ResultDispatcher 
            packet={result} 
            input={input!} 
            onReset={handleReset} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="hidden md:block max-w-lg mx-auto w-full mt-12 text-center animate-fade-in">
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>v1.2.0 Engine Matrix</span>
          <button
             onClick={() => {
                 window.history.pushState({}, '', '?admin=true');
                 setAppState('admin');
             }}
             className="text-zinc-400 hover:text-zinc-900 transition-colors font-medium"
          >
            Admin Dashboard →
          </button>
        </div>
      </footer>
    </div>
  );
}
