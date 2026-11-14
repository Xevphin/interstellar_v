import React, { memo, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { Rocket, Astronaut, ParticleEmitter, Earth } from "../three/SpaceProps";
import { CutsceneOverlay, elapsedFrom, ramp, useCutsceneTimeline } from "./CutsceneKit";

const T = {
  walkEnd: 3.0, // astronaut reaches the capsule
  boarded: 3.1, // astronaut disappears inside
  ignite: 3.6,
  liftoff: 4.4,
  fadeToSpace: 6.4,
  space: 6.7,
  fadeOut: 10.8,
  end: 11.4,
};

const ROCKET_X = 2;
const WALK_FROM = -5;
const WALK_TO = ROCKET_X - 0.9;

function SurfaceStage({ startRef, planet, high }) {
  const isLunar = planet === "lunar";
  const astronautRef = useRef();
  const walkRef = useRef(1);
  const rocketRef = useRef();
  const thrustRef = useRef(0);
  const rocketY = useRef(0);
  const lookTarget = useMemo(() => new THREE.Vector3(WALK_FROM, 1, 0), []);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const e = elapsedFrom(startRef);

    // Astronaut walks to the capsule, then boards
    const walkT = ramp(e, 0.3, T.walkEnd);
    const ax = THREE.MathUtils.lerp(WALK_FROM, WALK_TO, walkT);
    walkRef.current = e > 0.3 && e < T.walkEnd ? 1 : 0;
    if (astronautRef.current) {
      astronautRef.current.position.x = ax;
      astronautRef.current.visible = e < T.boarded;
    }

    // Engines & liftoff
    thrustRef.current = e < T.ignite ? 0 : e < T.liftoff ? 0.3 + ramp(e, T.ignite, T.liftoff) * 0.5 : 1;
    const y = e < T.liftoff ? 0 : 4 * (e - T.liftoff) ** 2;
    rocketY.current = y;
    if (rocketRef.current) rocketRef.current.position.y = 0.4 + y;

    // Camera: follow the astronaut, then track the rising rocket
    if (e < T.boarded) desired.set(ax + 1, 1.2, 0);
    else desired.set(ROCKET_X, 0.4 + y + 2.5, 0);
    lookTarget.lerp(desired, 0.08);

    let shake = 0;
    if (e > T.ignite) shake = Math.max(0.015, 0.14 - (e - T.ignite) * 0.04);
    const rnd = () => (Math.random() - 0.5) * shake;
    camera.position.set(-2 + rnd(), 2.2 + y * 0.5 + rnd(), 10 + rnd());
    camera.lookAt(lookTarget);
  });

  const skyColor = isLunar ? "#020617" : "#c86d51";
  const groundColor = isLunar ? "#64748b" : "#b4532e";
  const dustColor = isLunar ? "#94a3b8" : "#d97757";

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fogExp2 attach="fog" args={[skyColor, isLunar ? 0.006 : 0.02]} />
      <ambientLight intensity={isLunar ? 0.5 : 0.7} />
      <directionalLight position={[15, 20, 10]} intensity={1.7} castShadow={high} />
      {isLunar && <Stars radius={90} depth={40} count={high ? 2500 : 1000} factor={3.5} fade />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color={groundColor} roughness={1} />
      </mesh>

      {/* Outpost habitat in the background */}
      <mesh position={[-11, 0, -7]} castShadow>
        <sphereGeometry args={[3, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#f1f5f9" roughness={0.35} />
      </mesh>
      <mesh position={[-6, 0.9, -9]} castShadow>
        <boxGeometry args={[2, 1.8, 1.6]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.4} roughness={0.4} />
      </mesh>

      {/* Landing pad + return rocket */}
      <mesh position={[ROCKET_X, 0.2, 0]} receiveShadow>
        <cylinderGeometry args={[2.2, 2.4, 0.4, 24]} />
        <meshStandardMaterial color="#475569" roughness={0.8} />
      </mesh>
      <group ref={rocketRef} position={[ROCKET_X, 0.4, 0]}>
        <Rocket thrustRef={thrustRef} />
      </group>

      <group ref={astronautRef} position={[WALK_FROM, 0, 0.9]} rotation={[0, Math.PI / 2, 0]}>
        <Astronaut walkRef={walkRef} />
      </group>

      {/* Surface dust kicked up by the engines */}
      <ParticleEmitter
        count={high ? 320 : 160}
        life={2.6}
        size={2.6}
        color={dustColor}
        opacity={0.5}
        drag={isLunar ? 0.3 : 0.9}
        getOrigin={(v) => v.set(ROCKET_X + (Math.random() - 0.5), 0.5, (Math.random() - 0.5))}
        getRate={() => {
          const e = elapsedFrom(startRef);
          if (e < T.ignite) return 0;
          return Math.max(0, 1 - (e - T.liftoff) / 2.5);
        }}
        spawnVelocity={(v) => {
          const a = Math.random() * Math.PI * 2;
          const s = 3 + Math.random() * 5;
          v.set(Math.cos(a) * s, 0.2 + Math.random(), Math.sin(a) * s);
        }}
      />
      <ParticleEmitter
        count={180}
        life={0.7}
        size={1.4}
        color="#fb923c"
        opacity={0.75}
        additive
        drag={1.5}
        getOrigin={(v) => v.set(ROCKET_X, 0.4 + rocketY.current, 0)}
        getRate={() => (thrustRef.current > 0.25 ? 1 : 0)}
        spawnVelocity={(v) => v.set((Math.random() - 0.5) * 1.2, -7 - Math.random() * 4, (Math.random() - 0.5) * 1.2)}
      />
    </>
  );
}

function HomewardStage({ startRef, high }) {
  const rocketRef = useRef();
  const thrustRef = useRef(1);
  const rocketPos = useRef(new THREE.Vector3());

  useFrame(({ camera }) => {
    const local = elapsedFrom(startRef) - T.space;
    const z = -local * 8;
    rocketPos.current.set(0, 0, z);
    if (rocketRef.current) {
      rocketRef.current.position.copy(rocketPos.current);
      rocketRef.current.rotation.z = Math.sin(local * 1.4) * 0.1;
    }
    camera.position.set(-3, 1.4, z + 8);
    camera.lookAt(0.5, 0, z - 6);
  });

  return (
    <>
      <color attach="background" args={["#020617"]} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[-20, 10, 10]} intensity={1.8} />
      <Stars radius={120} depth={60} count={high ? 3500 : 1500} factor={4} fade speed={1.5} />

      <Earth radius={16} spin={0.05} position={[6, -3, -90]} />

      <group ref={rocketRef}>
        <group rotation={[-Math.PI / 2, 0, 0]}>
          <Rocket thrustRef={thrustRef} />
        </group>
      </group>
      <ParticleEmitter
        count={200}
        life={1.2}
        size={1.1}
        color="#7dd3fc"
        opacity={0.6}
        additive
        drag={1}
        getOrigin={(v) => v.copy(rocketPos.current).add(new THREE.Vector3(0, 0, 0.3))}
        getRate={() => 1}
        spawnVelocity={(v) => v.set((Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5, 5)}
      />
    </>
  );
}

const ReturnScene = memo(function ReturnScene({ startRef, stage, planet, high }) {
  return (
    <Canvas shadows={high} dpr={high ? [1, 2] : 1} camera={{ position: [-2, 2.2, 10], fov: 55 }}>
      {stage === "surface" ? (
        <SurfaceStage startRef={startRef} planet={planet} high={high} />
      ) : (
        <HomewardStage startRef={startRef} high={high} />
      )}
    </Canvas>
  );
});

export default function ReturnCutscene({ t, planet, graphicsQuality, onComplete }) {
  const { elapsed: e, startRef, skip } = useCutsceneTimeline(T.end, onComplete);
  const stage = e < T.space ? "surface" : "space";
  const high = graphicsQuality === "high";

  let caption = null;
  if (e < T.boarded + 0.3) caption = t.returnScene.boarding;
  else if (e >= T.ignite && e < T.fadeToSpace) caption = t.returnScene.liftoff;
  else if (e >= T.space) caption = t.returnScene.cruising;

  const fade = Math.max(
    1 - ramp(e, 0, 0.5),
    ramp(e, T.fadeToSpace, T.space) * (1 - ramp(e, T.space, T.space + 0.4)),
    ramp(e, T.fadeOut, T.end)
  );

  return (
    <div className="fixed inset-0 z-0 bg-black">
      <ReturnScene startRef={startRef} stage={stage} planet={planet} high={high} />
      <CutsceneOverlay fade={fade} caption={caption} onSkip={skip} skipLabel={t.returnScene.skip} />
    </div>
  );
}
