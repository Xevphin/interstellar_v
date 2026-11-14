import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Rocket — points along +Y, base (nozzle) at y = 0, total height ~5.3 units.
// Pass a ref ({ current: 0..1 }) as `thrustRef` to drive the exhaust flame.
// ---------------------------------------------------------------------------
export function Rocket({ thrustRef, ...props }) {
  const flameRef = useRef();
  const innerFlameRef = useRef();
  const glowRef = useRef();

  useFrame(({ clock }) => {
    const thrust = thrustRef ? thrustRef.current : 1;
    const t = clock.getElapsedTime();
    const flicker = 0.88 + Math.sin(t * 42) * 0.07 + Math.random() * 0.06;
    if (flameRef.current) {
      flameRef.current.visible = thrust > 0.02;
      const w = 0.55 + thrust * 0.45;
      flameRef.current.scale.set(w, Math.max(0.01, thrust * flicker * 1.7), w);
    }
    if (innerFlameRef.current) {
      innerFlameRef.current.visible = thrust > 0.02;
      innerFlameRef.current.scale.set(1, Math.max(0.01, thrust * (2 - flicker) * 1.2), 1);
    }
    if (glowRef.current) glowRef.current.intensity = thrust * 7 * flicker;
  });

  return (
    <group {...props}>
      {/* Engine bell */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.32, 0.46, 0.4, 16]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Main body */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <cylinderGeometry args={[0.56, 0.56, 3.2, 24]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.3} roughness={0.35} />
      </mesh>
      {/* Accent bands */}
      <mesh position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.575, 0.575, 0.22, 24]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
      <mesh position={[0, 3.25, 0]}>
        <cylinderGeometry args={[0.575, 0.575, 0.14, 24]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
      </mesh>
      {/* Window */}
      <mesh position={[0, 2.65, 0.52]}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1.2} />
      </mesh>
      {/* Nose cone */}
      <mesh position={[0, 4.2, 0]} castShadow>
        <coneGeometry args={[0.56, 1.2, 24]} />
        <meshStandardMaterial color="#ea580c" roughness={0.35} />
      </mesh>
      {/* Fins */}
      {[0, 1, 2, 3].map((i) => {
        const a = (i * Math.PI) / 2;
        return (
          <mesh
            key={i}
            position={[Math.sin(a) * 0.68, 0.75, Math.cos(a) * 0.68]}
            rotation={[0, a, 0]}
            castShadow
          >
            <boxGeometry args={[0.08, 1.0, 0.5]} />
            <meshStandardMaterial color="#1d4ed8" roughness={0.4} />
          </mesh>
        );
      })}

      {/* Exhaust flame (scales downward from the nozzle) */}
      <group ref={flameRef} position={[0, 0.02, 0]}>
        <mesh position={[0, -0.85, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.38, 1.7, 16, 1, true]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group ref={innerFlameRef} position={[0, 0.02, 0]}>
        <mesh position={[0, -0.55, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.2, 1.1, 12]} />
          <meshBasicMaterial
            color="#fef3c7"
            transparent
            opacity={0.95}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <pointLight ref={glowRef} position={[0, -0.8, 0]} color="#fb923c" intensity={0} distance={14} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Astronaut — simple stylised spacesuit figure, feet at y = 0.
// `walkRef` ({ current: 0..1 }) controls walk-cycle intensity.
// ---------------------------------------------------------------------------
export function Astronaut({ walkRef, ...props }) {
  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const body = useRef();

  useFrame(({ clock }) => {
    const w = walkRef ? walkRef.current : 0;
    const t = clock.getElapsedTime() * 7;
    const swing = Math.sin(t) * 0.55 * w;
    if (leftLeg.current) leftLeg.current.rotation.x = swing;
    if (rightLeg.current) rightLeg.current.rotation.x = -swing;
    if (leftArm.current) leftArm.current.rotation.x = -swing * 0.8;
    if (rightArm.current) rightArm.current.rotation.x = swing * 0.8 - (1 - w) * 2.4; // waves when idle
    if (body.current) body.current.position.y = Math.abs(Math.sin(t)) * 0.06 * w;
  });

  const suit = <meshStandardMaterial color="#f1f5f9" roughness={0.55} />;

  return (
    <group {...props}>
      <group ref={body}>
        {/* Legs */}
        <group ref={leftLeg} position={[-0.13, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
            {suit}
          </mesh>
        </group>
        <group ref={rightLeg} position={[0.13, 0.62, 0]}>
          <mesh position={[0, -0.3, 0]} castShadow>
            <capsuleGeometry args={[0.1, 0.4, 4, 8]} />
            {suit}
          </mesh>
        </group>
        {/* Torso */}
        <mesh position={[0, 0.95, 0]} castShadow>
          <capsuleGeometry args={[0.24, 0.35, 4, 12]} />
          {suit}
        </mesh>
        {/* Chest panel */}
        <mesh position={[0, 1.0, 0.23]}>
          <boxGeometry args={[0.22, 0.14, 0.04]} />
          <meshStandardMaterial color="#1e3a8a" />
        </mesh>
        {/* Backpack */}
        <mesh position={[0, 1.0, -0.27]} castShadow>
          <boxGeometry args={[0.38, 0.48, 0.18]} />
          <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
        </mesh>
        {/* Arms */}
        <group ref={leftArm} position={[-0.32, 1.15, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.34, 4, 8]} />
            {suit}
          </mesh>
        </group>
        <group ref={rightArm} position={[0.32, 1.15, 0]}>
          <mesh position={[0, -0.25, 0]} castShadow>
            <capsuleGeometry args={[0.08, 0.34, 4, 8]} />
            {suit}
          </mesh>
        </group>
        {/* Helmet + gold visor */}
        <mesh position={[0, 1.48, 0]} castShadow>
          <sphereGeometry args={[0.24, 20, 20]} />
          {suit}
        </mesh>
        <mesh position={[0, 1.48, 0.1]}>
          <sphereGeometry args={[0.18, 20, 20]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>
    </group>
  );
}

// ---------------------------------------------------------------------------
// Soft round sprite texture for particles (generated, no external assets).
// ---------------------------------------------------------------------------
function useSoftTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.4, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// ---------------------------------------------------------------------------
// ParticleEmitter — generic recycled particle system.
//  getOrigin(vec3)      -> writes the spawn point into vec3
//  getRate()            -> 0..1 chance a dead particle respawns this frame
//  spawnVelocity(vec3)  -> writes an initial velocity into vec3
// ---------------------------------------------------------------------------
export function ParticleEmitter({
  count = 300,
  life = 2,
  size = 1,
  color = "#ffffff",
  opacity = 0.6,
  additive = false,
  drag = 0.6,
  rise = 0,
  getOrigin,
  getRate,
  spawnVelocity,
}) {
  const pointsRef = useRef();
  const texture = useSoftTexture();

  const data = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) positions[i * 3 + 1] = -9999;
    return {
      positions,
      velocities: new Float32Array(count * 3),
      ages: new Float32Array(count).fill(life + 1),
      tmpOrigin: new THREE.Vector3(),
      tmpVel: new THREE.Vector3(),
    };
  }, [count, life]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const { positions, velocities, ages, tmpOrigin, tmpVel } = data;
    const rate = getRate ? getRate() : 1;
    const damp = Math.exp(-drag * dt);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      ages[i] += dt;
      if (ages[i] > life) {
        if (rate > 0 && Math.random() < rate * 0.35) {
          getOrigin(tmpOrigin);
          spawnVelocity(tmpVel);
          positions[i3] = tmpOrigin.x;
          positions[i3 + 1] = tmpOrigin.y;
          positions[i3 + 2] = tmpOrigin.z;
          velocities[i3] = tmpVel.x;
          velocities[i3 + 1] = tmpVel.y;
          velocities[i3 + 2] = tmpVel.z;
          ages[i] = Math.random() * 0.15;
        } else {
          positions[i3 + 1] = -9999;
        }
        continue;
      }
      velocities[i3] *= damp;
      velocities[i3 + 1] = velocities[i3 + 1] * damp + rise * dt;
      velocities[i3 + 2] *= damp;
      positions[i3] += velocities[i3] * dt;
      positions[i3 + 1] += velocities[i3 + 1] * dt;
      positions[i3 + 2] += velocities[i3 + 2] * dt;
    }

    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={data.positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color={color}
        size={size}
        transparent
        opacity={opacity}
        depthWrite={false}
        sizeAttenuation
        blending={additive ? THREE.AdditiveBlending : THREE.NormalBlending}
      />
    </points>
  );
}

// ---------------------------------------------------------------------------
// Earth — glowing blue planet with atmosphere shells and simple "continents".
// ---------------------------------------------------------------------------
export function Earth({ radius = 10, spin = 0.03, ...props }) {
  const planetRef = useRef();

  const continents = useMemo(() => {
    const items = [];
    let seed = 7;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 26; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.sin(theta)
      );
      items.push({ dir, scale: 0.12 + rand() * 0.22 });
    }
    return items;
  }, []);

  useFrame((_, delta) => {
    if (planetRef.current) planetRef.current.rotation.y += delta * spin;
  });

  return (
    <group {...props}>
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[radius, 64, 64]} />
          <meshStandardMaterial color="#1d4ed8" emissive="#0b2a6b" emissiveIntensity={0.55} roughness={0.6} />
        </mesh>
        {continents.map((c, i) => (
          <mesh
            key={i}
            position={c.dir.clone().multiplyScalar(radius * 0.985)}
            scale={radius * c.scale}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color={i % 4 === 0 ? "#f8fafc" : "#16a34a"} roughness={0.8} />
          </mesh>
        ))}
      </group>
      {/* Atmosphere glow */}
      <mesh scale={1.035}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={1.12}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.16}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Simple grey Moon / red Mars sphere for space shots.
export function PlanetBody({ planet = "lunar", radius = 8, ...props }) {
  const ref = useRef();
  const isLunar = planet === "lunar";

  const craters = useMemo(() => {
    const items = [];
    let seed = isLunar ? 3 : 11;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 22; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      items.push({
        dir: new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.cos(phi),
          Math.sin(phi) * Math.sin(theta)
        ),
        scale: 0.05 + rand() * 0.12,
      });
    }
    return items;
  }, [isLunar]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.04;
  });

  return (
    <group ref={ref} {...props}>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshStandardMaterial color={isLunar ? "#cbd5e1" : "#c2410c"} roughness={0.95} />
      </mesh>
      {craters.map((c, i) => (
        <mesh key={i} position={c.dir.clone().multiplyScalar(radius * 0.99)} scale={radius * c.scale}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial color={isLunar ? "#94a3b8" : "#9a3412"} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}
