"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";

type LiveJarvisCoreProps = {
  isSpeaking?: boolean;
};

type ParticleData = {
  base: Float32Array;
  phase: Float32Array;
  speed: Float32Array;
  radius: Float32Array;
  count: number;
};

function createParticleData(count: number): ParticleData {
  const base = new Float32Array(count * 3);
  const phase = new Float32Array(count);
  const speed = new Float32Array(count);
  const radius = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    /*
      Compact particle orb:
      - Most particles stay inside a tight sphere.
      - Outer shell is denser than the center.
      - This avoids the huge star-field look.
    */
    const shellBias = Math.pow(Math.random(), 0.42);
    const r = THREE.MathUtils.lerp(0.12, 1.15, shellBias);

    base[i3] = r * Math.sin(phi) * Math.cos(theta);
    base[i3 + 1] = r * Math.cos(phi);
    base[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = THREE.MathUtils.lerp(0.38, 1.65, Math.random());
    radius[i] = r;
  }

  return { base, phase, speed, radius, count };
}

function createOuterParticles(count: number) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i += 1) {
    const i3 = i * 3;

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    /*
      A few escaped particles only.
      These should feel like energy leaking from the orb,
      not a full-screen galaxy.
    */
    const r = THREE.MathUtils.lerp(1.25, 1.9, Math.random());

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.cos(phi);
    positions[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }

  return positions;
}

function ParticleCoreScene({ isSpeaking }: { isSpeaking: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const outerPointsRef = useRef<THREE.Points>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const centerGlowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  const particleData = useMemo(() => createParticleData(6800), []);

  const particleGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(particleData.count * 3), 3)
    );

    return geometry;
  }, [particleData.count]);

  const outerGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(createOuterParticles(420), 3)
    );

    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const positions = particleGeometry.attributes.position.array as Float32Array;

    /*
      Speaking energy is still fake for now.
      Later this gets replaced with real audio amplitude.
    */
    const voiceEnergy = isSpeaking
      ? 0.08 +
        Math.abs(Math.sin(time * 9.5)) * 0.075 +
        Math.abs(Math.sin(time * 18.5)) * 0.04
      : 0.018;

    const breathing = isSpeaking
      ? 1 + Math.sin(time * 8.5) * 0.025 + Math.sin(time * 19) * 0.018
      : 1 + Math.sin(time * 1.25) * 0.018;

    for (let i = 0; i < particleData.count; i += 1) {
      const i3 = i * 3;

      const bx = particleData.base[i3];
      const by = particleData.base[i3 + 1];
      const bz = particleData.base[i3 + 2];

      const particlePhase = particleData.phase[i];
      const particleSpeed = particleData.speed[i];
      const particleRadius = particleData.radius[i];

      const organicDrift =
        Math.sin(time * particleSpeed + particlePhase) * 0.022 +
        Math.cos(time * 0.55 + particlePhase * 1.7) * 0.018;

      const speechRipple = isSpeaking
        ? Math.sin(time * 12 + particleRadius * 6 + particlePhase) * voiceEnergy
        : 0;

      const pulse = breathing + organicDrift + speechRipple;

      const swirlX = Math.sin(time * 0.72 + particlePhase) * 0.018;
      const swirlY = Math.cos(time * 0.64 + particlePhase * 1.2) * 0.018;
      const swirlZ = Math.sin(time * 0.58 + particlePhase * 1.8) * 0.018;

      positions[i3] = bx * pulse + swirlX;
      positions[i3 + 1] = by * pulse + swirlY;
      positions[i3 + 2] = bz * pulse + swirlZ;
    }

    particleGeometry.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.12;
      pointsRef.current.rotation.x = Math.sin(time * 0.28) * 0.08;
      pointsRef.current.rotation.z = Math.cos(time * 0.22) * 0.035;
      pointsRef.current.scale.setScalar(isSpeaking ? 1.035 : 1);
    }

    if (outerPointsRef.current) {
      outerPointsRef.current.rotation.y = time * -0.045;
      outerPointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.055;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = time * (isSpeaking ? 0.34 : 0.14);
      ringsRef.current.rotation.x = Math.sin(time * 0.28) * 0.12;
      ringsRef.current.rotation.z = time * (isSpeaking ? -0.1 : -0.045);
    }

    if (glowRef.current) {
      const scale = isSpeaking
        ? 1.02 + Math.abs(Math.sin(time * 9)) * 0.035
        : 1 + Math.sin(time * 1.8) * 0.018;

      glowRef.current.scale.setScalar(scale);
    }

    if (centerGlowRef.current) {
      const scale = isSpeaking
        ? 1 + Math.abs(Math.sin(time * 16)) * 0.08
        : 1 + Math.sin(time * 2.1) * 0.035;

      centerGlowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      {/* Tight reactor rings around the orb */}
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.55, 0, 0]}>
          <torusGeometry args={[1.58, 0.006, 20, 260]} />
          <meshBasicMaterial
            color="#00d9ff"
            transparent
            opacity={0.58}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.25, 0.45, 0.16]}>
          <torusGeometry args={[1.38, 0.005, 20, 260]} />
          <meshBasicMaterial
            color="#8ff4ff"
            transparent
            opacity={0.34}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.05, -0.45, -0.2]}>
          <torusGeometry args={[1.72, 0.005, 20, 260]} />
          <meshBasicMaterial
            color="#0b78ff"
            transparent
            opacity={0.38}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 1.95, 0.25, -0.1]}>
          <torusGeometry args={[1.18, 0.004, 18, 220]} />
          <meshBasicMaterial
            color="#bff6ff"
            transparent
            opacity={0.22}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Very soft volumetric haze, not a giant flat blue disk */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.28, 64, 64]} />
        <meshBasicMaterial
          color="#009dff"
          transparent
          opacity={0.045}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Small energy center, not a white ball */}
      <mesh ref={centerGlowRef}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshBasicMaterial
          color="#dff8ff"
          transparent
          opacity={0.26}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Main compact particle consciousness orb */}
      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          color="#00d9ff"
          size={0.018}
          sizeAttenuation
          transparent
          opacity={0.96}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Small amount of escaped energy particles */}
      <points ref={outerPointsRef} geometry={outerGeometry}>
        <pointsMaterial
          color="#bff6ff"
          size={0.01}
          sizeAttenuation
          transparent
          opacity={0.38}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function LiveJarvisCore({
  isSpeaking = false,
}: LiveJarvisCoreProps) {
  const [manualSpeaking, setManualSpeaking] = useState(false);
  const speaking = isSpeaking || manualSpeaking;

  return (
    <div className={`jarvis-particle-core ${speaking ? "speaking" : ""}`}>
      <div className="jarvis-core-canvas">
        <Canvas
          camera={{ position: [0, 0, 4.7], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.8} />
          <ParticleCoreScene isSpeaking={speaking} />
        </Canvas>
      </div>

      <div className="jarvis-core-overlay">
        <div className="jarvis-core-pointer pointer-top">▼</div>
        <div className="jarvis-core-pointer pointer-left">▶</div>
        <div className="jarvis-core-pointer pointer-right">◀</div>

        <div className={`jarvis-core-status ${speaking ? "active" : ""}`}>
          <div className="status-card-header">
            <span>JARVIS PARTICLE CORE</span>
            <strong>{speaking ? "SPEAKING" : "ONLINE"}</strong>
          </div>

          <div className="status-card-main">
            <div>
              <small>MODE</small>
              <strong>AI</strong>
            </div>

            <div>
              <small>ENERGY</small>
              <strong>{speaking ? "97%" : "62%"}</strong>
            </div>

            <div>
              <small>STATE</small>
              <strong>{speaking ? "LIVE" : "IDLE"}</strong>
            </div>
          </div>

          <div className="status-card-bar">
            <i />
          </div>

          <div className="status-card-footer">
            <span>PARTICLE CLOUD ACTIVE</span>
            <span>VOICE REACTIVE READY</span>
          </div>
        </div>

        <button
          type="button"
          className="jarvis-core-talk-button"
          onMouseDown={() => setManualSpeaking(true)}
          onMouseUp={() => setManualSpeaking(false)}
          onMouseLeave={() => setManualSpeaking(false)}
          onTouchStart={() => setManualSpeaking(true)}
          onTouchEnd={() => setManualSpeaking(false)}
        >
          HOLD TO SIMULATE AI TALKING
        </button>
      </div>
    </div>
  );
}
