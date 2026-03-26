import { Activity, LayoutDashboard, Settings, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  sandbox: ReactNode;
  onExit: () => void;
}

export default function AdminLayout({ children, sandbox, onExit }: AdminLayoutProps) {
  return (
    <div className="flex h-[100dvh] bg-zinc-50 text-zinc-600 overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-64 border-r border-zinc-200 bg-white p-6 flex flex-col hidden md:flex shrink-0">
        <div className="flex items-center gap-3 text-zinc-900 mb-10">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold tracking-tight text-lg text-zinc-900">Engine Admin</span>
        </div>

        <nav className="flex-1 space-y-1.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 bg-zinc-100/80 text-zinc-900 rounded-lg font-medium transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            Rule Matrix
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 rounded-lg font-medium transition-colors">
            <Settings className="w-4 h-4" />
            Integrations
          </button>
        </nav>

        <div className="pt-6 mt-6 border-t border-zinc-100">
          <button
            onClick={onExit}
            className="w-full flex items-center gap-3 px-3 py-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to App
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-50/50">
        {/* Top Navbar */}
        <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-8 bg-white shrink-0">
          <div>
            <h1 className="text-sm font-semibold text-zinc-800 tracking-wide uppercase">Rule Matrix Manager</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-medium text-zinc-500 flex items-center bg-zinc-100 px-3 py-1.5 rounded-full">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 mr-2 shadow-[0_0_8px_rgba(16,185,129,0.4)] animate-pulse"></span>
              Live Database Connected
            </div>
          </div>
        </header>

        {/* Workspace */}
        <div className="flex-1 overflow-auto p-6 md:p-10 relative">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>

      {/* Right Sidebar: Live Sandbox */}
      <aside className="w-80 border-l border-zinc-200 bg-white flex flex-col hidden lg:flex shrink-0 shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.05)] z-10">
        <header className="px-6 py-5 border-b border-zinc-100 bg-white shrink-0">
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            Live Sandbox
          </h2>
          <p className="text-xs text-zinc-500 mt-1">
            Test rules in real-time before saving to disk.
          </p>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {sandbox}
        </div>
      </aside>

    </div>
  );
}
