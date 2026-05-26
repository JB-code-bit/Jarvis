import type { ReactNode } from "react";

type HudPanelProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  tabClassName?: string;
};

export default function HudPanel({
  title,
  children,
  className = "",
  tabClassName = ""
}: HudPanelProps) {
  return (
    <section className={`hud-panel overflow-hidden p-4 ${className}`}>
      {title && (
        <div
          className={`hud-title-tab mx-auto mb-4 w-[72%] px-4 py-2 text-center ${tabClassName}`}
        >
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-cyan-100">
            {title}
          </h2>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}
