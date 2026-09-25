import { CloudOff } from 'lucide-react';

// Deliberately quiet and visually distinct from the WipBand/status pill:
// this means "finished, but not hosted anywhere" — not "unfinished".
export function NotDeployedTag({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      title="Finished, but not hosted anywhere. Runs locally from source."
      className={cnSize(
        'inline-flex items-center gap-1.5 rounded-full border border-dashed border-light/25 text-light/60 font-sans uppercase tracking-[0.15em]',
        size,
      )}
    >
      <CloudOff size={size === 'sm' ? 10 : 12} />
      Not deployed
    </span>
  );
}

function cnSize(base: string, size: 'sm' | 'md') {
  return `${base} ${size === 'sm' ? 'px-2 py-0.5 text-[9px]' : 'px-2.5 py-1 text-[10px]'}`;
}
