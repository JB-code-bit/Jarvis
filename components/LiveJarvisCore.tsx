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

    // Pushes more particles toward the outside shell, like your reference.
    const shellBias = Math.pow(Math.random(), 0.28);
    const r = THREE.MathUtils.lerp(0.25, 1.85, shellBias);

    base[i3] = r * Math.sin(phi) * Math.cos(theta);
    base[i3 + 1] = r * Math.cos(phi);
    base[i3 + 2] = r * Math.sin(phi) * Math.sin(theta);

    phase[i] = Math.random() * Math.PI * 2;
    speed[i] = THREE.MathUtils.lerp(0.45, 2.2, Math.random());
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
    const r = THREE.MathUtils.lerp(1.9, 3.35, Math.random());

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

  const particleData = useMemo(() => createParticleData(6200), []);

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
      new THREE.BufferAttribute(createOuterParticles(1200), 3)
    );

    return geometry;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const positions = particleGeometry.attributes.position.array as Float32Array;

    const voiceEnergy = isSpeaking
      ? 0.2 +
        Math.abs(Math.sin(time * 9.5)) * 0.22 +
        Math.abs(Math.sin(time * 17.5)) * 0.1
      : 0.04;

    const breathing = isSpeaking
      ? 1 + Math.sin(time * 10) * 0.065 + Math.sin(time * 21) * 0.032
      : 1 + Math.sin(time * 1.35) * 0.028;

    for (let i = 0; i < particleData.count; i += 1) {
      const i3 = i * 3;

      const bx = particleData.base[i3];
      const by = particleData.base[i3 + 1];
      const bz = particleData.base[i3 + 2];

      const phase = particleData.phase[i];
      const speed = particleData.speed[i];
      const r = particleData.radius[i];

      const organic =
        Math.sin(time * speed + phase) * 0.05 +
        Math.cos(time * 0.55 + phase * 1.7) * 0.035;

      const speechRipple = isSpeaking
        ? Math.sin(time * 13 + r * 5.5 + phase) * voiceEnergy
        : 0;

      const pulse = breathing + organic + speechRipple;

      const swirlX = Math.sin(time * 0.9 + phase) * 0.048;
      const swirlY = Math.cos(time * 0.7 + phase * 1.2) * 0.048;
      const swirlZ = Math.sin(time * 0.6 + phase * 1.8) * 0.048;

      positions[i3] = bx * pulse + swirlX;
      positions[i3 + 1] = by * pulse + swirlY;
      positions[i3 + 2] = bz * pulse + swirlZ;
    }

    particleGeometry.attributes.position.needsUpdate = true;

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.09;
      pointsRef.current.rotation.x = Math.sin(time * 0.28) * 0.12;
      pointsRef.current.rotation.z = Math.cos(time * 0.22) * 0.05;
      pointsRef.current.scale.setScalar(isSpeaking ? 1.05 : 1);
    }

    if (outerPointsRef.current) {
      outerPointsRef.current.rotation.y = time * -0.035;
      outerPointsRef.current.rotation.x = Math.sin(time * 0.2) * 0.08;
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = time * (isSpeaking ? 0.42 : 0.18);
      ringsRef.current.rotation.x = Math.sin(time * 0.28) * 0.18;
      ringsRef.current.rotation.z = time * (isSpeaking ? -0.13 : -0.055);
    }

    if (glowRef.current) {
      const scale = isSpeaking
        ? 1.04 + Math.abs(Math.sin(time * 11)) * 0.1
        : 1 + Math.sin(time * 1.8) * 0.035;

      glowRef.current.scale.setScalar(scale);
    }

    if (centerGlowRef.current) {
      const scale = isSpeaking
        ? 1 + Math.abs(Math.sin(time * 18)) * 0.18
        : 1 + Math.sin(time * 2.1) * 0.05;

      centerGlowRef.current.scale.setScalar(scale);
    }
  });

  return (
    <group>
      <group ref={ringsRef}>
        <mesh rotation={[Math.PI / 2.65, 0, 0]}>
          <torusGeometry args={[2.35, 0.008, 20, 260]} />
          <meshBasicMaterial
            color="#00d9ff"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.35, 0.45, 0.16]}>
          <torusGeometry args={[2.05, 0.006, 20, 260]} />
          <meshBasicMaterial
            color="#8ff4ff"
            transparent
            opacity={0.32}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        <mesh rotation={[Math.PI / 2.08, -0.45, -0.2]}>
          <torusGeometry args={[1.74, 0.006, 20, 260]} />
          <meshBasicMaterial
            color="#0b78ff"
            transparent
            opacity={0.44}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>

      <mesh ref={glowRef}>
        <sphereGeometry args={[2.05, 64, 64]} />
        <meshBasicMaterial
          color="#009dff"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <mesh ref={centerGlowRef}>
        <sphereGeometry args={[0.22, 48, 48]} />
        <meshBasicMaterial
          color="#dff8ff"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      <points ref={pointsRef} geometry={particleGeometry}>
        <pointsMaterial
          color="#00d9ff"
          size={0.021}
          sizeAttenuation
          transparent
          opacity={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      <points ref={outerPointsRef} geometry={outerGeometry}>
        <pointsMaterial
          color="#bff6ff"
          size={0.013}
          sizeAttenuation
          transparent
          opacity={0.5}
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
          camera={{ position: [0, 0, 5.4], fov: 48 }}
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
