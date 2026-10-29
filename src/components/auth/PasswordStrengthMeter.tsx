import React from 'react';
import { Check, X } from 'lucide-react';
import { PasswordCriteria } from '../../types/auth';

interface PasswordStrengthMeterProps {
  strength: {
    score: number;
    label: string;
    color: string;
  };
  criteria: PasswordCriteria;
  showCriteria?: boolean;
}

export const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  strength,
  criteria,
  showCriteria = true,
}) => {
  return (
    <div className="space-y-2 mt-2">
      {/* 4-segment strength bar */}
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4].map((step) => {
          const isFilled = strength.score >= step;
          return (
            <div
              key={step}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                isFilled ? strength.color : 'bg-slate-200'
              }`}
            />
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">Security rating:</span>
        <span className="font-semibold text-slate-700">{strength.label}</span>
      </div>

      {showCriteria && (
        <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5">
            {criteria.minLength ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={criteria.minLength ? 'text-slate-700' : 'text-slate-400'}>8+ characters</span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasUpper && criteria.hasLower ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={criteria.hasUpper && criteria.hasLower ? 'text-slate-700' : 'text-slate-400'}>
              Upper &amp; lowercase
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasNumber ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={criteria.hasNumber ? 'text-slate-700' : 'text-slate-400'}>At least 1 number</span>
          </div>

          <div className="flex items-center gap-1.5">
            {criteria.hasSpecial ? (
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={criteria.hasSpecial ? 'text-slate-700' : 'text-slate-400'}>Special symbol</span>
          </div>
        </div>
      )}
    </div>
  );
};
