import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mockAuthApi } from '../../services/mockAuthApi';
import { X, Sliders, AlertTriangle, RotateCcw, Clock, ShieldAlert } from 'lucide-react';
import { SimulateErrorMode } from '../../types/auth';

interface SimulationControlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulationControlModal: React.FC<SimulationControlModalProps> = ({ isOpen, onClose }) => {
  const { simulatedDelay, setSimulatedDelay, simulateError, setSimulateError } = useAuth();

  if (!isOpen) return null;

  const handleResetDb = () => {
    mockAuthApi.resetToDefaults();
    window.location.reload();
  };

  const errorOptions: { id: SimulateErrorMode; label: string; desc: string }[] = [
    { id: 'none', label: 'Normal API (Success / Valid validation)', desc: 'Realistically authenticates against mock database' },
    { id: 'invalid_credentials', label: 'Force 401 Invalid Credentials', desc: 'Simulates wrong password/unregistered email' },
    { id: 'email_exists', label: 'Force 409 Email Already Taken', desc: 'Simulates duplicate signup conflict' },
    { id: 'rate_limited', label: 'Force 429 Rate Limited', desc: 'Simulates account lockout response' },
    { id: 'server_500', label: 'Force 500 Server Exception', desc: 'Simulates internal backend outage' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Backend API Simulator Controls</h3>
              <p className="text-xs text-slate-500">Configure simulated latency and mocked server responses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Latency Control */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Simulated Network Delay (Latency)
              </label>
              <span className="text-xs font-mono font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm">
                {simulatedDelay}ms
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="2500"
              step="100"
              value={simulatedDelay}
              onChange={(e) => setSimulatedDelay(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Fast (100ms)</span>
              <span>Typical (800ms)</span>
              <span>Slow 3G (2500ms)</span>
            </div>
          </div>

          {/* Error Injection */}
          <div>
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Mock Server Response Mode
            </label>
            <div className="space-y-2">
              {errorOptions.map((opt) => (
                <label
                  key={opt.id}
                  className={`flex items-start gap-3 p-2.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                    simulateError === opt.id
                      ? 'border-indigo-600 bg-indigo-50/40 text-slate-900 font-medium'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="simulate_error"
                    checked={simulateError === opt.id}
                    onChange={() => setSimulateError(opt.id)}
                    className="mt-0.5 accent-indigo-600"
                  />
                  <div>
                    <div className="font-semibold text-slate-900">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 font-normal">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Database Reset */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-900">Reset Mock Database</div>
              <div className="text-[11px] text-slate-500">Restore default demo accounts &amp; unlock all emails</div>
            </div>
            <button
              type="button"
              onClick={handleResetDb}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset DB
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Apply &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
