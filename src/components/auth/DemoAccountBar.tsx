import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Sliders, UserCheck, Shield } from 'lucide-react';
import { SimulationControlModal } from './SimulationControlModal';

interface DemoAccountBarProps {
  onSelectRole?: (role: 'admin' | 'dev') => void;
}

export const DemoAccountBar: React.FC<DemoAccountBarProps> = ({ onSelectRole }) => {
  const { simulatedDelay, simulateError } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="bg-slate-100/80 border border-slate-200/80 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            Quick Test Accounts:
          </span>
          {onSelectRole && (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onSelectRole('admin')}
                className="px-2.5 py-1 font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
                title="Email: alex@whatbytes.com | Pass: Password123!"
              >
                Admin (Alex)
              </button>
              <button
                type="button"
                onClick={() => onSelectRole('dev')}
                className="px-2.5 py-1 font-medium bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors shadow-2xs"
                title="Email: sarah@whatbytes.com | Pass: Welcome2026!"
              >
                Developer (Sarah)
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <Sliders className="w-3 h-3 text-indigo-600" />
            <span>Simulator ({simulatedDelay}ms</span>
            {simulateError !== 'none' && (
              <span className="text-amber-600 font-semibold flex items-center gap-0.5">
                <Shield className="w-2.5 h-2.5" /> Error
              </span>
            )}
            <span>)</span>
          </button>
        </div>
      </div>

      <SimulationControlModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
