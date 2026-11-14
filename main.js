import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js";

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------
const CONFIG = {
  worldSize: 420,
  terrainSegments: 140,
  beaconCount: 8,
  beaconCollectRadius: 3.4,
  walkSpeed: 16,
  boostSpeed: 30,
  jumpForce: 14,
  gravity: 34,
  cameraDistance: 9.5,
  cameraHeight: 3.2,
  mouseSensitivity: 0.0022,
};

// -----------------------------------------------------------------------------
// DOM Elements
// -----------------------------------------------------------------------------
const canvas = document.getElementById("game-canvas");
const overlay = document.getElementById("overlay");
const overlaySubtitle = document.getElementById("overlay-subtitle");
const playBtn = document.getElementById("play-btn");
const beaconCountEl = document.getElementById("beacon-count");
const coordsEl = document.getElementById("coords");
const speedDisplayEl = document.getElementById("speed-display");

// -----------------------------------------------------------------------------
// Scene, Camera & Renderer
// -----------------------------------------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0d1526);
scene.fog = new THREE.FogExp2(0x0d1526, 0.0055);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  450
);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

// -----------------------------------------------------------------------------
// Lighting & Sky
// -----------------------------------------------------------------------------
const hemiLight = new THREE.HemisphereLight(0x7dd3fc, 0x1e293b, 0.7);
scene.add(hemiLight);

const sunLight = new THREE.DirectionalLight(0xfff1d6, 1.8);
sunLight.position.set(80, 110, 60);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
sunLight.shadow.camera.near = 10;
sunLight.shadow.camera.far = 320;
const shadowExtent = 130;
sunLight.shadow.camera.left = -shadowExtent;
sunLight.shadow.camera.right = shadowExtent;
sunLight.shadow.camera.top = shadowExtent;
sunLight.shadow.camera.bottom = -shadowExtent;
sunLight.shadow.bias = -0.0005;
scene.add(sunLight);

function createStarfield() {
  const starCount = 900;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 0.85 + 0.15); // upper hemisphere
    const radius = 260;
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.cos(phi);
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xe2e8f0,
    size: 1.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.8,
  });
  scene.add(new THREE.Points(geometry, material));
}
createStarfield();

// -----------------------------------------------------------------------------
// Procedural Terrain
// -----------------------------------------------------------------------------
function getTerrainHeight(x, z) {
  const rollingHills =
    Math.sin(x * 0.025) * Math.cos(z * 0.025) * 5.5 +
    Math.sin(x * 0.06 + 1.2) * Math.sin(z * 0.05) * 2.2;
  const ridges = Math.cos((x + z) * 0.015) * 3.5;
  const detail = Math.sin(x * 0.14) * Math.cos(z * 0.14) * 0.45;
  return rollingHills + ridges + detail;
}

function createTerrain() {
  const geo = new THREE.PlaneGeometry(
    CONFIG.worldSize,
    CONFIG.worldSize,
    CONFIG.terrainSegments,
    CONFIG.terrainSegments
  );
  geo.rotateX(-Math.PI / 2);

  const posAttr = geo.attributes.position;
  const colors = new Float32Array(posAttr.count * 3);
  const color = new THREE.Color();

  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const z = posAttr.getZ(i);
    const y = getTerrainHeight(x, z);
    posAttr.setY(i, y);

    // Elevation-based biome tinting
    if (y < -2.5) {
      color.setHex(0x1e293b); // dark basalt basin
    } else if (y < 2.5) {
      color.setHex(0x28384d); // slate plains
    } else if (y < 6.0) {
      color.setHex(0x334155); // highland stone
    } else {
      color.setHex(0x475569); // ridge peaks
    }

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.computeVertexNormals();

  const mat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.9,
    metalness: 0.08,
    flatShading: true,
  });

  const terrain = new THREE.Mesh(geo, mat);
  terrain.receiveShadow = true;
  scene.add(terrain);
}
createTerrain();

// -----------------------------------------------------------------------------
// Environment Props (Rocks & Monoliths)
// -----------------------------------------------------------------------------
const obstacles = [];

function createEnvironment() {
  const rockGeo = new THREE.DodecahedronGeometry(1, 0);
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x3b495e,
    roughness: 0.85,
    flatShading: true,
  });

  const monolithGeo = new THREE.BoxGeometry(1, 1, 1);
  const monolithMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.4,
    metalness: 0.5,
  });

  const halfWorld = CONFIG.worldSize * 0.44;

  // Deterministic pseudo-random helper so world layout stays consistent
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 140; i++) {
    const x = (rand() * 2 - 1) * halfWorld;
    const z = (rand() * 2 - 1) * halfWorld;

    // Keep spawn area clear
    if (Math.hypot(x, z) < 14) continue;

    const y = getTerrainHeight(x, z);
    const scale = 0.8 + rand() * 2.6;

    const rock = new THREE.Mesh(rockGeo, rockMat);
    rock.position.set(x, y + scale * 0.35, z);
    rock.scale.set(scale, scale * (0.7 + rand() * 0.5), scale);
    rock.rotation.set(rand() * Math.PI, rand() * Math.PI, 0);
    rock.castShadow = true;
    rock.receiveShadow = true;
    scene.add(rock);

    obstacles.push({ x, z, radius: scale * 0.85 });
  }

  for (let i = 0; i < 24; i++) {
    const x = (rand() * 2 - 1) * halfWorld;
    const z = (rand() * 2 - 1) * halfWorld;
    if (Math.hypot(x, z) < 18) continue;

    const y = getTerrainHeight(x, z);
    const height = 5 + rand() * 10;
    const width = 1.2 + rand() * 1.4;

    const monolith = new THREE.Mesh(monolithGeo, monolithMat);
    monolith.position.set(x, y + height * 0.45, z);
    monolith.scale.set(width, height, width);
    monolith.rotation.y = rand() * Math.PI;
    monolith.castShadow = true;
    monolith.receiveShadow = true;
    scene.add(monolith);

    obstacles.push({ x, z, radius: width * 0.75 });
  }
}
createEnvironment();

// -----------------------------------------------------------------------------
// Collectibles (Energy Beacons)
// -----------------------------------------------------------------------------
const beacons = [];
let collectedBeacons = 0;

function createBeacons() {
  const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
  const ringGeo = new THREE.TorusGeometry(1.35, 0.08, 8, 28);
  const beamGeo = new THREE.CylinderGeometry(0.18, 0.45, 45, 12, 1, true);

  for (let i = 0; i < CONFIG.beaconCount; i++) {
    const angle = (i / CONFIG.beaconCount) * Math.PI * 2 + 0.35;
    const dist = 48 + (i % 3) * 38;
    const x = Math.cos(angle) * dist;
    const z = Math.sin(angle) * dist;
    const y = getTerrainHeight(x, z);

    const group = new THREE.Group();
    group.position.set(x, y + 2.2, z);

    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 1.4,
      roughness: 0.2,
      metalness: 0.3,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    core.castShadow = true;
    group.add(core);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xbae6fd,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.8,
      roughness: 0.3,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(ring);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.16,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 22.5;
    group.add(beam);

    scene.add(group);
    beacons.push({
      group,
      core,
      ring,
      beam,
      baseY: y + 2.2,
      x,
      z,
      collected: false,
    });
  }
}
createBeacons();

// -----------------------------------------------------------------------------
// Player Explorer Craft
// -----------------------------------------------------------------------------
const playerGroup = new THREE.Group();
const startY = getTerrainHeight(0, 0) + 1;
playerGroup.position.set(0, startY, 0);
scene.add(playerGroup);

function createPlayerModel() {
  const bodyGeo = new THREE.ConeGeometry(0.75, 2.2, 6);
  bodyGeo.rotateX(Math.PI / 2);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    roughness: 0.35,
    metalness: 0.6,
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  playerGroup.add(body);

  const canopyGeo = new THREE.SphereGeometry(0.42, 16, 12);
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: 0x0369a1,
    emissiveIntensity: 0.7,
    roughness: 0.15,
    metalness: 0.8,
  });
  const canopy = new THREE.Mesh(canopyGeo, canopyMat);
  canopy.position.set(0, 0.35, -0.15);
  canopy.scale.set(1, 0.7, 1.3);
  playerGroup.add(canopy);

  const thrusterGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.25, 10);
  thrusterGeo.rotateX(Math.PI / 2);
  const thrusterMat = new THREE.MeshBasicMaterial({ color: 0x7dd3fc });
  const thruster = new THREE.Mesh(thrusterGeo, thrusterMat);
  thruster.position.set(0, 0, 1.15);
  playerGroup.add(thruster);
}
createPlayerModel();

// -----------------------------------------------------------------------------
// Input & Pointer Lock State
// -----------------------------------------------------------------------------
const keys = new Set();
let isPlaying = false;
let yaw = 0;
let pitch = 0.28;

const playerState = {
  velocity: new THREE.Vector3(),
  grounded: false,
  hoverOffset: 1.0,
};

playBtn.addEventListener("click", () => {
  canvas.requestPointerLock();
});

document.addEventListener("pointerlockchange", () => {
  isPlaying = document.pointerLockElement === canvas;
  overlay.classList.toggle("hidden", isPlaying);
  if (!isPlaying && collectedBeacons < CONFIG.beaconCount) {
    playBtn.textContent = "Resume Exploration";
  }
});

document.addEventListener("mousemove", (e) => {
  if (!isPlaying) return;
  yaw -= e.movementX * CONFIG.mouseSensitivity;
  pitch += e.movementY * CONFIG.mouseSensitivity;
  pitch = THREE.MathUtils.clamp(pitch, -0.25, 1.15);
});

window.addEventListener("keydown", (e) => {
  keys.add(e.code);
});

window.addEventListener("keyup", (e) => {
  keys.delete(e.code);
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// -----------------------------------------------------------------------------
// Game Loop & Physics
// -----------------------------------------------------------------------------
const clock = new THREE.Clock();
const forwardVec = new THREE.Vector3();
const rightVec = new THREE.Vector3();
const moveDir = new THREE.Vector3();
const camTarget = new THREE.Vector3();

function updatePlayer(dt, elapsed) {
  // Movement input relative to camera yaw
  forwardVec.set(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
  rightVec.set(Math.cos(yaw), 0, -Math.sin(yaw)).normalize();

  moveDir.set(0, 0, 0);
  if (keys.has("KeyW") || keys.has("ArrowUp")) moveDir.add(forwardVec);
  if (keys.has("KeyS") || keys.has("ArrowDown")) moveDir.sub(forwardVec);
  if (keys.has("KeyD") || keys.has("ArrowRight")) moveDir.add(rightVec);
  if (keys.has("KeyA") || keys.has("ArrowLeft")) moveDir.sub(rightVec);

  const isMoving = moveDir.lengthSq() > 0;
  if (isMoving) moveDir.normalize();

  const isBoosting = keys.has("ShiftLeft") || keys.has("ShiftRight");
  const targetSpeed = isBoosting ? CONFIG.boostSpeed : CONFIG.walkSpeed;

  // Smooth horizontal acceleration / damping
  const accel = playerState.grounded ? 12 : 4.5;
  const targetVx = isMoving ? moveDir.x * targetSpeed : 0;
  const targetVz = isMoving ? moveDir.z * targetSpeed : 0;
  playerState.velocity.x = THREE.MathUtils.lerp(
    playerState.velocity.x,
    targetVx,
    1 - Math.exp(-accel * dt)
  );
  playerState.velocity.z = THREE.MathUtils.lerp(
    playerState.velocity.z,
    targetVz,
    1 - Math.exp(-accel * dt)
  );

  // Jump
  if (keys.has("Space") && playerState.grounded) {
    playerState.velocity.y = CONFIG.jumpForce;
    playerState.grounded = false;
  }

  // Gravity
  playerState.velocity.y -= CONFIG.gravity * dt;

  // Apply velocity
  playerGroup.position.x += playerState.velocity.x * dt;
  playerGroup.position.z += playerState.velocity.z * dt;
  playerGroup.position.y += playerState.velocity.y * dt;

  // World bounds clamp
  const worldLimit = CONFIG.worldSize * 0.48;
  playerGroup.position.x = THREE.MathUtils.clamp(
    playerGroup.position.x,
    -worldLimit,
    worldLimit
  );
  playerGroup.position.z = THREE.MathUtils.clamp(
    playerGroup.position.z,
    -worldLimit,
    worldLimit
  );

  // Simple cylindrical obstacle push-out
  for (const obs of obstacles) {
    const dx = playerGroup.position.x - obs.x;
    const dz = playerGroup.position.z - obs.z;
    const dist = Math.hypot(dx, dz);
    const minDist = obs.radius + 0.9;
    if (dist < minDist && dist > 0.0001) {
      const push = (minDist - dist) / dist;
      playerGroup.position.x += dx * push;
      playerGroup.position.z += dz * push;
    }
  }

  // Ground collision with subtle hover bob
  const groundY = getTerrainHeight(
    playerGroup.position.x,
    playerGroup.position.z
  );
  const hoverBob = Math.sin(elapsed * 3.5) * 0.08;
  const minPlayerY = groundY + playerState.hoverOffset + hoverBob;

  if (playerGroup.position.y <= minPlayerY) {
    playerGroup.position.y = minPlayerY;
    playerState.velocity.y = 0;
    playerState.grounded = true;
  } else {
    playerState.grounded = false;
  }

  // Rotate craft toward movement direction
  if (isMoving) {
    const targetRotY = Math.atan2(-moveDir.x, -moveDir.z);
    let diff = targetRotY - playerGroup.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    playerGroup.rotation.y += diff * (1 - Math.exp(-10 * dt));
  }
}

function updateCamera() {
  const horizontalDist = CONFIG.cameraDistance * Math.cos(pitch);
  const verticalDist =
    CONFIG.cameraDistance * Math.sin(pitch) + CONFIG.cameraHeight;

  const camX = playerGroup.position.x + Math.sin(yaw) * horizontalDist;
  const camZ = playerGroup.position.z + Math.cos(yaw) * horizontalDist;
  let camY = playerGroup.position.y + verticalDist;

  // Prevent camera from clipping below terrain
  const terrainAtCam = getTerrainHeight(camX, camZ);
  camY = Math.max(camY, terrainAtCam + 1.2);

  camera.position.set(camX, camY, camZ);
  camTarget.set(
    playerGroup.position.x,
    playerGroup.position.y + 1.1,
    playerGroup.position.z
  );
  camera.lookAt(camTarget);
}

function updateBeacons(dt, elapsed) {
  for (const beacon of beacons) {
    beacon.core.rotation.y += dt * 1.4;
    beacon.ring.rotation.x += dt * 0.9;
    beacon.ring.rotation.y -= dt * 1.1;
    beacon.group.position.y = beacon.baseY + Math.sin(elapsed * 2 + beacon.x) * 0.35;

    if (!beacon.collected) {
      const dist = Math.hypot(
        playerGroup.position.x - beacon.x,
        playerGroup.position.z - beacon.z
      );
      if (dist < CONFIG.beaconCollectRadius) {
        beacon.collected = true;
        collectedBeacons++;

        beacon.core.material.color.setHex(0x34d399);
        beacon.core.material.emissive.setHex(0x059669);
        beacon.ring.material.color.setHex(0x6ee7b7);
        beacon.ring.material.emissive.setHex(0x10b981);
        beacon.beam.material.color.setHex(0x34d399);
        beacon.beam.material.opacity = 0.05;

        beaconCountEl.textContent = `Beacons: ${collectedBeacons} / ${CONFIG.beaconCount}`;

        if (collectedBeacons === CONFIG.beaconCount) {
          overlaySubtitle.textContent =
            "All 8 energy beacons activated! You may continue exploring.";
          playBtn.textContent = "Keep Exploring";
        }
      }
    }
  }
}

function updateHUD() {
  const speed = Math.hypot(playerState.velocity.x, playerState.velocity.z);
  speedDisplayEl.textContent = `${speed.toFixed(1)} m/s`;
  coordsEl.textContent = `${Math.round(playerGroup.position.x)}, ${Math.round(
    playerGroup.position.z
  )}`;
}

function animate() {
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  const elapsed = clock.elapsedTime;

  if (isPlaying) {
    updatePlayer(dt, elapsed);
    updateBeacons(dt, elapsed);
    updateHUD();
  }

  updateCamera();
  renderer.render(scene, camera);
}

animate();
