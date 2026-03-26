import type { UserIdentity } from '../engine';

interface IdentityCardProps {
  identity: Partial<UserIdentity>;
  onChange: (fields: Partial<UserIdentity>) => void;
}

export default function IdentityCard({ identity, onChange }: IdentityCardProps) {
  return (
    <div className="animate-slide-up space-y-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">Almost Done</h2>
        <p className="text-sm text-zinc-500">Provide your details to prepare your Trainerize account securely.</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1.5">First Name</label>
            <input 
              type="text" 
              value={identity.firstName || ''}
              onChange={e => onChange({ firstName: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none"
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1.5">Last Name</label>
            <input 
              type="text" 
              value={identity.lastName || ''}
              onChange={e => onChange({ lastName: e.target.value })}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none"
              placeholder="Doe"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-400 tracking-widest uppercase mb-1.5">Email Address</label>
          <input 
            type="email" 
            value={identity.email || ''}
            onChange={e => onChange({ email: e.target.value })}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3.5 text-sm text-zinc-900 focus:ring-2 focus:ring-zinc-900 outline-none"
            placeholder="jane@example.com"
          />
        </div>
      </div>
    </div>
  );
}
