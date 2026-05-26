import Link from "next/link";

const systemRows = [
  ["COMMUNICATIONS", "ONLINE"],
  ["SATELLITES", "ONLINE"],
  ["DATABASE", "ONLINE"],
  ["SERVER NODES", "ONLINE"],
  ["AI SUBSYSTEMS", "ONLINE"],
  ["SECURITY GRID", "ONLINE"],
  ["POWER GRID", "STABLE"],
  ["NETWORK STATUS", "SECURE"],
];

const logs = [
  ["10:42:11", "System boot sequence completed"],
  ["10:42:15", "AI core synchronization successful"],
  ["10:42:18", "Network security protocols active"],
  ["10:42:21", "Satellite uplink established"],
  ["10:42:24", "Database integrity verified"],
  ["10:42:28", "All systems operational"],
  ["10:42:32", "Continuous monitoring active"],
];

const quickActions = [
  "COMMAND CONSOLE",
  "FILE BROWSER",
  "SYSTEM SETTINGS",
  "SECURITY CENTER",
  "AI TRAINING MODE",
  "DIAGNOSTIC TOOLS",
  "CUSTOMIZE DASHBOARD",
];

function Panel({
  title,
  children,
  className = "",
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`jarvis-panel ${className}`}>
      {title && (
        <div className="jarvis-panel-title">
          <span>{title}</span>
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </section>
  );
}

function StatusBox({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string;
}) {
  return (
    <div className="status-box">
      <span className="status-icon">{icon}</span>
      <span>{label}</span>
      {value && <strong>{value}</strong>}
    </div>
  );
}

function RoundMeter({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="round-meter">
      <div className="round-meter-ring" />
      <div className="round-meter-inner">
        <strong>{value}</strong>
        <span>{sub}</span>
      </div>
      <p>{label}</p>
    </div>
  );
}

function BarRow({
  label,
  value,
  width,
}: {
  label: string;
  value: string;
  width: string;
}) {
  return (
    <div className="bar-row">
      <span>{label}</span>
      <div className="bar-track">
        <div className="bar-fill" style={{ width }} />
      </div>
      <strong>{value}</strong>
    </div>
  );
}

function DataWave({
  label,
  value,
  variant = 1,
}: {
  label: string;
  value: string;
  variant?: number;
}) {
  return (
    <div className="data-wave-row">
      <span>{label}</span>
      <svg viewBox="0 0 280 44" preserveAspectRatio="none">
        <polyline
          points={
            variant === 1
              ? "0,24 10,22 20,26 30,16 40,28 50,24 60,20 70,22 80,18 90,26 100,25 110,13 120,30 130,22 140,18 150,24 160,27 170,19 180,16 190,25 200,29 210,18 220,22 230,16 240,27 250,21 260,22 270,18 280,25"
              : variant === 2
                ? "0,28 10,25 20,27 30,20 40,18 50,31 60,24 70,14 80,28 90,21 100,19 110,30 120,18 130,12 140,27 150,32 160,20 170,22 180,15 190,30 200,24 210,18 220,28 230,14 240,20 250,31 260,22 270,19 280,24"
                : "0,20 10,22 20,18 30,30 40,24 50,19 60,26 70,28 80,16 90,20 100,24 110,21 120,29 130,15 140,23 150,26 160,22 170,19 180,31 190,24 200,20 210,26 220,18 230,22 240,28 250,16 260,25 270,21 280,24"
          }
        />
      </svg>
      <strong>{value}</strong>
    </div>
  );
}

export default function JarvisDashboard() {
  return (
    <main className="jarvis-dashboard">
      <div className="dashboard-grid-bg" />
      <div className="dashboard-vignette" />
      <div className="scanline-layer" />

      <div className="dashboard-shell">
        <header className="dashboard-header">
          <div className="header-left">
            <StatusBox icon="◴" label="SYSTEM" value="ONLINE" />
            <StatusBox icon="◈" label="NETWORK" value="SECURE" />
            <StatusBox icon="◎" label="AI CORE" value="ACTIVE" />
          </div>

          <div className="header-title">
            <div className="header-line left" />
            <div>
              <h1>JARVIS</h1>
              <p>AI SYSTEM CONTROL CENTER</p>
            </div>
            <div className="header-line right" />
          </div>

          <div className="header-right">
            <StatusBox icon="◷" label="10:42:36 AM" />
            <StatusBox icon="▣" label="SAT, MAY 24, 2025" />
            <StatusBox icon="□" label="UPTIME" value="128:47:12" />
          </div>
        </header>

        <nav className="dashboard-tabs">
          {["OVERVIEW", "SYSTEMS", "NETWORK", "DIAGNOSTICS", "UTILITIES"].map(
            (item, index) => (
              <button key={item} className={index === 0 ? "active" : ""}>
                {item}
              </button>
            )
          )}
        </nav>

        <section className="dashboard-main">
          <div className="left-column">
            <Panel title="GLOBAL SYSTEMS" className="global-panel">
              <div className="global-content">
                <div className="earth-orb">
                  <div className="earth-ring r1" />
                  <div className="earth-ring r2" />
                  <div className="earth-ring r3" />
                  <div className="earth-globe">
                    <div className="earth-lat lat1" />
                    <div className="earth-lat lat2" />
                    <div className="earth-lat lat3" />
                    <div className="earth-long lon1" />
                    <div className="earth-long lon2" />
                    <span>◉</span>
                  </div>
                </div>

                <div className="system-list">
                  {systemRows.map(([name, state]) => (
                    <div key={name} className="system-row">
                      <i />
                      <span>{name}</span>
                      <strong>{state}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>

            <Panel title="NETWORK OVERVIEW" className="network-panel">
              <div className="map-box">
                <div className="map-grid" />
                <svg viewBox="0 0 460 170" preserveAspectRatio="none">
                  <path d="M20 95 C95 25 160 140 235 70 C300 12 360 75 440 32" />
                  <path d="M55 112 C150 45 230 155 305 82 C355 35 410 92 452 70" />
                  <path d="M75 62 C150 30 245 45 330 110 C380 150 420 95 455 125" />
                  <circle cx="20" cy="95" r="4" />
                  <circle cx="235" cy="70" r="4" />
                  <circle cx="305" cy="82" r="4" />
                  <circle cx="440" cy="32" r="4" />
                  <circle cx="452" cy="70" r="4" />
                </svg>
              </div>

              <div className="network-stats">
                <div>
                  <span>ACTIVE CONNECTIONS</span>
                  <strong>1,842</strong>
                </div>
                <div>
                  <span>SECURE NODES</span>
                  <strong>256</strong>
                </div>
                <div>
                  <span>DATA PACKETS / SEC</span>
                  <strong>9.47M</strong>
                </div>
                <div>
                  <span>THREAT LEVEL</span>
                  <strong>LOW</strong>
                </div>
              </div>
            </Panel>

            <div className="left-bottom-grid">
              <Panel title="SYSTEM LOGS">
                <div className="log-list">
                  {logs.map(([time, log]) => (
                    <div key={time + log}>
                      <span>{time}</span>
                      <p>{log}</p>
                    </div>
                  ))}
                </div>
                <button className="small-hud-button">VIEW FULL LOGS</button>
              </Panel>

              <Panel title="AI CAPABILITIES">
                <div className="capabilities-grid">
                  <div className="capability-text left">
                    <p>NATURAL LANGUAGE <strong>100%</strong></p>
                    <p>PATTERN RECOGNITION <strong>98%</strong></p>
                    <p>PREDICTIVE ANALYTICS <strong>97%</strong></p>
                  </div>

                  <div className="radar-core">
                    <div className="radar-shape" />
                    <div className="radar-dot" />
                  </div>

                  <div className="capability-text right">
                    <p>MACHINE LEARNING <strong>100%</strong></p>
                    <p>DECISION ENGINE <strong>99%</strong></p>
                    <p>ADAPTIVE SYSTEMS <strong>96%</strong></p>
                  </div>
                </div>
              </Panel>
            </div>
          </div>

          <div className="center-column">
            <Panel className="core-panel">
              <div className="core-wrap">
                <div className="core-ring ring-a" />
                <div className="core-ring ring-b" />
                <div className="core-ring ring-c" />
                <div className="core-ring ring-d" />
                <div className="core-ring ring-e" />

                <div className="core-ticks ticks-a" />
                <div className="core-ticks ticks-b" />

                <div className="core-side-marker left">▶</div>
                <div className="core-side-marker right">◀</div>
                <div className="core-top-marker">▼</div>

                <div className="core-center">
                  <div className="core-polygon">
                    <div className="polygon-lines" />
                    <div className="core-light" />
                  </div>

                  <h2>JARVIS</h2>
                  <p>AI CORE</p>
                  <span>SYSTEM STATUS</span>
                  <strong>OPTIMAL</strong>
                  <em>100%</em>
                </div>
              </div>
            </Panel>

            <div className="center-bottom">
              <Panel title="SYSTEM SEQUENCE">
                <div className="sequence-list">
                  {[
                    ["SYSTEM INIT", "00:00:00"],
                    ["NETWORK SYNC", "00:00:02"],
                    ["DATA LOAD", "00:00:05"],
                    ["AI CORE READY", "00:00:07"],
                    ["SYSTEM OPTIMAL", "00:00:10"],
                  ].map(([name, time]) => (
                    <div key={name}>
                      <i />
                      <span>{name}</span>
                      <strong>{time}</strong>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="REAL-TIME ANALYTICS">
                <div className="analytics-bars">
                  {Array.from({ length: 56 }).map((_, index) => (
                    <i
                      key={index}
                      style={{
                        height: `${18 + ((index * 17) % 84)}%`,
                      }}
                    />
                  ))}
                </div>
              </Panel>

              <Panel title="AI CONFIDENCE">
                <div className="big-stat">99.7%</div>
                <div className="stat-line">
                  <i style={{ width: "99%" }} />
                </div>
              </Panel>
            </div>
          </div>

          <div className="right-column">
            <Panel title="SYSTEM DIAGNOSTICS">
              <div className="meter-grid">
                <RoundMeter label="CPU" value="82%" sub="LOAD" />
                <RoundMeter label="MEMORY" value="73%" sub="USAGE" />
                <RoundMeter label="GPU" value="91%" sub="LOAD" />
                <RoundMeter label="STORAGE" value="67%" sub="USAGE" />
              </div>

              <div className="diagnostic-bars">
                <BarRow label="CORE TEMPERATURE" value="58°C" width="78%" />
                <BarRow label="FAN SPEED" value="1420 RPM" width="72%" />
                <BarRow label="VOLTAGE" value="1.26 V" width="46%" />
                <BarRow label="SYSTEM HEALTH" value="OPTIMAL" width="91%" />
              </div>
            </Panel>

            <Panel title="DATA STREAM MONITOR">
              <div className="data-streams">
                <DataWave label="DATA INTAKE" value="9.47 GB/s" variant={1} />
                <DataWave label="DATA PROCESSING" value="7.23 GB/s" variant={2} />
                <DataWave label="DATA OUTPUT" value="6.31 GB/s" variant={3} />
                <DataWave label="AI LEARNING FEED" value="3.92 GB/s" variant={2} />
              </div>
            </Panel>

            <div className="right-bottom-grid">
              <Panel title="POWER MANAGEMENT">
                <div className="power-content">
                  <div className="power-ring">
                    <strong>94%</strong>
                    <span>EFFICIENCY</span>
                  </div>

                  <div className="power-bars">
                    <BarRow label="RESERVE POWER" value="82%" width="82%" />
                    <BarRow label="BATTERY LEVEL" value="76%" width="76%" />
                    <BarRow label="GRID STABILITY" value="91%" width="91%" />
                    <BarRow label="POWER FLOW" value="OPTIMAL" width="100%" />
                  </div>
                </div>
              </Panel>

              <Panel title="QUICK ACCESS">
                <div className="quick-list">
                  {quickActions.map((item) => (
                    <button key={item}>
                      <span>◎ {item}</span>
                      <b>›</b>
                    </button>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </section>

        <footer className="dashboard-footer">
          <span>USER: <strong>ADMIN</strong></span>
          <span>CLEARANCE: <strong>LEVEL 10</strong></span>
          <span>SYSTEM <strong>OPTIMAL</strong></span>
          <span>AI CONFIDENCE <strong>99.7%</strong></span>
          <span>RESPONSE TIME <strong>0.0032s</strong></span>
          <span>ACTIVE TASKS <strong>24</strong></span>
          <span>SYNCHRONIZATION: <strong>ACTIVE</strong></span>
          <Link href="/login">LOGOUT</Link>
        </footer>
      </div>
    </main>
  );
}
