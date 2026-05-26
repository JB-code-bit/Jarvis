import NeonButton from "@/components/NeonButton";

export default function JarvisLogin() {
  return (
    <main className="hud-bg relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-10 text-cyan-100">
      <div className="absolute inset-0 hud-grid opacity-55" />
      <div className="absolute inset-0 scanlines opacity-20" />
      <div className="absolute inset-0 vignette" />

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[1500px] -translate-x-1/2 -translate-y-1/2 rounded-[45%] border border-cyan-400/10 shadow-[inset_0_0_80px_rgba(0,217,255,0.08)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[760px] w-[1320px] -translate-x-1/2 -translate-y-1/2 login-frame border border-cyan-400/10" />

      <div className="pointer-events-none absolute left-8 top-20 h-40 w-40 border-l border-t border-cyan-400/20" />
      <div className="pointer-events-none absolute right-8 top-20 h-40 w-40 border-r border-t border-cyan-400/20" />
      <div className="pointer-events-none absolute bottom-20 left-8 h-40 w-40 border-b border-l border-cyan-400/20" />
      <div className="pointer-events-none absolute bottom-20 right-8 h-40 w-40 border-b border-r border-cyan-400/20" />

      <section className="relative z-10 flex w-full max-w-xl flex-col items-center">
        <div className="relative mb-8 flex h-44 w-44 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-cyan-400/15 animate-spin-slow" />
          <div className="absolute inset-5 rounded-full border border-cyan-400/25 animate-spin-reverse" />
          <div className="absolute inset-10 rounded-full border border-cyan-400/35" />
          <div className="jarvis-ring h-28 w-28 rounded-full animate-pulse-glow" />
          <div className="absolute h-16 w-16 rounded-full bg-[#020711] shadow-[inset_0_0_25px_rgba(0,217,255,0.4)]" />
        </div>

        <h1 className="mb-3 text-center text-5xl font-light tracking-[0.45em] text-cyan-50 drop-shadow-[0_0_18px_rgba(180,240,255,0.8)] md:text-6xl">
          JARVIS
        </h1>

        <p className="mb-8 text-center text-sm uppercase tracking-[0.45em] text-cyan-300/60">
          AI Assistant System
        </p>

        <div className="hud-panel w-full p-8">
          <h2 className="mb-7 text-center text-sm font-semibold uppercase tracking-[0.34em] text-cyan-300">
            Sign In To Jarvis
          </h2>

          <div className="space-y-5">
            <label className="block">
              <span className="sr-only">Username</span>
              <div className="flex items-center gap-4 border border-cyan-400/20 bg-black/35 px-5 py-4 shadow-[inset_0_0_18px_rgba(0,217,255,0.05)]">
                <span className="text-2xl text-cyan-300">♙</span>
                <input
                  type="email"
                  placeholder="Username"
                  className="w-full bg-transparent text-sm text-cyan-100 outline-none placeholder:text-cyan-100/35"
                />
              </div>
            </label>

            <label className="block">
              <span className="sr-only">Password</span>
              <div className="flex items-center gap-4 border border-cyan-400/20 bg-black/35 px-5 py-4 shadow-[inset_0_0_18px_rgba(0,217,255,0.05)]">
                <span className="text-xl text-cyan-300">▣</span>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full bg-transparent text-sm text-cyan-100 outline-none placeholder:text-cyan-100/35"
                />
                <span className="text-cyan-300/60">◌</span>
              </div>
            </label>

            <a href="/dashboard" className="block">
              <NeonButton className="w-full py-4">Sign In</NeonButton>
            </a>
          </div>

          <div className="my-8 flex items-center gap-4">
            <div className="thin-line flex-1" />
            <span className="text-xs uppercase tracking-[0.3em] text-cyan-400/70">
              or
            </span>
            <div className="thin-line flex-1" />
          </div>

          <button className="mx-auto flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-cyan-300 transition hover:text-cyan-50">
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-300 shadow-[0_0_18px_rgba(0,217,255,0.45)]">
              ◎
            </span>
            Use Biometric Login
          </button>
        </div>

        <p className="mt-7 text-xs uppercase tracking-[0.36em] text-cyan-500/65">
          Jarvis v6.2.0
        </p>
      </section>
    </main>
  );
}
