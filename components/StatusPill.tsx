type StatusPillProps = {
  label: string;
  value?: string;
  icon?: string;
};

export default function StatusPill({ label, value, icon = "◉" }: StatusPillProps) {
  return (
    <div className="flex items-center gap-2 border border-cyan-400/20 bg-cyan-950/20 px-3 py-2 shadow-[inset_0_0_14px_rgba(0,217,255,0.05)]">
      <span className="text-[11px] text-cyan-300 drop-shadow-[0_0_8px_rgba(0,217,255,0.8)]">
        {icon}
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
        {label}
      </span>
      {value && (
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-300">
          {value}
        </span>
      )}
    </div>
  );
}
