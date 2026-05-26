import type { ButtonHTMLAttributes, ReactNode } from "react";

type NeonButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "solid" | "ghost";
};

export default function NeonButton({
  children,
  variant = "solid",
  className = "",
  ...props
}: NeonButtonProps) {
  const base =
    "relative overflow-hidden rounded-sm border px-4 py-3 text-[11px] font-bold uppercase tracking-[0.22em] transition duration-300 disabled:cursor-not-allowed disabled:opacity-60";

  const styles =
    variant === "solid"
      ? "border-cyan-300 bg-cyan-400/10 text-cyan-50 shadow-[0_0_22px_rgba(0,217,255,0.35)] hover:bg-cyan-300/20 hover:shadow-[0_0_38px_rgba(0,217,255,0.55)]"
      : "border-cyan-400/30 bg-cyan-950/15 text-cyan-300 hover:border-cyan-300 hover:bg-cyan-400/10 hover:text-cyan-50";

  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200 to-transparent" />
      {children}
    </button>
  );
}
