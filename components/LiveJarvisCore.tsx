"use client";

import { useMemo, useState } from "react";

type LiveJarvisCoreProps = {
  isSpeaking?: boolean;
};

export default function LiveJarvisCore({ isSpeaking = true }: LiveJarvisCoreProps) {
  const [manualTalking, setManualTalking] = useState(false);

  const particles = useMemo(() => {
    return Array.from({ length: 130 }).map((_, index) => {
      const angle = (index * 137.5) % 360;
      const radius = 18 + ((index * 19) % 42);
      const size = 2 + ((index * 7) % 5);
      const delay = (index % 20) * 0.12;
      const duration = 3.5 + (index % 8) * 0.35;

      return {
        id: index,
        angle,
        radius,
        size,
        delay,
        duration,
      };
    });
  }, []);

  const talking = isSpeaking || manualTalking;

  return (
    <div className={`live-core ${talking ? "is-speaking" : ""}`}>
      <div className="live-core-radar-grid" />

      <div className="live-core-outer-ring ring-one" />
      <div className="live-core-outer-ring ring-two" />
      <div className="live-core-outer-ring ring-three" />
      <div className="live-core-outer-ring ring-four" />

      <div className="live-core-orbit-ticks ticks-one" />
      <div className="live-core-orbit-ticks ticks-two" />

      <div className="live-core-orb">
        <div className="live-core-glow" />
        <div className="live-core-inner-noise" />

        {particles.map((particle) => (
          <span
            key={particle.id}
            className="live-core-particle"
            style={
              {
                "--particle-angle": `${particle.angle}deg`,
                "--particle-radius": `${particle.radius}%`,
                "--particle-size": `${particle.size}px`,
                "--particle-delay": `${particle.delay}s`,
                "--particle-duration": `${particle.duration}s`,
              } as React.CSSProperties
            }
          />
        ))}

        <div className="live-core-energy-line line-a" />
        <div className="live-core-energy-line line-b" />
        <div className="live-core-energy-line line-c" />
      </div>

      <div className="live-core-pointer top">▼</div>
      <div className="live-core-pointer left">▶</div>
      <div className="live-core-pointer right">◀</div>

      <div className="live-core-status-card">
        <div className="status-card-header">
          <span>PROJECT ASSISTANT</span>
          <strong>ONLINE</strong>
        </div>

        <div className="status-card-main">
          <div>
            <small>MONTHLY TARGET</small>
            <strong>$10,000</strong>
          </div>

          <div>
            <small>MRR</small>
            <strong>$0.00</strong>
          </div>

          <div>
            <small>ACTIVE TASKS</small>
            <strong>24</strong>
          </div>
        </div>

        <div className="status-card-bar">
          <i />
        </div>

        <div className="status-card-footer">
          <span>PROGRESS 04.9%</span>
          <span>STATUS AI PRESENT</span>
          <span>ETA 04 WEEKS</span>
        </div>
      </div>

      <button
        type="button"
        className="live-core-talk-toggle"
        onMouseDown={() => setManualTalking(true)}
        onMouseUp={() => setManualTalking(false)}
        onMouseLeave={() => setManualTalking(false)}
      >
        HOLD TO SIMULATE AI TALKING
      </button>
    </div>
  );
}
