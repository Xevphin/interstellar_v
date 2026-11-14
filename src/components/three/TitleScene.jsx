import React, { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { Rocket, ParticleEmitter, Earth } from "./SpaceProps";

// Slow-drifting high-altitude cloud wisps along the Earth's limb.
function StratosphereClouds({ count = 260 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 120;
      arr[i * 3 + 1] = -7.5 + Math.random() * 2.2;
      arr[i * 3 + 2] = -10 - Math.random() * 40;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      let x = pos.getX(i) + delta * 0.6;
      if (x > 60) x = -60;
      pos.setX(i, x);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color="#e0f2fe" size={0.9} transparent opacity={0.35} depthWrite={false} sizeAttenuation />
    </points>
  );
}

// Rocket flying across the stratosphere on a gentle looping arc.
function FlyingRocket() {
  const headingRef = useRef();
  const spinRef = useRef();
  const thrustRef = useRef(1);
  const state = useRef({
    pos: new THREE.Vector3(),
    dir: new THREE.Vector3(1, 0, 0),
  });

  const pathAt = (u, out) => {
    // u: 0..1 across the screen
    out.set(-26 + u * 52, 0.8 + Math.sin(u * Math.PI) * 3.2, -6 + Math.sin(u * Math.PI * 2) * 1.5);
    return out;
  };

  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ clock }) => {
    const period = 16;
    const u = (clock.getElapsedTime() % period) / period;
    pathAt(u, tmpA);
    pathAt(Math.min(1, u + 0.002), tmpB);
    const dir = tmpB.clone().sub(tmpA).normalize();
    state.current.pos.copy(tmpA);
    state.current.dir.copy(dir);

    if (headingRef.current) {
      headingRef.current.position.copy(tmpA);
      headingRef.current.rotation.z = Math.atan2(dir.y, dir.x) - Math.PI / 2;
      headingRef.current.rotation.y = Math.sin(u * Math.PI * 2) * 0.25;
    }
    if (spinRef.current) spinRef.current.rotation.y = clock.getElapsedTime() * 0.8;
    thrustRef.current = 0.85 + Math.sin(clock.getElapsedTime() * 3) * 0.1;
  });

  return (
    <>
      <group ref={headingRef} scale={0.62}>
        <group ref={spinRef}>
          <Rocket thrustRef={thrustRef} />
        </group>
      </group>
      {/* Exhaust trail */}
      <ParticleEmitter
        count={220}
        life={1.6}
        size={0.9}
        color="#fdba74"
        opacity={0.6}
        additive
        drag={1.2}
        getOrigin={(v) => v.copy(state.current.pos).addScaledVector(state.current.dir, -0.4)}
        getRate={() => 1}
        spawnVelocity={(v) =>
          v
            .copy(state.current.dir)
            .multiplyScalar(-3.5)
            .add(new THREE.Vector3((Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6, (Math.random() - 0.5) * 0.6))
        }
      />
    </>
  );
}

function SlowCameraDrift() {
  useFrame(({ camera, clock }) => {
    const t = clock.getElapsedTime();
    camera.position.x = Math.sin(t * 0.05) * 1.5;
    camera.position.y = 2.2 + Math.sin(t * 0.08) * 0.3;
    camera.lookAt(0, 0.2, -6);
  });
  return null;
}

export default function TitleScene({ graphicsQuality = "high" }) {
  const high = graphicsQuality === "high";
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 2.2, 14], fov: 55 }} dpr={high ? [1, 2] : 1}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[30, 20, 10]} intensity={1.6} color="#fff7ed" />

        <Stars radius={120} depth={60} count={high ? 4000 : 1500} factor={4} fade speed={0.6} />

        {/* Curved Earth horizon far below */}
        <Earth radius={80} spin={0.004} position={[0, -88, -30]} />

        <StratosphereClouds count={high ? 260 : 120} />
        <FlyingRocket />
        <SlowCameraDrift />
      </Canvas>
      {/* Atmospheric gradient for the horizon glow */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-sky-500/25 via-sky-400/5 to-transparent" />
    </div>
  );
}
