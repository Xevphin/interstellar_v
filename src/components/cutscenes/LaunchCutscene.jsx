import React, { memo, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { Rocket, ParticleEmitter, PlanetBody } from "../three/SpaceProps";
import { CutsceneOverlay, elapsedFrom, ramp, useCutsceneTimeline } from "./CutsceneKit";

// Timeline (seconds)
const T = {
  ignite: 1.8, // engines start rumbling during "1"
  liftoff: 3.0, // synced with "LIFTOFF!"
  fadeToSpace: 7.0,
  space: 7.3,
  fadeOut: 10.6,
  end: 11.2,
};

const ROCKET_ACCEL = 3.75; // y = k * (t - liftoff)^2

function LaunchPadStage({ startRef, high }) {
  const rocketRef = useRef();
  const thrustRef = useRef(0);
  const rocketY = useRef(0);
  const { scene } = useThree();
  const skyDay = useMemo(() => new THREE.Color("#7dd3fc"), []);
  const skySpace = useMemo(() => new THREE.Color("#020617"), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 3, 0), []);

  useFrame(({ camera }) => {
    const e = elapsedFrom(startRef);

    thrustRef.current =
      e < T.ignite ? 0 : e < T.liftoff ? 0.3 + ramp(e, T.ignite, T.liftoff) * 0.5 : 1;

    const y = e < T.liftoff ? 0 : ROCKET_ACCEL * (e - T.liftoff) ** 2;
    rocketY.current = y;
    if (rocketRef.current) rocketRef.current.position.y = 0.6 + y;

    // Camera shake synced with ignition & liftoff
    let shake = 0;
    if (e > T.ignite && e < T.liftoff) shake = 0.04 + ramp(e, T.ignite, T.liftoff) * 0.12;
    else if (e >= T.liftoff) shake = Math.max(0.02, 0.22 - (e - T.liftoff) * 0.05);

    const rnd = () => (Math.random() - 0.5) * shake;
    camera.position.set(9 + rnd(), 3 + y * 0.55 + rnd(), 13 + rnd());
    lookTarget.lerp(new THREE.Vector3(0, 0.6 + y + 2.5, 0), 0.2);
    camera.lookAt(lookTarget);

    // Sky darkens as the rocket climbs toward space
    const k = THREE.MathUtils.clamp(y / 70, 0, 1);
    if (scene.background) scene.background.copy(skyDay).lerp(skySpace, k);
    if (scene.fog) scene.fog.color.copy(scene.background);
  });

  const rocketBase = (v) => v.set(0, 0.6 + rocketY.current, 0);

  return (
    <>
      <color attach="background" args={["#7dd3fc"]} />
      <fogExp2 attach="fog" args={["#7dd3fc", 0.012]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[15, 25, 10]} intensity={1.6} castShadow={high} />

      {/* Ground & launch pad */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[500, 500]} />
        <meshStandardMaterial color="#7c8f6a" roughness={1} />
      </mesh>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[3, 3.3, 0.6, 32]} />
        <meshStandardMaterial color="#9ca3af" roughness={0.9} />
      </mesh>
      {/* Launch tower */}
      <group position={[-2.3, 0, 0]}>
        <mesh position={[0, 4, 0]} castShadow>
          <boxGeometry args={[0.7, 8, 0.7]} />
          <meshStandardMaterial color="#b91c1c" roughness={0.6} />
        </mesh>
        {[2, 4, 6].map((h) => (
          <mesh key={h} position={[0.9, h, 0]} castShadow>
            <boxGeometry args={[1.2, 0.15, 0.25]} />
            <meshStandardMaterial color="#e5e7eb" metalness={0.6} roughness={0.4} />
          </mesh>
        ))}
      </group>

      <group ref={rocketRef} position={[0, 0.6, 0]}>
        <Rocket thrustRef={thrustRef} />
      </group>

      {/* Billowing pad smoke */}
      <ParticleEmitter
        count={high ? 420 : 200}
        life={3}
        size={3.4}
        color="#e5e7eb"
        opacity={0.5}
        drag={0.9}
        rise={0.5}
        getOrigin={(v) => v.set((Math.random() - 0.5) * 0.8, 0.7, (Math.random() - 0.5) * 0.8)}
        getRate={() => {
          const e = elapsedFrom(startRef);
          if (e < T.ignite) return 0;
          if (e < T.liftoff) return 0.55;
          return Math.max(0, 1 - (e - T.liftoff) / 3);
        }}
        spawnVelocity={(v) => {
          const a = Math.random() * Math.PI * 2;
          const s = 3 + Math.random() * 6;
          v.set(Math.cos(a) * s, 0.3 + Math.random() * 1.5, Math.sin(a) * s);
        }}
      />
      {/* Fiery exhaust */}
      <ParticleEmitter
        count={high ? 260 : 140}
        life={0.8}
        size={1.6}
        color="#fb923c"
        opacity={0.75}
        additive
        drag={1.5}
        getOrigin={rocketBase}
        getRate={() => (thrustRef.current > 0.25 ? 1 : 0)}
        spawnVelocity={(v) =>
          v.set((Math.random() - 0.5) * 1.2, -7 - Math.random() * 5, (Math.random() - 0.5) * 1.2)
        }
      />
      {/* Smoke trail behind the climbing rocket */}
      <ParticleEmitter
        count={high ? 320 : 160}
        life={3.5}
        size={2.6}
        color="#cbd5e1"
        opacity={0.4}
        drag={1.2}
        getOrigin={(v) => rocketBase(v).add(new THREE.Vector3(0, -1.2, 0))}
        getRate={() => (elapsedFrom(startRef) > T.liftoff + 0.2 ? 1 : 0)}
        spawnVelocity={(v) => v.set((Math.random() - 0.5) * 1.5, -1.5, (Math.random() - 0.5) * 1.5)}
      />
    </>
  );
}

function TransitStage({ startRef, planet, high }) {
  const rocketRef = useRef();
  const thrustRef = useRef(1);
  const rocketPos = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const local = elapsedFrom(startRef) - T.space;
    const z = -local * 9;
    rocketPos.current.set(0, 0, z);
    if (rocketRef.current) {
      rocketRef.current.position.copy(rocketPos.current);
      rocketRef.current.rotation.z = Math.sin(local * 1.5) * 0.08;
    }
    camera.position.set(3.2, 1.6, z + 8.5);
    camera.lookAt(0, 0, z - 6);
  });

  return (
    <>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[20, 10, 15]} intensity={1.8} />
      <Stars radius={120} depth={60} count={high ? 3500 : 1500} factor={4} fade speed={1.5} />

      <PlanetBody planet={planet} radius={18} position={[-6, -4, -95]} />

      <group ref={rocketRef}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Rocket thrustRef={thrustRef} />
        </group>
      </group>
      <ParticleEmitter
        count={200}
        life={1.2}
        size={1.1}
        color="#fdba74"
        opacity={0.65}
        additive
        drag={1}
        getOrigin={(v) => v.copy(rocketPos.current).add(new THREE.Vector3(0, 0, 0.3))}
        getRate={() => 1}
        spawnVelocity={(v) => v.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 5)}
      />
    </>
  );
}

const LaunchScene = memo(function LaunchScene({ startRef, stage, planet, high }) {
  return (
    <Canvas shadows={high} dpr={high ? [1, 2] : 1} camera={{ position: [9, 3, 13], fov: 55 }}>
      {stage === "pad" ? (
        <LaunchPadStage startRef={startRef} high={high} />
      ) : (
        <TransitStage startRef={startRef} planet={planet} high={high} />
      )}
    </Canvas>
  );
});

export default function LaunchCutscene({ t, planet, graphicsQuality, onComplete }) {
  const { elapsed: e, startRef, skip } = useCutsceneTimeline(T.end, onComplete);
  const stage = e < T.space ? "pad" : "space";
  const high = graphicsQuality === "high";

  let countdown = null;
  if (e < 1) countdown = "3";
  else if (e < 2) countdown = "2";
  else if (e < T.liftoff) countdown = "1";
  else if (e < 4.4) countdown = t.launch.liftoff;

  let caption = null;
  if (e >= T.ignite && e < T.liftoff) caption = t.launch.ignition;
  else if (e >= 4.4 && e < T.fadeToSpace) caption = t.launch.ascending;
  else if (e >= T.space) caption = t.launch.enRoute[planet];

  const fade = Math.max(
    1 - ramp(e, 0, 0.5),
    ramp(e, T.fadeToSpace, T.space) * (1 - ramp(e, T.space, T.space + 0.4)),
    ramp(e, T.fadeOut, T.end)
  );

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <LaunchScene startRef={startRef} stage={stage} planet={planet} high={high} />
      <CutsceneOverlay
        fade={fade}
        countdown={countdown}
        caption={caption}
        onSkip={skip}
        skipLabel={t.launch.skip}
      />
    </div>
  );
}
