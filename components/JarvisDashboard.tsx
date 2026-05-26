import HudPanel from "@/components/HudPanel";
import NeonButton from "@/components/NeonButton";
import StatusPill from "@/components/StatusPill";

const systemRows = [
  ["Communications", "Online"],
  ["Satellites", "Online"],
  ["Database", "Online"],
  ["Server Nodes", "Online"],
  ["AI Subsystems", "Online"],
  ["Security Grid", "Online"],
  ["Power Grid", "Stable"],
  ["Network Status", "Secure"]
];

const logs = [
  "System boot sequence completed",
  "AI core synchronization successful",
  "Network security protocols active",
  "Satellite uplink established",
  "Database integrity verified",
  "All systems operational"
];

const tasks = [
  "Fix mobile hamburger menu",
  "Update visit section image",
  "Add San Juan vape SEO",
  "Normalize brand carousel logos"
];

const progress = [
  ["Frontend UI", "78%"],
  ["Supabase Setup", "42%"],
  ["AI Actions", "18%"],
  ["Deployment", "25%"]
];

function MiniMeter({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-full border border-cyan-400/35 bg-black/30 p-4 shadow-[inset_0_0_18px_rgba(0,217,255,0.08),0_0_16px_rgba(0,217,255,0.06)]">
      <p className="text-2xl font-light text-cyan-50">{value}</p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-cyan-300/70">
        {label}
      </p>
    </div>
  );
}

function WaveRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr_72px] items-center gap-3">
      <p className="text-[10px] uppercase tracking-[0.14em] text-cyan-100/65">
        {label}
      </p>
      <div className="h-8 data-wave opacity-90" />
      <p className="text-right text-[10px] font-bold text-cyan-300">{value}</p>
    </div>
  );
}

export default function JarvisDashboard() {
  return (
    <main className="hud-bg relative min-h-screen overflow-hidden p-3 text-cyan-100">
      <div className="absolute inset-0 hud-grid opacity-40" />
      <div className="absolute inset-0 scanlines opacity-20" />
      <div className="absolute inset-0 vignette" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1920px] flex-col gap-3">
        <header className="hud-panel px-5 py-3">
          <div className="grid items-center gap-4 xl:grid-cols-[1fr_520px_1fr]">
            <div className="flex flex-wrap gap-3">
              <StatusPill label="System" value="Online" icon="◴" />
              <StatusPill label="Network" value="Secure" icon="◈" />
              <StatusPill label="AI Core" value="Active" icon="◎" />
            </div>

            <div className="relative text-center">
              <div className="thin-line absolute left-0 top-1/2 hidden w-20 xl:block" />
              <div className="thin-line absolute right-0 top-1/2 hidden w-20 xl:block" />
              <h1 className="text-4xl font-black uppercase tracking-[0.34em] text-cyan-300 drop-shadow-[0_0_18px_rgba(0,217,255,0.75)] md:text-5xl">
                JARVIS
              </h1>
              <p className="text-xs uppercase tracking-[0.34em] text-cyan-50/75">
                AI System Control Center
              </p>
            </div>

            <div className="flex flex-wrap justify-end gap-3 text-[10px] uppercase tracking-[0.16em] text-cyan-200/80">
              <StatusPill label="10:42:36 AM" icon="◷" />
              <StatusPill label="Sat, May 24, 2025" icon="◫" />
              <StatusPill label="Uptime" value="128:47:12" icon="□" />
            </div>
          </div>
        </header>

        <nav className="mx-auto flex w-full max-w-2xl justify-center">
          {["Overview", "Systems", "Network", "Diagnostics", "Utilities"].map(
            (item) => (
              <button
                key={item}
                className={`border border-cyan-400/25 px-8 py-3 text-[11px] font-bold uppercase tracking-[0.18em] ${
                  item === "Overview"
                    ? "bg-cyan-400/15 text-cyan-200"
                    : "bg-black/25 text-cyan-100/70"
                }`}
              >
                {item}
              </button>
            )
          )}
        </nav>

        <section className="grid flex-1 grid-cols-1 gap-3 xl:grid-cols-[520px_1fr_520px]">
          <div className="grid gap-3">
            <HudPanel title="Global Systems">
              <div className="grid grid-cols-[190px_1fr] gap-5">
                <div className="relative flex aspect-square items-center justify-center rounded-full border border-cyan-400/25 bg-cyan-950/10 shadow-[0_0_35px_rgba(0,217,255,0.12)]">
                  <div className="absolute inset-5 rounded-full border border-cyan-400/25" />
                  <div className="absolute inset-10 rounded-full border border-cyan-400/15" />
                  <div className="text-center">
                    <p className="text-5xl">◉</p>
                    <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-cyan-300">
                      Earth Grid
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {systemRows.map(([name, state]) => (
                    <div
                      key={name}
                      className="grid grid-cols-[18px_1fr_70px] items-center gap-2 text-[10px] uppercase tracking-[0.13em]"
                    >
                      <span className="text-cyan-300">◉</span>
                      <span className="text-cyan-100/70">{name}</span>
                      <span className="text-right text-emerald-300">
                        {state}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </HudPanel>

            <HudPanel title="Network Overview">
              <div className="relative h-52 overflow-hidden border border-cyan-400/10 bg-black/25">
                <div className="absolute inset-0 hud-grid opacity-35" />
                <div className="absolute left-[8%] top-[42%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,1)]" />
                <div className="absolute left-[28%] top-[35%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,1)]" />
                <div className="absolute left-[50%] top-[48%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,1)]" />
                <div className="absolute left-[70%] top-[30%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,1)]" />
                <div className="absolute left-[86%] top-[55%] h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(0,217,255,1)]" />
                <svg className="absolute inset-0 h-full w-full opacity-80">
                  <path d="M45 92 C180 0 280 160 420 82" stroke="#00d9ff" strokeWidth="1" fill="none" />
                  <path d="M140 72 C210 180 315 10 455 115" stroke="#00d9ff" strokeWidth="1" fill="none" />
                  <path d="M250 108 C310 30 385 65 500 60" stroke="#00d9ff" strokeWidth="1" fill="none" />
                </svg>
              </div>

              <div className="mt-3 grid grid-cols-4 border border-cyan-400/15 bg-black/25 text-center">
                {[
                  ["Active Connections", "1,842"],
                  ["Secure Nodes", "256"],
                  ["Data Packets / Sec", "9.47M"],
                  ["Threat Level", "Low"]
                ].map(([label, value]) => (
                  <div key={label} className="border-r border-cyan-400/10 p-3 last:border-r-0">
                    <p className="text-[8px] uppercase tracking-[0.12em] text-cyan-100/50">
                      {label}
                    </p>
                    <p className="mt-1 text-lg text-cyan-300">{value}</p>
                  </div>
                ))}
              </div>
            </HudPanel>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <HudPanel title="System Logs">
                <div className="space-y-3">
                  {logs.map((log, index) => (
                    <div
                      key={log}
                      className="grid grid-cols-[50px_1fr] gap-2 text-[9px] text-cyan-100/65"
                    >
                      <span className="text-cyan-300">10:42:{11 + index * 4}</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
                <NeonButton variant="ghost" className="mt-4 w-full py-2">
                  View Full Logs
                </NeonButton>
              </HudPanel>

              <HudPanel title="AI Capabilities">
                <div className="relative mx-auto flex h-44 w-44 items-center justify-center">
                  <div className="absolute inset-0 core-ring-2 rounded-full animate-spin-slow" />
                  <div className="absolute inset-8 rounded-full border border-cyan-400/30" />
                  <div className="h-12 w-12 rounded-full bg-cyan-300/30 shadow-[0_0_45px_rgba(0,217,255,0.9)]" />
                </div>
                <div className="grid grid-cols-2 gap-2 text-[9px] uppercase tracking-[0.13em]">
                  {["Natural Language 100%", "Pattern Recognition 98%", "Machine Learning 100%", "Decision Engine 99%"].map(
                    (item) => (
                      <p key={item} className="text-cyan-100/70">
                        {item}
                      </p>
                    )
                  )}
                </div>
              </HudPanel>
            </div>
          </div>

          <div className="grid gap-3">
            <HudPanel className="flex min-h-[620px] items-center justify-center">
              <div className="relative flex h-[610px] w-[610px] max-w-full items-center justify-center">
                <div className="absolute inset-0 rounded-full core-ring-1 opacity-80 animate-spin-slow" />
                <div className="absolute inset-12 rounded-full core-ring-2 opacity-90 animate-spin-reverse" />
                <div className="absolute inset-24 rounded-full border border-cyan-400/30 shadow-[inset_0_0_45px_rgba(0,217,255,0.12)]" />
                <div className="absolute inset-36 rounded-full border border-cyan-400/50" />
                <div className="absolute inset-48 rounded-full bg-cyan-300/10 shadow-[0_0_85px_rgba(0,217,255,0.75)]" />
                <div className="absolute h-36 w-36 rounded-full border border-cyan-300/50 bg-cyan-300/20 shadow-[0_0_80px_rgba(0,217,255,0.95)] animate-pulse-glow" />

                <div className="absolute left-6 top-1/2 text-4xl text-cyan-300">▶</div>
                <div className="absolute right-6 top-1/2 text-4xl text-cyan-300">◀</div>
                <div className="absolute top-8 text-4xl text-cyan-100">▼</div>

                <div className="relative z-10 text-center">
                  <h2 className="text-5xl font-light uppercase tracking-[0.22em] text-cyan-50">
                    JARVIS
                  </h2>
                  <p className="mt-2 text-xs uppercase tracking-[0.3em] text-cyan-300/75">
                    AI Core
                  </p>
                  <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-cyan-100/60">
                    System Status
                  </p>
                  <p className="text-xl font-bold uppercase tracking-[0.18em] text-emerald-300">
                    Optimal
                  </p>
                  <div className="mx-auto mt-3 w-20 rounded-full border border-cyan-300/50 py-1 text-xs text-cyan-100">
                    100%
                  </div>
                </div>
              </div>
            </HudPanel>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <HudPanel title="Real-Time Analytics">
                <div className="h-36 data-wave" />
              </HudPanel>

              <HudPanel title="AI Confidence">
                <p className="text-center text-4xl font-light text-cyan-200">
                  99.7%
                </p>
                <div className="mt-4 h-2 bg-cyan-950">
                  <div className="h-2 w-[99%] bg-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.9)]" />
                </div>
              </HudPanel>

              <HudPanel title="Response Time">
                <p className="text-center text-4xl font-light text-cyan-200">
                  0.003s
                </p>
                <div className="mt-4 h-2 bg-cyan-950">
                  <div className="h-2 w-[87%] bg-cyan-300 shadow-[0_0_15px_rgba(0,217,255,0.9)]" />
                </div>
              </HudPanel>
            </div>
          </div>

          <div className="grid gap-3">
            <HudPanel title="System Diagnostics">
              <div className="grid grid-cols-4 gap-4">
                <MiniMeter label="CPU" value="82%" />
                <MiniMeter label="Memory" value="73%" />
                <MiniMeter label="GPU" value="91%" />
                <MiniMeter label="Storage" value="67%" />
              </div>

              <div className="mt-5 space-y-3">
                {[
                  ["Core Temperature", "58°C"],
                  ["Fan Speed", "1420 RPM"],
                  ["Voltage", "1.26 V"],
                  ["System Health", "Optimal"]
                ].map(([label, value], index) => (
                  <div
                    key={label}
                    className="grid grid-cols-[140px_1fr_80px] items-center gap-3 text-[10px] uppercase tracking-[0.13em]"
                  >
                    <span className="text-cyan-100/65">{label}</span>
                    <div className="h-2 bg-cyan-950">
                      <div
                        className="h-2 bg-cyan-300"
                        style={{ width: `${70 + index * 6}%` }}
                      />
                    </div>
                    <span className="text-right text-cyan-300">{value}</span>
                  </div>
                ))}
              </div>
            </HudPanel>

            <HudPanel title="Data Stream Monitor">
              <div className="space-y-4">
                <WaveRow label="Data Intake" value="9.47 GB/s" />
                <WaveRow label="Data Processing" value="7.23 GB/s" />
                <WaveRow label="Data Output" value="6.31 GB/s" />
                <WaveRow label="AI Learning Feed" value="3.92 GB/s" />
              </div>
            </HudPanel>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_260px]">
              <HudPanel title="Power Management">
                <div className="grid grid-cols-[150px_1fr] gap-5">
                  <div className="relative flex aspect-square items-center justify-center rounded-full border border-cyan-400/35">
                    <div className="absolute inset-5 rounded-full border-8 border-cyan-400/25" />
                    <p className="text-center text-4xl text-cyan-200">
                      94%
                      <span className="block text-[10px] uppercase tracking-[0.2em]">
                        Efficiency
                      </span>
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[
                      ["Reserve Power", "82%"],
                      ["Battery Level", "76%"],
                      ["Grid Stability", "91%"],
                      ["Power Flow", "Optimal"]
                    ].map(([label, value]) => (
                      <div key={label}>
                        <div className="mb-1 flex justify-between text-[10px] uppercase tracking-[0.14em]">
                          <span className="text-cyan-100/60">{label}</span>
                          <span className="text-cyan-300">{value}</span>
                        </div>
                        <div className="h-2 bg-cyan-950">
                          <div className="h-2 w-[82%] bg-cyan-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </HudPanel>

              <HudPanel title="Quick Access">
                <div className="grid gap-2">
                  {[
                    "Command Console",
                    "File Browser",
                    "System Settings",
                    "Security Center",
                    "AI Training Mode",
                    "Diagnostic Tools",
                    "Customize Dashboard"
                  ].map((item) => (
                    <button
                      key={item}
                      className="flex items-center justify-between border border-cyan-400/15 bg-black/25 px-3 py-2 text-[10px] uppercase tracking-[0.13em] text-cyan-100/75 hover:border-cyan-300 hover:text-cyan-200"
                    >
                      <span>◎ {item}</span>
                      <span>›</span>
                    </button>
                  ))}
                </div>
              </HudPanel>
            </div>
          </div>
        </section>

        <footer className="hud-panel grid grid-cols-2 gap-3 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-cyan-300/80 md:grid-cols-6">
          <p>User: Admin</p>
          <p>Clearance: Level 10</p>
          <p>System: Optimal</p>
          <p>AI Confidence: 99.7%</p>
          <p>Active Tasks: 24</p>
          <p>Synchronization: Active</p>
        </footer>
      </div>
    </main>
  );
}
