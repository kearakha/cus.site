import type { StepKey } from './steps';
import { STEP_LABELS, TOTAL_STEPS } from './steps';

export function ProgressBar({ current }: { current: StepKey }) {
  const pct = ((current - 1) / (TOTAL_STEPS - 1)) * 100;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500">
          Langkah {current} dari {TOTAL_STEPS}
        </span>
        <span className="text-xs font-medium text-slate-500">
          {STEP_LABELS[current]}
        </span>
      </div>
      <div className="relative h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-slate-900 transition-all duration-500 ease-out rounded-full"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
