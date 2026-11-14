import React, { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { OUTPOST_STRUCTURES } from "../data/sols";

// Deterministic Crater heightmap: flat central outpost basin, crater rim ridges outside
export function getTerrainHeight(x, z) {
  const dist = Math.hypot(x, z);
  const rimFactor = Math.max(0, (dist - 16) / 28);
  const craterRim =
    Math.pow(Math.min(rimFactor, 1.8), 1.7) * 5.0 +
    Math.sin(x * 0.12) * Math.cos(z * 0.12) * Math.min(rimFactor, 1) * 1.6;
  const micro =
    Math.sin(x * 0.32 + 1.1) * Math.cos(z * 0.3) * 0.15 * Math.min(dist / 12, 1);
  return craterRim + micro;
}

function CraterTerrain({ planet }) {
  const isLunar = planet === "lunar";

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(140, 140, 96, 96);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      if (isLunar) {
        if (y < 0.4) c.set("#475569");
        else if (y < 2.2) c.set("#64748b");
        else if (y < 5.0) c.set("#334155");
        else c.set("#1e293b");
      } else {
        if (y < 0.4) c.set("#a84829");
        else if (y < 2.2) c.set("#be5533");
        else if (y < 5.0) c.set("#94371d");
        else c.set("#732613");
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, [isLunar]);

  const rocks = useMemo(() => {
    const items = [];
    let seed = 101;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 60; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = 14 + rand() * 38;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const y = getTerrainHeight(x, z);
      const scale = 0.35 + rand() * 1.15;
      items.push({
        pos: [x, y + scale * 0.28, z],
        scale: [scale, scale * (0.6 + rand() * 0.5), scale],
        rot: [rand() * 3, rand() * 3, 0],
      });
    }
    return items;
  }, []);

  return (
    <group>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.92} metalness={0.06} flatShading />
      </mesh>
      {rocks.map((r, idx) => (
        <mesh key={idx} position={r.pos} scale={r.scale} rotation={r.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={isLunar ? "#334155" : "#7d311a"}
            roughness={0.9}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

function FloatingDustMotes({ planet, isNight }) {
  const ref = useRef();
  const count = 220;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 52;
      arr[i * 3 + 1] = Math.random() * 12 + 0.4;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 52;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + delta * 0.45;
      let y = pos.getY(i) + Math.sin(i + x * 0.3) * delta * 0.14;
      if (x > 26) x = -26;
      if (y > 13) y = 0.5;
      pos.setXY(i, x, y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={planet === "lunar" ? "#cbd5e1" : isNight ? "#94a3b8" : "#f5a07a"}
        size={0.13}
        transparent
        opacity={0.55}
        sizeAttenuation
      />
    </points>
  );
}

function StructureBeacon({ structure, isNearby, isCompleted, label, interactPrompt, onSelect }) {
  const ringRef = useRef();
  const [sx, , sz] = structure.position;
  const sy = getTerrainHeight(sx, sz);

  useFrame(({ clock }) => {
    if (!ringRef.current) return;
    const t = clock.getElapsedTime();
    ringRef.current.rotation.z = t * 1.2;
    const scale = 1 + Math.sin(t * 3.5) * 0.05;
    ringRef.current.scale.set(scale, scale, 1);
  });

  const ringColor = isCompleted ? "#10b981" : isNearby ? "#22d3ee" : "#f59e0b";

  return (
    <group position={[sx, sy + 0.08, sz]}>
      {/* Ground Interaction Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.5, 2.85, 32]} />
        <meshBasicMaterial
          color={ringColor}
          transparent
          opacity={isNearby ? 0.85 : 0.4}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Floating [E] Interact / Structure Status Tag */}
      <Html position={[0, 3.6, 0]} center distanceFactor={18} style={{ pointerEvents: "none" }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(structure);
          }}
          className={`pointer-events-auto px-3 py-1 rounded-full backdrop-blur-md border text-xs font-extrabold whitespace-nowrap shadow-lg transition transform ${
            isNearby
              ? "bg-cyan-400 text-slate-950 border-white scale-110 shadow-[0_0_20px_rgba(34,211,238,0.7)]"
              : isCompleted
              ? "bg-emerald-950/85 text-emerald-300 border-emerald-400/50"
              : "bg-slate-900/85 text-amber-200 border-amber-400/50"
          }`}
        >
          {isNearby ? (
            <span>[E] {label}</span>
          ) : (
            <span>
              {isCompleted ? "✓ " : ""}
              {label}
            </span>
          )}
        </button>
      </Html>
    </group>
  );
}

function OutpostModules({
  stats,
  panelsDusty,
  isNight,
  solarStorm,
  nearbyId,
  completedTasks,
  moduleLabels,
  interactPrompt,
  onSelectStructure,
}) {
  const shieldRef = useRef();
  const ventRef = useRef();
  const dishRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (shieldRef.current) {
      let baseOpacity = 0.1 + (stats.shielding / 100) * 0.2;
      if (solarStorm) baseOpacity += Math.sin(t * 8) * 0.12;
      shieldRef.current.material.opacity = THREE.MathUtils.clamp(baseOpacity, 0.06, 0.42);
    }
    if (ventRef.current) {
      const speed = 2 + (stats.oxygen / 100) * 6;
      ventRef.current.material.emissiveIntensity = 0.7 + Math.sin(t * speed) * 0.5;
    }
    if (dishRef.current) {
      dishRef.current.rotation.y = Math.sin(t * 0.6) * 0.6;
    }
  });

  const shieldColor =
    stats.shielding <= 25 ? "#ef4444" : stats.shielding <= 45 ? "#f59e0b" : "#38bdf8";

  const getStruct = (id) => OUTPOST_STRUCTURES.find((s) => s.id === id);

  return (
    <group>
      {/* 1. MOXIE / Oxygen Extractor Unit ([-9.5, 0, -4.5]) */}
      <group
        position={[-9.5, getTerrainHeight(-9.5, -4.5), -4.5]}
        rotation={[0, 0.4, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("moxie"));
        }}
      >
        <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.1, 1.6, 1.6]} />
          <meshStandardMaterial color="#e2e8f0" metalness={0.45} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0.8, 0.82]}>
          <boxGeometry args={[1.45, 0.95, 0.06]} />
          <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh ref={ventRef} position={[0, 1.75, 0]}>
          <cylinderGeometry args={[0.38, 0.44, 0.4, 14]} />
          <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.4} />
        </mesh>
      </group>

      {/* 2. Hydroponic Greenhouse Dome ([-7.5, 0, 7.5]) */}
      <group
        position={[-7.5, getTerrainHeight(-7.5, 7.5), 7.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("greenhouse"));
        }}
      >
        <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[2.1, 2.3, 0.4, 20]} />
          <meshStandardMaterial color="#475569" roughness={0.7} />
        </mesh>
        {[
          [-0.7, -0.4],
          [0.6, -0.5],
          [-0.2, 0.6],
          [0.7, 0.5],
          [0, 0],
        ].map(([px, pz], idx) => (
          <mesh key={idx} position={[px, 0.65, pz]} castShadow>
            <dodecahedronGeometry args={[0.36, 0]} />
            <meshStandardMaterial
              color="#22c55e"
              emissive="#15803d"
              emissiveIntensity={0.3 + (stats.food / 100) * 0.8}
            />
          </mesh>
        ))}
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[2.05, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#bae6fd"
            transparent
            opacity={0.3}
            roughness={0.1}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* 3. DONKI Space Weather & Comms Array ([0, 0, -11.5]) */}
      <group
        position={[0, getTerrainHeight(0, -11.5), -11.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("comms"));
        }}
      >
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[1.4, 1.7, 0.6, 12]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.3, 2.2, 10]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
        </mesh>
        <group ref={dishRef} position={[0, 2.6, 0]}>
          <mesh rotation={[0.55, 0, 0]} castShadow>
            <coneGeometry args={[1.35, 0.65, 18, 1, true]} />
            <meshStandardMaterial
              color="#f8fafc"
              metalness={0.5}
              roughness={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          <mesh position={[0, 0.35, 0.35]}>
            <sphereGeometry args={[0.18, 12, 12]} />
            <meshStandardMaterial color="#a855f7" emissive="#9333ea" emissiveIntensity={1.6} />
          </mesh>
        </group>
      </group>

      {/* 4. Solar Array Field ([9.5, 0, -4.5]) */}
      <group
        position={[9.5, getTerrainHeight(9.5, -4.5), -4.5]}
        rotation={[0, -0.45, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("solar"));
        }}
      >
        {[-1.6, 0, 1.6].map((px, i) => (
          <group key={i} position={[px, 0, 0]}>
            <mesh position={[0, 0.55, 0]} castShadow>
              <cylinderGeometry args={[0.09, 0.11, 1.1, 8]} />
              <meshStandardMaterial color="#64748b" metalness={0.6} />
            </mesh>
            <mesh position={[0, 1.1, 0]} rotation={[0.45, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.35, 0.08, 2.1]} />
              <meshStandardMaterial
                color={panelsDusty ? "#9a5b3e" : "#1d4ed8"}
                metalness={panelsDusty ? 0.1 : 0.85}
                roughness={panelsDusty ? 0.95 : 0.15}
                emissive={panelsDusty ? "#000000" : "#0ea5e9"}
                emissiveIntensity={panelsDusty ? 0 : 0.28}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* 5. OSDR Bio-Algae Oxygen Lab ([8.0, 0, 7.5]) */}
      <group
        position={[8.0, getTerrainHeight(8.0, 7.5), 7.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("algae"));
        }}
      >
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.6, 0.5, 1.8]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.5} />
        </mesh>
        {[-0.65, 0.65].map((cx, i) => (
          <group key={i} position={[cx, 1.35, 0]}>
            <mesh castShadow>
              <cylinderGeometry args={[0.48, 0.48, 1.8, 16]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#059669"
                emissiveIntensity={0.95}
                transparent
                opacity={0.82}
              />
            </mesh>
            <mesh position={[0, 0.95, 0]}>
              <cylinderGeometry args={[0.52, 0.52, 0.18, 16]} />
              <meshStandardMaterial color="#e2e8f0" metalness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 6. Central Habitat Dome & MEDA Thermal Core ([0, 0, 0]) */}
      <group
        position={[0, getTerrainHeight(0, 0), 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectStructure(getStruct("habitat"));
        }}
      >
        <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[3.5, 3.8, 0.3, 24]} />
          <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
          <sphereGeometry args={[2.5, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f1f5f9" roughness={0.35} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.75, 2.4]} castShadow>
          <boxGeometry args={[1.25, 1.15, 1.1]} />
          <meshStandardMaterial color="#ea580c" roughness={0.4} />
        </mesh>
        {[0.6, -0.6, 1.8, -1.8].map((angle, i) => (
          <mesh
            key={i}
            position={[Math.sin(angle) * 2.42, 1.05, Math.cos(angle) * 2.42]}
            rotation={[0, angle, 0]}
          >
            <boxGeometry args={[0.52, 0.32, 0.1]} />
            <meshStandardMaterial
              color="#fef08a"
              emissive="#facc15"
              emissiveIntensity={isNight ? 2.4 : 0.95}
            />
          </mesh>
        ))}
        <mesh ref={shieldRef} position={[0, 0.2, 0]}>
          <sphereGeometry args={[4.1, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color={shieldColor}
            emissive={shieldColor}
            emissiveIntensity={0.65}
            transparent
            opacity={0.22}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Beacons & Floating [E] Prompts for all 6 structures */}
      {OUTPOST_STRUCTURES.map((s) => (
        <StructureBeacon
          key={s.id}
          structure={s}
          isNearby={nearbyId === s.id}
          isCompleted={completedTasks.includes(s.id)}
          label={moduleLabels[s.id]}
          interactPrompt={interactPrompt}
          onSelect={onSelectStructure}
        />
      ))}
    </group>
  );
}

function UpgradedRoverAndCamera({
  phase,
  roverMode,
  isPaused,
  roverUpgraded,
  dpadInput,
  targetTeleport,
  cameraSensitivity = 1,
  onProximityChange,
}) {
  const roverGroupRef = useRef();
  const chassisRef = useRef();
  const wheelRefs = useRef([]);
  const radarUpgradeRef = useRef();
  const thrusterFlameRef = useRef();
  const orbitControlsRef = useRef();

  const { camera, gl } = useThree();

  // Rover physics state
  const phys = useRef({
    pos: new THREE.Vector3(0, getTerrainHeight(0, 5.8) + 0.36, 5.8),
    heading: Math.PI, // facing habitat initially
    speed: 0,
    steerAngle: 0,
    wheelSpin: 0,
    camPos: new THREE.Vector3(0, 6, 14),
    camLook: new THREE.Vector3(0, 1.5, 4),
    orbitYawOffset: 0,
    orbitPitchOffset: 0.32,
    isPointerDragging: false,
  });

  const keysRef = useRef({});
  const nearbyIdRef = useRef(null);

  // Teleport / Focus helper when player clicks "Locate Next Task"
  useEffect(() => {
    if (!targetTeleport) return;
    const [tx, , tz] = targetTeleport.position;
    const angleToCenter = Math.atan2(-tx, -tz);
    const offsetX = tx + Math.sin(angleToCenter) * 3.8;
    const offsetZ = tz + Math.cos(angleToCenter) * 3.8;
    phys.current.pos.set(offsetX, getTerrainHeight(offsetX, offsetZ) + 0.36, offsetZ);
    phys.current.heading = Math.atan2(tx - offsetX, tz - offsetZ);
    phys.current.speed = 0;
  }, [targetTeleport]);

  // Keyboard & mouse-drag orbit offset listeners
  useEffect(() => {
    const onKeyDown = (e) => {
      keysRef.current[e.code] = true;
    };
    const onKeyUp = (e) => {
      keysRef.current[e.code] = false;
    };

    const dom = gl.domElement;
    const onPointerDown = (e) => {
      if (e.button === 0) phys.current.isPointerDragging = true;
    };
    const onPointerUp = () => {
      phys.current.isPointerDragging = false;
    };
    const onPointerMove = (e) => {
      if (!phys.current.isPointerDragging || !roverMode) return;
      phys.current.orbitYawOffset -= e.movementX * 0.0045 * cameraSensitivity;
      phys.current.orbitPitchOffset = THREE.MathUtils.clamp(
        phys.current.orbitPitchOffset + e.movementY * 0.0035 * cameraSensitivity,
        0.12,
        0.85
      );
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    dom.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      dom.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [gl, roverMode, cameraSensitivity]);

  // When switching into Orbit View (!roverMode), position camera nicely overlooking the outpost
  useEffect(() => {
    if (!roverMode && orbitControlsRef.current) {
      camera.position.set(0, 14, 22);
      orbitControlsRef.current.target.set(0, 1.2, 0);
      orbitControlsRef.current.update();
    }
  }, [roverMode, camera]);

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const p = phys.current;
    const k = keysRef.current;

    const canDrive = phase === "playing" && !isPaused;

    // 1. Vehicle Physics: Smooth Acceleration, Braking, Damping & Speed-Scaled Steering
    const throttle = canDrive
      ? (k["KeyW"] || k["ArrowUp"] || dpadInput.up ? 1 : 0) -
        (k["KeyS"] || k["ArrowDown"] || dpadInput.down ? 1 : 0)
      : 0;
    const steerInput = canDrive
      ? (k["KeyA"] || k["ArrowLeft"] || dpadInput.left ? 1 : 0) -
        (k["KeyD"] || k["ArrowRight"] || dpadInput.right ? 1 : 0)
      : 0;

    // Upgraded Rover gets +65% top speed & boost acceleration!
    const maxForwardSpeed = roverUpgraded ? 16.5 : 10.2;
    const maxReverseSpeed = roverUpgraded ? -8.5 : -5.5;
    const accelRate = roverUpgraded ? 28.0 : 17.5;
    const brakeRate = 30.0;
    const dragRate = 6.5;

    if (throttle > 0) {
      const rate = p.speed < 0 ? brakeRate : accelRate;
      p.speed = Math.min(maxForwardSpeed, p.speed + throttle * rate * dt);
    } else if (throttle < 0) {
      const rate = p.speed > 0 ? brakeRate : accelRate * 0.8;
      p.speed = Math.max(maxReverseSpeed, p.speed + throttle * rate * dt);
    } else {
      // Exponential velocity damping
      p.speed = THREE.MathUtils.lerp(p.speed, 0, 1 - Math.exp(-dragRate * dt));
      if (Math.abs(p.speed) < 0.04) p.speed = 0;
    }

    // Smooth steering angle with speed-scaled turn rate
    const targetSteer = steerInput * 0.55;
    p.steerAngle = THREE.MathUtils.lerp(p.steerAngle, targetSteer, 1 - Math.exp(-12 * dt));

    const speedFactor = Math.min(1, Math.abs(p.speed) / 2.2);
    const reverseSign = p.speed >= -0.05 ? 1 : -1;
    // Allow gentle pivot turning even at low speeds so kids never feel stuck
    const turnRate = (0.35 + 0.65 * speedFactor) * 2.4;
    if (Math.abs(steerInput) > 0.01 && (Math.abs(p.speed) > 0.08 || canDrive)) {
      p.heading += p.steerAngle * turnRate * reverseSign * dt;
    }

    // Integrate position
    const nextX = p.pos.x + Math.sin(p.heading) * p.speed * dt;
    const nextZ = p.pos.z + Math.cos(p.heading) * p.speed * dt;

    // Soft collision push-out from structure centers
    let finalX = THREE.MathUtils.clamp(nextX, -32, 32);
    let finalZ = THREE.MathUtils.clamp(nextZ, -32, 32);
    for (const s of OUTPOST_STRUCTURES) {
      const [sx, , sz] = s.position;
      const colRadius = s.id === "habitat" ? 3.9 : 2.1;
      const dx = finalX - sx;
      const dz = finalZ - sz;
      const dist = Math.hypot(dx, dz);
      if (dist < colRadius && dist > 0.001) {
        const push = (colRadius - dist) / dist;
        finalX += dx * push;
        finalZ += dz * push;
      }
    }

    p.pos.x = finalX;
    p.pos.z = finalZ;
    const groundY = getTerrainHeight(p.pos.x, p.pos.z);
    p.pos.y = THREE.MathUtils.lerp(p.pos.y, groundY + 0.36, 1 - Math.exp(-18 * dt));

    // Apply transform to Rover mesh
    if (roverGroupRef.current) {
      roverGroupRef.current.position.copy(p.pos);
      roverGroupRef.current.rotation.y = p.heading;
    }

    // Chassis pitch/roll suspension feel
    if (chassisRef.current) {
      const targetPitch = -throttle * 0.055;
      const targetRoll = -p.steerAngle * (p.speed / maxForwardSpeed) * 0.12;
      chassisRef.current.rotation.x = THREE.MathUtils.lerp(
        chassisRef.current.rotation.x,
        targetPitch,
        1 - Math.exp(-10 * dt)
      );
      chassisRef.current.rotation.z = THREE.MathUtils.lerp(
        chassisRef.current.rotation.z,
        targetRoll,
        1 - Math.exp(-10 * dt)
      );
    }

    // Wheel rotation & front wheel steering animation
    p.wheelSpin += (p.speed / 0.24) * dt;
    wheelRefs.current.forEach((wGroup, idx) => {
      if (!wGroup) return;
      const isFront = idx < 2;
      wGroup.rotation.y = isFront ? p.steerAngle * 0.65 : 0;
      const spinMesh = wGroup.children[0];
      if (spinMesh) {
        spinMesh.rotation.x = p.wheelSpin;
      }
    });

    // Upgraded Rover animations
    if (radarUpgradeRef.current) {
      radarUpgradeRef.current.rotation.y = clock.getElapsedTime() * 2.8;
    }
    if (thrusterFlameRef.current) {
      const flameScale = 0.7 + Math.abs(p.speed / maxForwardSpeed) * 0.9 + Math.sin(clock.getElapsedTime() * 25) * 0.15;
      thrusterFlameRef.current.scale.set(1, 1, flameScale);
    }

    // 2. Proximity check against all 6 Outpost Structures
    let closestStruct = null;
    let minD = Infinity;
    for (const s of OUTPOST_STRUCTURES) {
      const d = Math.hypot(p.pos.x - s.position[0], p.pos.z - s.position[2]);
      if (d <= s.interactionRadius && d < minD) {
        minD = d;
        closestStruct = s;
      }
    }
    const nextNearbyId = closestStruct ? closestStruct.id : null;
    if (nextNearbyId !== nearbyIdRef.current) {
      nearbyIdRef.current = nextNearbyId;
      onProximityChange(closestStruct);
    }

    // 3. Critically Damped Third-Person Chase Camera
    if (phase !== "start" && roverMode) {
      // Smoothly auto-recenter mouse orbit yaw when driving forward/backward
      if (Math.abs(throttle) > 0.1 && !p.isPointerDragging) {
        p.orbitYawOffset = THREE.MathUtils.lerp(
          p.orbitYawOffset,
          0,
          1 - Math.exp(-2.8 * dt)
        );
      }

      const camYaw = p.heading + p.orbitYawOffset;
      const camDist = 8.4;
      const horizDist = camDist * Math.cos(p.orbitPitchOffset);
      const vertDist = camDist * Math.sin(p.orbitPitchOffset) + 1.25;

      const desiredCamX = p.pos.x - Math.sin(camYaw) * horizDist;
      const desiredCamZ = p.pos.z - Math.cos(camYaw) * horizDist;
      const terrainUnderCam = getTerrainHeight(desiredCamX, desiredCamZ);
      const desiredCamY = Math.max(p.pos.y + vertDist, terrainUnderCam + 1.35);

      const camSmooth = 1 - Math.exp(-8.5 * dt);
      p.camPos.x = THREE.MathUtils.lerp(p.camPos.x, desiredCamX, camSmooth);
      p.camPos.y = THREE.MathUtils.lerp(p.camPos.y, desiredCamY, camSmooth);
      p.camPos.z = THREE.MathUtils.lerp(p.camPos.z, desiredCamZ, camSmooth);

      // Look slightly ahead of the rover chassis
      const lookAheadDist = 2.2;
      const desiredLookX = p.pos.x + Math.sin(p.heading) * lookAheadDist;
      const desiredLookZ = p.pos.z + Math.cos(p.heading) * lookAheadDist;
      const desiredLookY = p.pos.y + 0.85;

      const lookSmooth = 1 - Math.exp(-12 * dt);
      p.camLook.x = THREE.MathUtils.lerp(p.camLook.x, desiredLookX, lookSmooth);
      p.camLook.y = THREE.MathUtils.lerp(p.camLook.y, desiredLookY, lookSmooth);
      p.camLook.z = THREE.MathUtils.lerp(p.camLook.z, desiredLookZ, lookSmooth);

      camera.position.copy(p.camPos);
      camera.lookAt(p.camLook);
    } else if (orbitControlsRef.current) {
      orbitControlsRef.current.update();
    }
  });

  const wheelPositions = [
    [-0.65, 0.0, 0.58], // Front-Left
    [0.65, 0.0, 0.58], // Front-Right
    [-0.65, 0.0, -0.58], // Rear-Left
    [0.65, 0.0, -0.58], // Rear-Right
  ];

  return (
    <>
      <group ref={roverGroupRef} position={[0, 0.36, 5.8]}>
        <group ref={chassisRef}>
          {/* Main Rover Chassis */}
          <mesh position={[0, 0.24, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.08, 0.38, 1.55]} />
            <meshStandardMaterial
              color={roverUpgraded ? "#fef08a" : "#f8fafc"}
              metalness={roverUpgraded ? 0.65 : 0.3}
              roughness={0.3}
            />
          </mesh>

          {/* Cockpit Visor */}
          <mesh position={[0, 0.54, 0.22]} castShadow>
            <boxGeometry args={[0.76, 0.34, 0.68]} />
            <meshStandardMaterial color="#1e293b" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.55, 0.57]}>
            <boxGeometry args={[0.58, 0.16, 0.04]} />
            <meshStandardMaterial
              color="#38bdf8"
              emissive="#0ea5e9"
              emissiveIntensity={roverUpgraded ? 2.4 : 1.4}
            />
          </mesh>

          {/* Rover Headlights */}
          {[-0.32, 0.32].map((hx, idx) => (
            <mesh key={idx} position={[hx, 0.26, 0.78]}>
              <boxGeometry args={[0.2, 0.1, 0.04]} />
              <meshStandardMaterial color="#fef08a" emissive="#facc15" emissiveIntensity={1.8} />
            </mesh>
          ))}

          {/* UPGRADE PARTS (Attached when all 6 tasks are completed!) */}
          {roverUpgraded && (
            <group>
              {/* Dual Golden/Cyan Booster Thrusters */}
              {[-0.34, 0.34].map((tx, idx) => (
                <group key={idx} position={[tx, 0.3, -0.82]}>
                  <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
                    <cylinderGeometry args={[0.16, 0.22, 0.42, 12]} />
                    <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.2} />
                  </mesh>
                </group>
              ))}
              {/* Glowing Plasma Plumes */}
              <group ref={thrusterFlameRef} position={[0, 0.3, -1.05]}>
                {[-0.34, 0.34].map((tx, idx) => (
                  <mesh key={idx} position={[tx, 0, -0.2]} rotation={[-Math.PI / 2, 0, 0]}>
                    <coneGeometry args={[0.13, 0.55, 10]} />
                    <meshBasicMaterial color="#22d3ee" transparent opacity={0.85} />
                  </mesh>
                ))}
              </group>

              {/* Reinforced Sensor Mast & Spinning Radar Dish */}
              <mesh position={[0, 0.85, -0.25]} castShadow>
                <cylinderGeometry args={[0.06, 0.08, 0.45, 8]} />
                <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
              </mesh>
              <group ref={radarUpgradeRef} position={[0, 1.12, -0.25]}>
                <mesh rotation={[0.45, 0, 0]}>
                  <coneGeometry args={[0.38, 0.2, 14, 1, true]} />
                  <meshStandardMaterial
                    color="#38bdf8"
                    emissive="#0284c7"
                    emissiveIntensity={1.2}
                    side={THREE.DoubleSide}
                  />
                </mesh>
              </group>

              {/* Neon Chassis Underglow */}
              <pointLight position={[0, 0.05, 0]} color="#22d3ee" intensity={3.2} distance={5.5} />
            </group>
          )}
        </group>

        {/* 4 Animated Wheels with Steering & Rim Glow */}
        {wheelPositions.map((wPos, idx) => (
          <group
            key={idx}
            position={wPos}
            ref={(el) => {
              wheelRefs.current[idx] = el;
            }}
          >
            <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.24, 0.24, 0.2, 16]} />
              <meshStandardMaterial color="#1e293b" roughness={0.85} />
              {/* Glowing Wheel Rims when upgraded */}
              <mesh position={[0, 0.11, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.02, 12]} />
                <meshStandardMaterial
                  color={roverUpgraded ? "#22d3ee" : "#94a3b8"}
                  emissive={roverUpgraded ? "#06b6d4" : "#000000"}
                  emissiveIntensity={roverUpgraded ? 2.0 : 0}
                />
              </mesh>
              <mesh position={[0, -0.11, 0]}>
                <cylinderGeometry args={[0.13, 0.13, 0.02, 12]} />
                <meshStandardMaterial
                  color={roverUpgraded ? "#22d3ee" : "#94a3b8"}
                  emissive={roverUpgraded ? "#06b6d4" : "#000000"}
                  emissiveIntensity={roverUpgraded ? 2.0 : 0}
                />
              </mesh>
            </mesh>
          </group>
        ))}
      </group>

      {(phase === "start" || !roverMode) && (
        <OrbitControls
          ref={orbitControlsRef}
          makeDefault
          enableRotate={true}
          enableZoom={true}
          enablePan={true}
          enableDamping={true}
          dampingFactor={0.05}
          rotateSpeed={0.85 * cameraSensitivity}
          zoomSpeed={1.0}
          minDistance={6}
          maxDistance={38}
          maxPolarAngle={Math.PI / 2 - 0.06}
          minPolarAngle={0.15}
        />
      )}
    </>
  );
}

export default function MarsScene({
  planet = "lunar",
  phase,
  stats,
  currentSol,
  panelsDusty,
  roverMode,
  isPaused,
  roverUpgraded,
  dpadInput,
  nearbyStructure,
  completedTasks,
  targetTeleport,
  moduleLabels,
  interactPrompt,
  cameraSensitivity = 1,
  graphicsQuality = "high",
  onProximityChange,
  onSelectStructure,
}) {
  const isLunar = planet === "lunar";
  const isNight = phase === "playing" && currentSol === 6;
  const solarStorm = phase === "playing" && currentSol === 3;
  const skyColor = isLunar ? "#070b16" : isNight ? "#090f20" : "#c86d51";
  const high = graphicsQuality === "high";

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows={high}
        dpr={high ? [1, 2] : 1}
        camera={{ position: [0, 8.5, 16], fov: 52 }}
      >
        <color attach="background" args={[skyColor]} />
        <fogExp2 attach="fog" args={[skyColor, isLunar ? 0.008 : 0.013]} />

        <ambientLight
          intensity={isLunar ? 0.55 : isNight ? 0.38 : 0.68}
          color={isLunar ? "#e2e8f0" : isNight ? "#93c5fd" : "#ffedd5"}
        />
        <directionalLight
          position={[18, 24, 14]}
          intensity={isLunar ? 1.9 : isNight ? 0.5 : 1.75}
          color={isLunar ? "#f8fafc" : "#fff7ed"}
          castShadow={high}
          shadow-mapSize={high ? [1024, 1024] : [512, 512]}
          shadow-camera-left={-26}
          shadow-camera-right={26}
          shadow-camera-top={26}
          shadow-camera-bottom={-26}
        />

        {(isLunar || isNight) && (
          <Stars radius={80} depth={35} count={high ? 1800 : 800} factor={3.4} fade />
        )}

        <CraterTerrain planet={planet} />
        <FloatingDustMotes planet={planet} isNight={isNight} />

        <OutpostModules
          stats={stats}
          panelsDusty={panelsDusty}
          isNight={isNight}
          solarStorm={solarStorm}
          nearbyId={nearbyStructure?.id || null}
          completedTasks={completedTasks}
          moduleLabels={moduleLabels}
          interactPrompt={interactPrompt}
          onSelectStructure={onSelectStructure}
        />

        <UpgradedRoverAndCamera
          phase={phase}
          roverMode={roverMode}
          isPaused={isPaused}
          roverUpgraded={roverUpgraded}
          dpadInput={dpadInput}
          targetTeleport={targetTeleport}
          cameraSensitivity={cameraSensitivity}
          onProximityChange={onProximityChange}
        />
      </Canvas>
    </div>
  );
}
