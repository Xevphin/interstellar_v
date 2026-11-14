import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";

// Deterministic Jezero Crater heightmap: flat central outpost basin, crater rim ridges outside
export function getTerrainHeight(x, z) {
  const dist = Math.hypot(x, z);
  const rimFactor = Math.max(0, (dist - 15) / 28);
  const craterRim =
    Math.pow(Math.min(rimFactor, 1.8), 1.7) * 5.2 +
    Math.sin(x * 0.12) * Math.cos(z * 0.12) * Math.min(rimFactor, 1) * 1.8;
  const micro = Math.sin(x * 0.35 + 1.1) * Math.cos(z * 0.32) * 0.18 * Math.min(dist / 10, 1);
  return craterRim + micro;
}

const MODULE_POSITIONS = {
  habitat: new THREE.Vector3(0, 1.2, 0),
  solar: new THREE.Vector3(7.5, 0.8, -3.5),
  moxie: new THREE.Vector3(-7.0, 0.9, -2.5),
  greenhouse: new THREE.Vector3(-5.2, 0.9, 6.2),
};

function MartianTerrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(130, 130, 96, 96);
    geo.rotateX(-Math.PI / 2);
    const pos = geo.attributes.position;
    const colors = new Float32Array(pos.count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y = getTerrainHeight(x, z);
      pos.setY(i, y);

      if (y < 0.4) {
        c.set("#a84829");
      } else if (y < 2.2) {
        c.set("#be5533");
      } else if (y < 5.0) {
        c.set("#94371d");
      } else {
        c.set("#732613");
      }
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
  }, []);

  const rocks = useMemo(() => {
    const items = [];
    let seed = 101;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 65; i++) {
      const angle = rand() * Math.PI * 2;
      const dist = 12 + rand() * 38;
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
        <meshStandardMaterial vertexColors roughness={0.94} metalness={0.04} flatShading />
      </mesh>
      {rocks.map((r, idx) => (
        <mesh key={idx} position={r.pos} scale={r.scale} rotation={r.rot} castShadow receiveShadow>
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial color="#7d311a" roughness={0.9} flatShading />
        </mesh>
      ))}
    </group>
  );
}

function FloatingDustMotes({ isNight }) {
  const ref = useRef();
  const count = 240;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 48;
      arr[i * 3 + 1] = Math.random() * 12 + 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 48;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + delta * 0.55;
      let y = pos.getY(i) + Math.sin(i + x * 0.3) * delta * 0.15;
      if (x > 24) x = -24;
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
        color={isNight ? "#94a3b8" : "#f5a07a"}
        size={0.14}
        transparent
        opacity={isNight ? 0.35 : 0.65}
        sizeAttenuation
      />
    </points>
  );
}

function DustDevil({ active }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current || !active) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.x = Math.sin(t * 0.45) * 14 + 4;
    groupRef.current.position.z = Math.cos(t * 0.35) * 10 - 2;
    groupRef.current.rotation.y = t * 4.5;
  });

  if (!active) return null;

  return (
    <group ref={groupRef} position={[8, 0, -4]}>
      {[0, 1, 2, 3, 4].map((ring) => (
        <mesh key={ring} position={[0, 0.8 + ring * 1.1, 0]} rotation={[Math.PI / 2, 0, ring]}>
          <torusGeometry args={[0.7 + ring * 0.42, 0.22 + ring * 0.05, 8, 18]} />
          <meshStandardMaterial color="#d97757" transparent opacity={0.42 - ring * 0.05} roughness={1} />
        </mesh>
      ))}
    </group>
  );
}

function HabitatAndShield({ shielding, isNight, solarStorm, onSelect, selected, label }) {
  const shieldRef = useRef();

  useFrame(({ clock }) => {
    if (!shieldRef.current) return;
    const t = clock.getElapsedTime();
    const isLow = shielding <= 25;
    let baseOpacity = 0.12 + (shielding / 100) * 0.22;

    if (solarStorm) {
      baseOpacity += Math.sin(t * 8) * 0.14;
    } else if (isLow) {
      baseOpacity = 0.08 + Math.abs(Math.sin(t * 10)) * 0.18;
    }
    shieldRef.current.material.opacity = THREE.MathUtils.clamp(baseOpacity, 0.06, 0.5);
  });

  const shieldColor =
    shielding <= 25 ? "#ef4444" : shielding <= 45 ? "#f59e0b" : solarStorm ? "#a855f7" : "#38bdf8";

  return (
    <group
      position={[0, 0, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("habitat");
      }}
    >
      {/* Base Platform */}
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3.6, 3.9, 0.3, 24]} />
        <meshStandardMaterial color="#334155" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Pressurized White Habitat Dome */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <sphereGeometry args={[2.6, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#e2e8f0" roughness={0.35} metalness={0.2} />
      </mesh>

      {/* Orange Airlock Tunnel */}
      <mesh position={[0, 0.75, 2.5]} castShadow>
        <boxGeometry args={[1.3, 1.2, 1.2]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>

      {/* Warm Glowing Windows (brighter at night) */}
      {[0.6, -0.6, 1.8, -1.8].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.sin(angle) * 2.52, 1.05, Math.cos(angle) * 2.52]}
          rotation={[0, angle, 0]}
        >
          <boxGeometry args={[0.55, 0.32, 0.1]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#facc15"
            emissiveIntensity={isNight ? 2.4 : 0.9}
          />
        </mesh>
      ))}

      {/* Glowing Energy Shield Bubble */}
      <mesh ref={shieldRef} position={[0, 0.2, 0]}>
        <sphereGeometry args={[4.3, 28, 20, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={shieldColor}
          emissive={shieldColor}
          emissiveIntensity={solarStorm ? 1.3 : 0.65}
          transparent
          opacity={0.25}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {selected && (
        <Html position={[0, 4.9, 0]} center distanceFactor={14}>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-sky-400/60 text-xs font-bold text-sky-200 whitespace-nowrap shadow-lg">
            🛡️ {label} ({shielding}%)
          </div>
        </Html>
      )}
    </group>
  );
}

function SolarArrayField({ dusty, power, onSelect, selected, label }) {
  const panels = [
    [-1.6, 0],
    [0, 0],
    [1.6, 0],
  ];

  return (
    <group
      position={[7.5, getTerrainHeight(7.5, -3.5), -3.5]}
      rotation={[0, -0.45, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("solar");
      }}
    >
      {panels.map(([px, pz], i) => (
        <group key={i} position={[px, 0, pz]}>
          {/* Pole */}
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.1, 1.0, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.6} />
          </mesh>
          {/* Tilted Solar Panel */}
          <mesh position={[0, 1.05, 0]} rotation={[0.45, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.3, 0.08, 2.0]} />
            <meshStandardMaterial
              color={dusty ? "#b85535" : "#1d4ed8"}
              metalness={dusty ? 0.08 : 0.85}
              roughness={dusty ? 0.95 : 0.15}
              emissive={dusty ? "#000000" : "#0ea5e9"}
              emissiveIntensity={dusty ? 0 : 0.25}
            />
          </mesh>
        </group>
      ))}

      {selected && (
        <Html position={[0, 2.5, 0]} center distanceFactor={14}>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-amber-400/60 text-xs font-bold text-amber-200 whitespace-nowrap shadow-lg">
            ⚡ {label} ({power}%)
          </div>
        </Html>
      )}
    </group>
  );
}

function MoxieUnit({ oxygen, onSelect, selected, label }) {
  const ventRef = useRef();

  useFrame(({ clock }) => {
    if (!ventRef.current) return;
    const speed = 2 + (oxygen / 100) * 6;
    const pulse = 0.6 + Math.sin(clock.getElapsedTime() * speed) * 0.4;
    ventRef.current.material.emissiveIntensity = 0.6 + pulse * 1.4;
  });

  return (
    <group
      position={[-7.0, getTerrainHeight(-7.0, -2.5), -2.5]}
      rotation={[0, 0.4, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("moxie");
      }}
    >
      {/* Reactor Box */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 1.5, 1.5]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.4} roughness={0.4} />
      </mesh>
      {/* Gold NASA Foil Accent */}
      <mesh position={[0, 0.75, 0.76]}>
        <boxGeometry args={[1.4, 0.9, 0.06]} />
        <meshStandardMaterial color="#eab308" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Glowing Oxygen Vent */}
      <mesh ref={ventRef} position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.35, 12]} />
        <meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1.4} />
      </mesh>

      {selected && (
        <Html position={[0, 2.7, 0]} center distanceFactor={14}>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-cyan-400/60 text-xs font-bold text-cyan-200 whitespace-nowrap shadow-lg">
            🫁 {label} ({oxygen}%)
          </div>
        </Html>
      )}
    </group>
  );
}

function GreenhousePod({ food, onSelect, selected, label }) {
  const growIntensity = 0.3 + (food / 100) * 1.6;

  return (
    <group
      position={[-5.2, getTerrainHeight(-5.2, 6.2), 6.2]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect("greenhouse");
      }}
    >
      {/* Soil Planter Base */}
      <mesh position={[0, 0.2, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[2.0, 2.2, 0.4, 18]} />
        <meshStandardMaterial color="#475569" roughness={0.7} />
      </mesh>
      {/* Green Space Potato Plants */}
      {[
        [-0.7, -0.4],
        [0.6, -0.5],
        [-0.2, 0.6],
        [0.7, 0.5],
        [0, 0],
      ].map(([px, pz], idx) => (
        <mesh key={idx} position={[px, 0.65, pz]} castShadow>
          <dodecahedronGeometry args={[0.34, 0]} />
          <meshStandardMaterial color="#22c55e" emissive="#15803d" emissiveIntensity={growIntensity * 0.4} />
        </mesh>
      ))}
      {/* Grow Light Ring */}
      <mesh position={[0, 1.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.06, 8, 20]} />
        <meshStandardMaterial color="#f0abfc" emissive="#d946ef" emissiveIntensity={growIntensity} />
      </mesh>
      {/* Transparent Glass Dome */}
      <mesh position={[0, 0.3, 0]}>
        <sphereGeometry args={[1.95, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#bae6fd" transparent opacity={0.28} roughness={0.1} depthWrite={false} />
      </mesh>

      {selected && (
        <Html position={[0, 2.8, 0]} center distanceFactor={14}>
          <div className="px-3 py-1 rounded-full bg-slate-900/90 border border-emerald-400/60 text-xs font-bold text-emerald-200 whitespace-nowrap shadow-lg">
            🌱 {label} ({food}%)
          </div>
        </Html>
      )}
    </group>
  );
}

function ReliefRocket({ visible }) {
  const rocketRef = useRef();

  useFrame(({ clock }) => {
    if (!rocketRef.current || !visible) return;
    rocketRef.current.position.y =
      getTerrainHeight(6, 10) + 1.8 + Math.sin(clock.getElapsedTime() * 1.5) * 0.06;
  });

  if (!visible) return null;

  return (
    <group ref={rocketRef} position={[6, getTerrainHeight(6, 10) + 1.8, 10]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.55, 0.85, 3.4, 16]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.35} roughness={0.3} />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <coneGeometry args={[0.55, 1.2, 16]} />
        <meshStandardMaterial color="#ea580c" roughness={0.4} />
      </mesh>
      <pointLight position={[0, -1.6, 0]} color="#38bdf8" intensity={4} distance={10} />
    </group>
  );
}

function MiniRover({ roverMode, dpadInput }) {
  const roverRef = useRef();
  const keysRef = useRef({});
  const posRef = useRef(new THREE.Vector3(3.8, getTerrainHeight(3.8, 4.5) + 0.35, 4.5));
  const rotYRef = useRef(-0.6);

  useEffect(() => {
    const onDown = (e) => {
      keysRef.current[e.code] = true;
    };
    const onUp = (e) => {
      keysRef.current[e.code] = false;
    };
    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!roverRef.current) return;
    if (roverMode) {
      const k = keysRef.current;
      const forward =
        (k["KeyW"] || k["ArrowUp"] || dpadInput.up ? 1 : 0) -
        (k["KeyS"] || k["ArrowDown"] || dpadInput.down ? 1 : 0);
      const turn =
        (k["KeyA"] || k["ArrowLeft"] || dpadInput.left ? 1 : 0) -
        (k["KeyD"] || k["ArrowRight"] || dpadInput.right ? 1 : 0);

      rotYRef.current += turn * delta * 2.4;
      const speed = 6.5;
      posRef.current.x += Math.sin(rotYRef.current) * forward * speed * delta;
      posRef.current.z += Math.cos(rotYRef.current) * forward * speed * delta;

      // Keep inside crater exploration area
      posRef.current.x = THREE.MathUtils.clamp(posRef.current.x, -26, 26);
      posRef.current.z = THREE.MathUtils.clamp(posRef.current.z, -26, 26);
    }

    const groundY = getTerrainHeight(posRef.current.x, posRef.current.z);
    posRef.current.y = THREE.MathUtils.lerp(posRef.current.y, groundY + 0.32, 0.25);

    roverRef.current.position.copy(posRef.current);
    roverRef.current.rotation.y = rotYRef.current;
  });

  return (
    <group ref={roverRef} position={[3.8, 0.32, 4.5]}>
      {/* Chassis */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.9, 0.38, 1.25]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.35} />
      </mesh>
      {/* Cute Visor */}
      <mesh position={[0, 0.55, 0.25]} castShadow>
        <boxGeometry args={[0.62, 0.34, 0.55]} />
        <meshStandardMaterial color="#1e293b" roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.56, 0.53]}>
        <boxGeometry args={[0.45, 0.16, 0.04]} />
        <meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={1.5} />
      </mesh>
      {/* 4 Wheels */}
      {[
        [-0.5, 0.16, 0.42],
        [0.5, 0.16, 0.42],
        [-0.5, 0.16, -0.42],
        [0.5, 0.16, -0.42],
      ].map((w, idx) => (
        <mesh key={idx} position={w} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.14, 12]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function SceneRig({
  phase,
  focusModule,
  camResetTick,
  isNight,
  solarStorm,
  isVictory,
}) {
  const controlsRef = useRef();
  const { scene } = useThree();
  const targetVec = useMemo(() => new THREE.Vector3(0, 1.0, 0), []);

  useEffect(() => {
    const target = MODULE_POSITIONS[focusModule] || MODULE_POSITIONS.habitat;
    targetVec.copy(target);
  }, [focusModule, camResetTick, targetVec]);

  useFrame(({ clock }) => {
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetVec, 0.06);
      controlsRef.current.update();
    }

    // Dynamic sky & fog colors
    let skyHex = "#c86d51";
    let fogDensity = 0.014;
    if (isVictory) {
      skyHex = "#e89b6c";
      fogDensity = 0.009;
    } else if (isNight) {
      skyHex = "#090f20";
      fogDensity = 0.018;
    } else if (solarStorm) {
      const flash = Math.sin(clock.getElapsedTime() * 7) * 0.5 + 0.5;
      skyHex = flash > 0.5 ? "#f59e0b" : "#c86d51";
      fogDensity = 0.015;
    }

    const targetColor = new THREE.Color(skyHex);
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetColor, 0.05);
    }
    if (scene.fog) {
      scene.fog.color.lerp(targetColor, 0.05);
      scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, fogDensity, 0.05);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      autoRotate={phase === "start"}
      autoRotateSpeed={0.65}
      minDistance={6.5}
      maxDistance={32}
      maxPolarAngle={Math.PI / 2 - 0.09}
      minPolarAngle={0.22}
    />
  );
}

export default function MarsScene({
  phase,
  stats,
  currentSol,
  panelsDusty,
  focusModule,
  selectedModule,
  onSelectModule,
  camResetTick,
  roverMode,
  dpadInput,
  moduleLabels,
}) {
  const isNight = phase === "playing" && currentSol === 6;
  const solarStorm = phase === "playing" && currentSol === 3;
  const dustDevil = phase === "playing" && currentSol === 4;
  const isVictory = phase === "victory" || phase === "quiz" || phase === "certificate";

  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        shadows
        camera={{ position: [14, 9.5, 16], fov: 50 }}
        onPointerMissed={() => onSelectModule(null)}
      >
        <color attach="background" args={["#c86d51"]} />
        <fogExp2 attach="fog" args={["#c86d51", 0.014]} />

        <ambientLight intensity={isNight ? 0.35 : 0.65} color={isNight ? "#93c5fd" : "#ffedd5"} />
        <directionalLight
          position={isNight ? [-12, 18, -10] : [18, 22, 12]}
          intensity={isNight ? 0.45 : isVictory ? 2.1 : 1.75}
          color={isNight ? "#60a5fa" : "#fff7ed"}
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-camera-left={-22}
          shadow-camera-right={22}
          shadow-camera-top={22}
          shadow-camera-bottom={-22}
        />

        {(isNight || isVictory) && <Stars radius={70} depth={30} count={1500} factor={3.2} fade />}

        <MartianTerrain />
        <FloatingDustMotes isNight={isNight} />
        <DustDevil active={dustDevil} />

        <HabitatAndShield
          shielding={stats.shielding}
          isNight={isNight}
          solarStorm={solarStorm}
          onSelect={onSelectModule}
          selected={selectedModule === "habitat"}
          label={moduleLabels.habitat}
        />
        <SolarArrayField
          dusty={panelsDusty}
          power={stats.power}
          onSelect={onSelectModule}
          selected={selectedModule === "solar"}
          label={moduleLabels.solar}
        />
        <MoxieUnit
          oxygen={stats.oxygen}
          onSelect={onSelectModule}
          selected={selectedModule === "moxie"}
          label={moduleLabels.moxie}
        />
        <GreenhousePod
          food={stats.food}
          onSelect={onSelectModule}
          selected={selectedModule === "greenhouse"}
          label={moduleLabels.greenhouse}
        />

        <MiniRover roverMode={roverMode} dpadInput={dpadInput} />
        <ReliefRocket visible={isVictory} />

        <SceneRig
          phase={phase}
          focusModule={focusModule}
          camResetTick={camResetTick}
          isNight={isNight}
          solarStorm={solarStorm}
          isVictory={isVictory}
        />
      </Canvas>
    </div>
  );
}
