import * as React from 'react';
import { Calendar as CalendarIcon, ChevronDown, Check } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

export type DateRangePreset = 'today' | '7d' | '30d' | '90d' | 'ytd';

interface DateRangePickerProps {
  selectedPreset: DateRangePreset;
  onSelectPreset: (preset: DateRangePreset) => void;
  className?: string;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  selectedPreset,
  onSelectPreset,
  className,
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const presets: { id: DateRangePreset; label: string; range: string }[] = [
    { id: 'today', label: 'Today', range: 'Oct 29, 2026' },
    { id: '7d', label: 'Last 7 Days', range: 'Oct 22, 2026 - Oct 29, 2026' },
    { id: '30d', label: 'Last 30 Days', range: 'Sep 29, 2026 - Oct 29, 2026' },
    { id: '90d', label: 'Last 90 Days', range: 'Jul 31, 2026 - Oct 29, 2026' },
    { id: 'ytd', label: 'Year to Date', range: 'Jan 01, 2026 - Oct 29, 2026' },
  ];

  const current = presets.find((p) => p.id === selectedPreset) || presets[2];

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative inline-block text-left', className)} ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 gap-2 text-xs font-normal border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200"
      >
        <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
        <span className="font-medium">{current.label}:</span>
        <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] hidden sm:inline">
          {current.range}
        </span>
        <ChevronDown className="w-3 h-3 text-zinc-400" />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-lg z-50">
          <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider px-2 py-1">
            Filter Period
          </div>
          <div className="space-y-1">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onSelectPreset(preset.id);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer',
                  selectedPreset === preset.id
                    ? 'bg-zinc-100 dark:bg-zinc-800 font-semibold text-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900'
                )}
              >
                <div>
                  <div>{preset.label}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{preset.range}</div>
                </div>
                {selectedPreset === preset.id && (
                  <Check className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100 shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
