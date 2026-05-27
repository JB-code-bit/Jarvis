"use client";

import Link from "next/link";
import { useState } from "react";
import LiveJarvisCore from "@/components/LiveJarvisCore";
import {
  getLocalJarvisResponse,
  localCommandExamples,
} from "@/lib/jarvisLocalBrain";

const systemRows = [
  ["COMMUNICATIONS", "ONLINE"],
  ["SATELLITES", "ONLINE"],
  ["DATABASE", "SUPABASE"],
  ["SERVER NODES", "ONLINE"],
  ["AI SUBSYSTEMS", "LOCAL"],
  ["SECURITY GRID", "ONLINE"],
  ["POWER GRID", "STABLE"],
  ["NETWORK STATUS", "SECURE"],
];

const logs = [
  ["10:42:11", "System boot sequence completed"],
  ["10:42:15", "Supabase memory layer active"],
  ["10:42:18", "Text console initialized"],
  ["10:42:21", "Particle core initialized"],
  ["10:42:24", "Wake call protocol loaded"],
  ["10:42:28", "No external AI API connected"],
  ["10:42:32", "Awaiting user command"],
];

const quickActions = [
  "COMMAND CONSOLE",
  "TIMER",
  "STOPWATCH",
  "POMODORO",
  "TASKS",
  "NOTES",
  "MEMORY",
];

type ChatMessage = {
  sender: "user" | "jarvis";
  text: string;
};

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
  const points =
    variant === 1
      ? "0,24 10,22 20,26 30,16 40,28 50,24 60,20 70,22 80,18 90,26 100,25 110,13 120,30 130,22 140,18 150,24 160,27 170,19 180,16 190,25 200,29 210,18 220,22 230,16 240,27 250,21 260,22 270,18 280,25"
      : variant === 2
        ? "0,28 10,25 20,27 30,20 40,18 50,31 60,24 70,14 80,28 90,21 100,19 110,30 120,18 130,12 140,27 150,32 160,20 170,22 180,15 190,30 200,24 210,18 220,28 230,14 240,20 250,31 260,22 270,19 280,24"
        : "0,20 10,22 20,18 30,30 40,24 50,19 60,26 70,28 80,16 90,20 100,24 110,21 120,29 130,15 140,23 150,26 160,22 170,19 180,31 190,24 200,20 210,26 220,18 230,22 240,28 250,16 260,25 270,21 280,24";

  return (
    <div className="data-wave-row">
      <span>{label}</span>
      <svg viewBox="0 0 280 44" preserveAspectRatio="none">
        <polyline points={points} />
      </svg>
      <strong>{value}</strong>
    </div>
  );
}

function TextConsolePanel({
  onJarvisSpeaking,
}: {
  onJarvisSpeaking: (speaking: boolean) => void;
}) {
  const [message, setMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: "jarvis",
      text: "Text console online. Supabase memory layer ready. Ask: Jarvis, are you up?",
    },
  ]);

  function triggerSpeakingPulse() {
    onJarvisSpeaking(true);

    window.setTimeout(() => {
      onJarvisSpeaking(false);
    }, 1800);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanMessage = message.trim();

    if (!cleanMessage || isThinking) {
      return;
    }

    if (cleanMessage.toLowerCase() === "clear chat") {
      setMessages([
        {
          sender: "jarvis",
          text: "Chat cleared. Supabase memory remains stored. Local response engine standing by.",
        },
      ]);
      setMessage("");
      triggerSpeakingPulse();
      return;
    }

    setIsThinking(true);

    setMessages((current) => [
      ...current,
      {
        sender: "user",
        text: cleanMessage,
      },
    ]);

    setMessage("");

    const result = await getLocalJarvisResponse(cleanMessage);

    setMessages((current) => [
      ...current,
      {
        sender: "jarvis",
        text: result.response,
      },
    ]);

    setIsThinking(false);
    triggerSpeakingPulse();
  }

  return (
    <Panel title="TEXT CONSOLE" className="text-console-panel">
      <div className="text-console-shell">
        <div className="text-console-header">
          <div>
            <p>JARVIS TEXT INTERFACE</p>
            <span>LOCAL RESPONSE ENGINE / SUPABASE MEMORY</span>
          </div>

          <strong>{isThinking ? "PROCESSING" : "ONLINE"}</strong>
        </div>

        <div className="text-console-window">
          {messages.map((item, index) => (
            <div
              key={`${item.sender}-${index}`}
              className={`text-console-message ${
                item.sender === "user" ? "user" : "jarvis"
              }`}
            >
              <small>{item.sender === "user" ? "YOU" : "JARVIS"}</small>
              <p>{item.text}</p>
            </div>
          ))}

          {isThinking && (
            <div className="text-console-message jarvis">
              <small>JARVIS</small>
              <p>Processing local command...</p>
            </div>
          )}
        </div>

        <div className="text-console-examples">
          {localCommandExamples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setMessage(example)}
            >
              {example}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="text-console-form">
          <input
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type a local JARVIS command..."
          />

          <button type="submit" disabled={isThinking}>
            {isThinking ? "..." : "SEND"}
          </button>
        </form>

        <div className="text-console-footer">
          <span>WAKE CALL READY</span>
          <span>SUPABASE MEMORY ACTIVE</span>
        </div>
      </div>
    </Panel>
  );
}

function RightOverviewColumn() {
  return (
    <div className="right-column">
      <Panel title="SYSTEM DIAGNOSTICS">
        <div className="meter-grid">
          <RoundMeter label="CPU" value="82%" sub="LOAD" />
          <RoundMeter label="MEMORY" value="73%" sub="USAGE" />
          <RoundMeter label="CORE" value="91%" sub="ACTIVE" />
          <RoundMeter label="LOCAL" value="67%" sub="TOOLS" />
        </div>

        <div className="diagnostic-bars">
          <BarRow label="COMMAND ROUTER" value="READY" width="78%" />
          <BarRow label="VOICE SYSTEM" value="PENDING" width="42%" />
          <BarRow label="SUPABASE MEMORY" value="ACTIVE" width="82%" />
          <BarRow label="SYSTEM HEALTH" value="OPTIMAL" width="91%" />
        </div>
      </Panel>

      <Panel title="DATA STREAM MONITOR">
        <div className="data-streams">
          <DataWave label="COMMAND INPUT" value="LOCAL" variant={1} />
          <DataWave label="SHORT MEMORY" value="ACTIVE" variant={2} />
          <DataWave label="LONG MEMORY" value="ACTIVE" variant={3} />
          <DataWave label="AI UPGRADE" value="LATER" variant={2} />
        </div>
      </Panel>

      <div className="right-bottom-grid">
        <Panel title="WORK MODES">
          <div className="power-content">
            <div className="power-ring">
              <strong>0$</strong>
              <span>AI COST</span>
            </div>

            <div className="power-bars">
              <BarRow label="CODE MODE" value="MANUAL" width="82%" />
              <BarRow label="BLENDER MODE" value="READY" width="76%" />
              <BarRow label="VIDEO MODE" value="READY" width="91%" />
              <BarRow label="BUSINESS MODE" value="READY" width="100%" />
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
  );
}

function RightTextColumn({
  onJarvisSpeaking,
}: {
  onJarvisSpeaking: (speaking: boolean) => void;
}) {
  return (
    <div className="right-column text-column-open">
      <TextConsolePanel onJarvisSpeaking={onJarvisSpeaking} />

      <Panel title="TEXT SYSTEM STATUS">
        <div className="diagnostic-bars">
          <BarRow label="WAKE CALL" value="READY" width="96%" />
          <BarRow label="LOCAL ROUTER" value="READY" width="88%" />
          <BarRow label="SUPABASE MEMORY" value="ACTIVE" width="82%" />
          <BarRow label="AI API" value="OFF" width="12%" />
        </div>
      </Panel>
    </div>
  );
}

export default function JarvisDashboard() {
  const [activeTab, setActiveTab] = useState("OVERVIEW");
  const [jarvisSpeaking, setJarvisSpeaking] = useState(false);

  const isTextMode = activeTab === "TEXT";

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
            <StatusBox icon="◎" label="CORE" value="ACTIVE" />
          </div>

          <div className="header-title">
            <div className="header-line left" />
            <div>
              <h1>JARVIS</h1>
              <p>LOCAL SYSTEM CONTROL CENTER</p>
            </div>
            <div className="header-line right" />
          </div>

          <div className="header-right">
            <StatusBox icon="◷" label="10:42:36 AM" />
            <StatusBox icon="▣" label={isTextMode ? "TEXT MODE" : "LOCAL MODE"} />
            <StatusBox icon="□" label="API" value="OFF" />
          </div>
        </header>

        <nav className="dashboard-tabs">
          {["OVERVIEW", "SYSTEMS", "NETWORK", "DIAGNOSTICS", "TEXT"].map(
            (item) => (
              <button
                key={item}
                type="button"
                className={activeTab === item ? "active" : ""}
                onClick={() => {
                  setActiveTab(item);
                  setJarvisSpeaking(false);
                }}
              >
                {item}
              </button>
            )
          )}
        </nav>

        <section className="dashboard-main">
          <div className="left-column">
            <Panel title="LOCAL SYSTEMS" className="global-panel">
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

            <Panel title="MEMORY MAP" className="network-panel">
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
                  <span>SHORT</span>
                  <strong>READY</strong>
                </div>
                <div>
                  <span>LONG</span>
                  <strong>READY</strong>
                </div>
                <div>
                  <span>WAKE</span>
                  <strong>READY</strong>
                </div>
                <div>
                  <span>AI API</span>
                  <strong>OFF</strong>
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

              <Panel title="LOCAL CAPABILITIES">
                <div className="capabilities-grid">
                  <div className="capability-text left">
                    <p>
                      WAKE CALL <strong>READY</strong>
                    </p>
                    <p>
                      TEXT ENGINE <strong>READY</strong>
                    </p>
                    <p>
                      SHORT MEMORY <strong>READY</strong>
                    </p>
                  </div>

                  <div className="radar-core">
                    <div className="radar-shape" />
                    <div className="radar-dot" />
                  </div>

                  <div className="capability-text right">
                    <p>
                      LONG MEMORY <strong>READY</strong>
                    </p>
                    <p>
                      SUPABASE <strong>ACTIVE</strong>
                    </p>
                    <p>
                      API COST <strong>$0</strong>
                    </p>
                  </div>
                </div>
              </Panel>
            </div>
          </div>

          <div className="center-column">
            <Panel className="core-panel">
              <div className="core-wrap">
                <LiveJarvisCore isSpeaking={jarvisSpeaking} />
              </div>
            </Panel>

            <div className="center-bottom">
              <Panel title="SYSTEM SEQUENCE">
                <div className="sequence-list">
                  {[
                    ["SYSTEM INIT", "00:00:00"],
                    [isTextMode ? "TEXT MODE" : "LOCAL MODE", "00:00:02"],
                    ["WAKE READY", "00:00:05"],
                    ["MEMORY READY", "00:00:07"],
                    ["AWAIT COMMAND", "00:00:10"],
                  ].map(([name, time]) => (
                    <div key={name}>
                      <i />
                      <span>{name}</span>
                      <strong>{time}</strong>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title={isTextMode ? "TEXT ACTIVITY" : "COMMAND ACTIVITY"}>
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

              <Panel title="LOCAL STATUS">
                <div className="big-stat">{isTextMode ? "TEXT" : "READY"}</div>
                <div className="stat-line">
                  <i style={{ width: isTextMode ? "88%" : "74%" }} />
                </div>
              </Panel>
            </div>
          </div>

          {isTextMode ? (
            <RightTextColumn onJarvisSpeaking={setJarvisSpeaking} />
          ) : (
            <RightOverviewColumn />
          )}
        </section>

        <footer className="dashboard-footer">
          <span>
            USER: <strong>ADMIN</strong>
          </span>
          <span>
            MODE: <strong>{isTextMode ? "TEXT" : "LOCAL"}</strong>
          </span>
          <span>
            MEMORY <strong>SUPABASE</strong>
          </span>
          <span>
            AI COST <strong>$0</strong>
          </span>
          <span>
            COMMANDS <strong>READY</strong>
          </span>
          <span>
            TEXT <strong>{isTextMode ? "OPEN" : "STANDBY"}</strong>
          </span>
          <span>
            SYNCHRONIZATION: <strong>ACTIVE</strong>
          </span>
          <Link href="/login">LOGOUT</Link>
        </footer>
      </div>
    </main>
  );
}
