import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CurrentOutfit } from '../types/costume';
import { RotateCw, Sun, Moon, Flame, Sparkles, Flower2, Volume2, VolumeX, Heart, Fan, User } from 'lucide-react';

interface ThreeCanvasProps {
  outfit: CurrentOutfit;
  lightingPreset: 'studio' | 'hoian' | 'hue' | 'cyber';
  onLightingChange: (preset: 'studio' | 'hoian' | 'hue' | 'cyber') => void;
  cameraView: 'full' | 'torso' | 'head';
  onCameraViewChange: (view: 'full' | 'torso' | 'head') => void;
}

type PoseType = 'runway' | 'fan' | 'peace' | 'traditional';

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  outfit,
  lightingPreset,
  onLightingChange,
  cameraView,
  onCameraViewChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(false);
  const [activePose, setActivePose] = useState<PoseType>('runway');
  const [showPetals, setShowPetals] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);

  // Body and Limbs references for smooth pose interpolation & animation
  const headGroupRef = useRef<THREE.Group | null>(null);
  const chestGroupRef = useRef<THREE.Group | null>(null);
  const eyeLeftRef = useRef<THREE.Group | null>(null);
  const eyeRightRef = useRef<THREE.Group | null>(null);
  const leftArmGroupRef = useRef<THREE.Group | null>(null);
  const rightArmGroupRef = useRef<THREE.Group | null>(null);
  const fanMeshRef = useRef<THREE.Mesh | null>(null);
  const petalsGroupRef = useRef<THREE.Group | null>(null);

  // Pose target state tracking for smooth lerp
  const currentPoseRef = useRef<PoseType>('runway');
  useEffect(() => {
    currentPoseRef.current = activePose;
    if (soundEnabled) playChimeSound();
  }, [activePose]);

  // Real-time cloth wave mesh references
  const frontFlapDataRef = useRef<{
    mesh: THREE.Mesh;
    pos: THREE.BufferAttribute;
    origX: Float32Array;
    origZ: Float32Array;
    count: number;
    length: number;
  } | null>(null);

  const backFlapDataRef = useRef<{
    mesh: THREE.Mesh;
    pos: THREE.BufferAttribute;
    origX: Float32Array;
    origZ: Float32Array;
    count: number;
    length: number;
  } | null>(null);

  const lightsRef = useRef<{
    ambient: THREE.AmbientLight;
    keyLight: THREE.DirectionalLight;
    fillLight: THREE.PointLight;
    rimLight: THREE.DirectionalLight;
  } | null>(null);

  // Mouse tracking for subtle eye look-at
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Web Audio Synthesizer: Play delicate chime/swoosh on outfit or pose switch
  const audioCtxRef = useRef<AudioContext | null>(null);
  const playChimeSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const now = ctx.currentTime;
      // Pentatonic chime note (F#5, A5, B5, C#6)
      const freqs = [739.99, 880.0, 987.77, 1108.73];
      const freq = freqs[Math.floor(Math.random() * freqs.length)];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.35);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Ignore audio context errors if blocked by browser policy
    }
  };

  // Play sound when outfit changes
  useEffect(() => {
    if (soundEnabled) {
      playChimeSound();
    }
  }, [outfit, soundEnabled]);

  // Create high quality procedural fabric texture
  const createPatternTexture = (patternId: string, baseColorHex: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Rich base color
    ctx.fillStyle = baseColorHex;
    ctx.fillRect(0, 0, 512, 512);

    // Luxury silk weave grain
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 512; i += 4) {
      ctx.fillRect(i, 0, 2, 512);
      ctx.fillRect(0, i, 512, 2);
    }

    if (patternId === 'van_may') {
      ctx.strokeStyle = 'rgba(255, 235, 170, 0.38)';
      ctx.lineWidth = 3;
      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          const cx = i * 64 + 32;
          const cy = j * 64 + 32;
          ctx.beginPath();
          ctx.arc(cx, cy, 18, 0, Math.PI, true);
          ctx.arc(cx + 8, cy, 12, 0, Math.PI, true);
          ctx.stroke();
        }
      }
    } else if (patternId === 'hoa_sen') {
      ctx.fillStyle = 'rgba(255, 215, 235, 0.32)';
      for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
          const cx = i * 85 + 40;
          const cy = j * 85 + 40;
          ctx.beginPath();
          ctx.ellipse(cx, cy, 14, 22, Math.PI / 4, 0, Math.PI * 2);
          ctx.ellipse(cx, cy, 14, 22, -Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else if (patternId === 'rong_phuong') {
      ctx.strokeStyle = 'rgba(255, 225, 90, 0.45)';
      ctx.lineWidth = 2.5;
      for (let i = 0; i < 512; i += 32) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + 32, 512);
        ctx.stroke();
      }
    } else if (patternId === 'trong_dong') {
      ctx.strokeStyle = 'rgba(255, 225, 150, 0.35)';
      ctx.lineWidth = 2;
      for (let r = 25; r < 240; r += 38) {
        ctx.beginPath();
        ctx.arc(256, 256, r, 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (patternId === 'cyber_grid') {
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
      ctx.lineWidth = 1.4;
      for (let x = 0; x < 512; x += 28) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
        ctx.moveTo(0, x);
        ctx.lineTo(512, x);
        ctx.stroke();
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 3);
    return texture;
  };

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 1.15, 3.2);
    camera.lookAt(0, 1.05, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mount.appendChild(renderer.domElement);

    // Warm Soft Studio Lighting for Pixar / Stylized Clay 3D
    const ambient = new THREE.AmbientLight(0xfff7ed, 1.9);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfffaec, 2.8);
    keyLight.position.set(2.5, 4.2, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xffeedd, 1.8, 12);
    fillLight.position.set(-2.5, 2.5, 2.5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xffd57e, 2.4);
    rimLight.position.set(0, 3, -3.5);
    scene.add(rimLight);

    lightsRef.current = { ambient, keyLight, fillLight, rimLight };

    // Pedestal Stage with Golden Rim & Soft Shadow
    const stageGroup = new THREE.Group();
    const pedestalGeo = new THREE.CylinderGeometry(1.15, 1.25, 0.08, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x141824,
      roughness: 0.35,
      metalness: 0.5,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.04;
    pedestal.receiveShadow = true;
    stageGroup.add(pedestal);

    const ringGeo = new THREE.RingGeometry(1.05, 1.14, 48);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      roughness: 0.2,
      metalness: 0.9,
      side: THREE.DoubleSide,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.005;
    stageGroup.add(ring);
    scene.add(stageGroup);

    // Falling Lotus Petals Particle System (Atmosphere)
    const petalsGroup = new THREE.Group();
    const petalCount = 36;
    const petalMeshes: Array<{
      mesh: THREE.Mesh;
      baseSpeed: number;
      rotSpeedX: number;
      rotSpeedY: number;
      seed: number;
    }> = [];

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffb7c5,
      roughness: 0.4,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    for (let i = 0; i < petalCount; i++) {
      const pGeo = new THREE.SphereGeometry(0.032, 12, 12);
      pGeo.scale(1.2, 0.3, 1.8);
      const pMesh = new THREE.Mesh(pGeo, petalMat);
      pMesh.position.set(
        (Math.random() - 0.5) * 3.2,
        Math.random() * 2.5 + 0.2,
        (Math.random() - 0.5) * 2.5
      );
      pMesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      petalsGroup.add(pMesh);
      petalMeshes.push({
        mesh: pMesh,
        baseSpeed: 0.003 + Math.random() * 0.004,
        rotSpeedX: (Math.random() - 0.5) * 0.03,
        rotSpeedY: (Math.random() - 0.5) * 0.03,
        seed: Math.random() * 100,
      });
    }
    scene.add(petalsGroup);
    petalsGroupRef.current = petalsGroup;

    // Character Group
    const characterGroup = new THREE.Group();
    characterGroup.position.set(0, 0, 0);
    characterGroup.rotation.y = 0;
    scene.add(characterGroup);
    characterGroupRef.current = characterGroup;

    // Smooth Pose Interpolation State (Current Angles)
    const poseState = {
      lArmX: 0, lArmY: 0, lArmZ: 0,
      rArmX: 0, rArmY: 0, rArmZ: 0,
      headX: 0, headY: 0, headZ: 0,
      bodyRotZ: 0, bodyPosY: 0,
    };

    // Render & Organic Life-Like Idle Animation
    let animationFrameId: number;
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // 1. Auto rotate if enabled
      if (isAutoRotate && !isDragging && characterGroupRef.current) {
        characterGroupRef.current.rotation.y += 0.005;
      }

      // 2. Pose Interpolation Targets
      const target = {
        lArmX: 0, lArmY: 0, lArmZ: 0,
        rArmX: 0, rArmY: 0, rArmZ: 0,
        headX: 0, headY: 0, headZ: 0,
        bodyRotZ: 0, bodyPosY: 0,
      };

      const pose = currentPoseRef.current;
      if (pose === 'runway') {
        // High Fashion: Left hand on hip, right arm chic & relaxed
        target.lArmX = -0.15;
        target.lArmY = 0.40;
        target.lArmZ = 0.62;
        target.rArmX = -0.10;
        target.rArmY = -0.15;
        target.rArmZ = -0.22;
        target.headY = 0.08;
        target.headZ = 0.04;
        target.bodyRotZ = 0.025;
      } else if (pose === 'fan') {
        // Holding fan gracefully in front of chest
        target.lArmX = 0.05;
        target.lArmY = 0.10;
        target.lArmZ = 0.18;
        target.rArmX = -0.72;
        target.rArmY = -0.32;
        target.rArmZ = -0.25;
        target.headY = -0.06;
        target.headX = -0.03;
      } else if (pose === 'peace') {
        // Gen Z Peace Sign / Finger Heart pose near face
        target.lArmX = -0.10;
        target.lArmY = 0.35;
        target.lArmZ = 0.50;
        target.rArmX = -1.35;
        target.rArmY = -0.25;
        target.rArmZ = -0.65;
        target.headZ = -0.12;
        target.headY = -0.08;
        target.bodyPosY = Math.sin(elapsed * 3.5) * 0.012; // Bouncy
      } else if (pose === 'traditional') {
        // Respectful greeting with clasped hands in front
        target.lArmX = -0.52;
        target.lArmY = 0.45;
        target.lArmZ = 0.32;
        target.rArmX = -0.52;
        target.rArmY = -0.45;
        target.rArmZ = -0.32;
        target.headX = 0.09; // Gentle respectful bow
      }

      // Smooth Lerp towards target pose
      const lerpSpeed = 0.07;
      poseState.lArmX = THREE.MathUtils.lerp(poseState.lArmX, target.lArmX, lerpSpeed);
      poseState.lArmY = THREE.MathUtils.lerp(poseState.lArmY, target.lArmY, lerpSpeed);
      poseState.lArmZ = THREE.MathUtils.lerp(poseState.lArmZ, target.lArmZ, lerpSpeed);
      poseState.rArmX = THREE.MathUtils.lerp(poseState.rArmX, target.rArmX, lerpSpeed);
      poseState.rArmY = THREE.MathUtils.lerp(poseState.rArmY, target.rArmY, lerpSpeed);
      poseState.rArmZ = THREE.MathUtils.lerp(poseState.rArmZ, target.rArmZ, lerpSpeed);
      poseState.headX = THREE.MathUtils.lerp(poseState.headX, target.headX, lerpSpeed);
      poseState.headY = THREE.MathUtils.lerp(poseState.headY, target.headY, lerpSpeed);
      poseState.headZ = THREE.MathUtils.lerp(poseState.headZ, target.headZ, lerpSpeed);
      poseState.bodyRotZ = THREE.MathUtils.lerp(poseState.bodyRotZ, target.bodyRotZ, lerpSpeed);
      poseState.bodyPosY = THREE.MathUtils.lerp(poseState.bodyPosY, target.bodyPosY, lerpSpeed);

      // Apply to Arms
      if (leftArmGroupRef.current) {
        leftArmGroupRef.current.rotation.x = poseState.lArmX + Math.sin(elapsed * 1.5) * 0.015;
        leftArmGroupRef.current.rotation.y = poseState.lArmY;
        leftArmGroupRef.current.rotation.z = poseState.lArmZ;
      }
      if (rightArmGroupRef.current) {
        rightArmGroupRef.current.rotation.x = poseState.rArmX + Math.sin(elapsed * 1.5 + 1) * 0.015;
        rightArmGroupRef.current.rotation.y = poseState.rArmY;
        rightArmGroupRef.current.rotation.z = poseState.rArmZ;
      }

      // 3. Gentle Breathing Motion (Chest & Body)
      if (characterGroupRef.current && !isDragging) {
        characterGroupRef.current.position.y = Math.sin(elapsed * 1.6) * 0.006 + poseState.bodyPosY;
        characterGroupRef.current.rotation.z = poseState.bodyRotZ;
      }

      if (chestGroupRef.current) {
        const breathScale = 1 + Math.sin(elapsed * 1.6) * 0.014;
        chestGroupRef.current.scale.set(breathScale, 1, breathScale);
      }

      // 4. Expressive Head Sway & Micro-Tilts
      if (headGroupRef.current) {
        headGroupRef.current.rotation.x = poseState.headX + Math.sin(elapsed * 1.4) * 0.02;
        headGroupRef.current.rotation.y = poseState.headY + Math.sin(elapsed * 0.8) * 0.04;
        headGroupRef.current.rotation.z = poseState.headZ + Math.cos(elapsed * 0.6) * 0.02;
      }

      // 5. Soulful Blinking & Mouse Eye Tracking
      const blinkCycle = elapsed % 3.6;
      const eyeScaleY = (blinkCycle > 3.42 && blinkCycle < 3.54) ? 0.08 : 1.0;
      const eyeLookX = (mousePosRef.current.x / window.innerWidth - 0.5) * 0.008;
      const eyeLookY = -(mousePosRef.current.y / window.innerHeight - 0.5) * 0.008;

      if (eyeLeftRef.current) {
        eyeLeftRef.current.scale.y = eyeScaleY;
        eyeLeftRef.current.position.x = -0.064 + eyeLookX;
        eyeLeftRef.current.position.y = 0.042 + eyeLookY;
      }
      if (eyeRightRef.current) {
        eyeRightRef.current.scale.y = eyeScaleY;
        eyeRightRef.current.position.x = 0.064 + eyeLookX;
        eyeRightRef.current.position.y = 0.042 + eyeLookY;
      }

      // 6. Fan Flutter Animation
      if (fanMeshRef.current) {
        if (pose === 'fan') {
          fanMeshRef.current.rotation.y = -Math.PI / 4 + Math.sin(elapsed * 4.2) * 0.28;
        } else {
          fanMeshRef.current.rotation.y = -Math.PI / 4 + Math.sin(elapsed * 2.2) * 0.05;
        }
      }

      // 7. REAL CLOTH SILK FLUTTER WAVE (Front Flap)
      if (frontFlapDataRef.current) {
        const { mesh, pos, origX, origZ, count, length } = frontFlapDataRef.current;
        for (let i = 0; i < count; i++) {
          const y = pos.getY(i);
          const factor = Math.max(0, -y / length);
          const waveZ = Math.sin(elapsed * 2.8 + y * 6.5) * (0.038 * factor * factor)
                      + Math.cos(elapsed * 4.2 + y * 4.5) * (0.014 * factor);
          const waveX = Math.sin(elapsed * 2.0 + y * 5.0) * (0.015 * factor * factor);
          pos.setZ(i, origZ[i] + waveZ);
          pos.setX(i, origX[i] + waveX);
        }
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }

      // 8. REAL CLOTH SILK FLUTTER WAVE (Back Flap)
      if (backFlapDataRef.current) {
        const { mesh, pos, origX, origZ, count, length } = backFlapDataRef.current;
        for (let i = 0; i < count; i++) {
          const y = pos.getY(i);
          const factor = Math.max(0, -y / length);
          const waveZ = Math.sin(elapsed * 2.8 + y * 6.5 + 1.4) * (0.034 * factor * factor)
                      + Math.cos(elapsed * 3.8 + y * 4.0) * (0.012 * factor);
          const waveX = Math.sin(elapsed * 1.8 + y * 4.8 + 0.8) * (0.014 * factor * factor);
          pos.setZ(i, origZ[i] - waveZ);
          pos.setX(i, origX[i] + waveX);
        }
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }

      // 9. Falling Lotus Petals Drift Animation
      if (petalsGroupRef.current) {
        petalsGroupRef.current.visible = showPetals;
        if (showPetals) {
          petalMeshes.forEach(p => {
            p.mesh.position.y -= p.baseSpeed;
            p.mesh.position.x += Math.sin(elapsed * 1.2 + p.seed) * 0.003;
            p.mesh.position.z += Math.cos(elapsed * 0.9 + p.seed) * 0.003;
            p.mesh.rotation.x += p.rotSpeedX;
            p.mesh.rotation.y += p.rotSpeedY;

            if (p.mesh.position.y < 0.02) {
              p.mesh.position.y = 2.4;
              p.mesh.position.x = (Math.random() - 0.5) * 3.0;
              p.mesh.position.z = (Math.random() - 0.5) * 2.2;
            }
          });
        }
      }

      renderer.render(scene, camera);
    };
    animate();

    // Mouse / Touch 360 Spin Controls
    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
      if (!isDragging || !characterGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      characterGroupRef.current.rotation.y += deltaX * 0.01;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging || !characterGroupRef.current || e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - previousMousePosition.x;
      characterGroupRef.current.rotation.y += deltaX * 0.01;
      previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    domElement.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      domElement.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [showPetals]);

  // LIGHTING PRESETS
  useEffect(() => {
    if (!lightsRef.current) return;
    const { ambient, keyLight, fillLight, rimLight } = lightsRef.current;

    switch (lightingPreset) {
      case 'hoian':
        ambient.color.setHex(0xffaa55);
        ambient.intensity = 1.4;
        keyLight.color.setHex(0xff9933);
        keyLight.intensity = 3.2;
        fillLight.color.setHex(0xff6622);
        fillLight.intensity = 2.4;
        rimLight.color.setHex(0xffd700);
        rimLight.intensity = 2.6;
        break;

      case 'hue':
        ambient.color.setHex(0xd6a2e8);
        ambient.intensity = 1.4;
        keyLight.color.setHex(0xe056fd);
        keyLight.intensity = 2.8;
        fillLight.color.setHex(0xeb4d4b);
        fillLight.intensity = 2.4;
        rimLight.color.setHex(0xffbe76);
        rimLight.intensity = 2.4;
        break;

      case 'cyber':
        ambient.color.setHex(0x1a1133);
        ambient.intensity = 1.1;
        keyLight.color.setHex(0x00f2fe);
        keyLight.intensity = 3.8;
        fillLight.color.setHex(0xff2a85);
        fillLight.intensity = 3.6;
        rimLight.color.setHex(0xb8ff00);
        rimLight.intensity = 3.2;
        break;

      case 'studio':
      default:
        ambient.color.setHex(0xfff7ed);
        ambient.intensity = 1.9;
        keyLight.color.setHex(0xfffaec);
        keyLight.intensity = 2.8;
        fillLight.color.setHex(0xffeedd);
        fillLight.intensity = 1.8;
        rimLight.color.setHex(0xffd57e);
        rimLight.intensity = 2.4;
        break;
    }
  }, [lightingPreset]);

  // CAMERA VIEWS
  useEffect(() => {
    if (!cameraRef.current) return;
    const camera = cameraRef.current;

    switch (cameraView) {
      case 'torso':
        camera.position.set(0, 1.25, 2.0);
        camera.lookAt(0, 1.20, 0);
        break;
      case 'head':
        camera.position.set(0, 1.58, 1.35);
        camera.lookAt(0, 1.55, 0);
        break;
      case 'full':
      default:
        camera.position.set(0, 1.15, 3.2);
        camera.lookAt(0, 1.05, 0);
        break;
    }
  }, [cameraView]);

  // REBUILD THE COHESIVE, GORGEOUS, SEAMLESS 3D MODEL
  useEffect(() => {
    if (!characterGroupRef.current) return;
    const group = characterGroupRef.current;

    // Clean previous meshes
    while (group.children.length > 0) {
      const child = group.children[0];
      group.remove(child);
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose();
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    }

    // ==========================================
    // 1. SOFT SHADING MATERIALS (Pixar / Clay Figurine)
    // ==========================================
    const skinMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4aa8b,
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.15,
      clearcoatRoughness: 0.32,
      sheen: 0.7,
      sheenColor: new THREE.Color(0xffb59e),
    });

    const blushMat = new THREE.MeshStandardMaterial({
      color: 0xf57562,
      roughness: 0.45,
      transparent: true,
      opacity: 0.42,
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xee9278,
      roughness: 0.38,
      metalness: 0.04,
    });

    const glossyEyeMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e14,
      roughness: 0.03,
      metalness: 0.12,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });

    const browMat = new THREE.MeshStandardMaterial({
      color: 0x221a18,
      roughness: 0.45,
    });

    const lipMat = new THREE.MeshStandardMaterial({
      color: 0xd96f57,
      roughness: 0.38,
    });

    // Dark rich clay pompadour hair material matching reference
    const hairMat = new THREE.MeshStandardMaterial({
      color: 0x221a18,
      roughness: 0.32,
      metalness: 0.08,
    });

    // ==========================================
    // 2. SEAMLESS HEAD & ADORABLE PIXAR / CLAY FACE
    // ==========================================
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.55, 0);
    headGroupRef.current = headGroup;

    // Smooth head sphere with soft rounded cheeks
    const headGeo = new THREE.SphereGeometry(0.156, 48, 48);
    headGeo.scale(1.05, 1.13, 1.03);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = true;
    headGroup.add(headMesh);

    // Warm Rosy Cheeks
    const lCheekGeo = new THREE.SphereGeometry(0.040, 20, 20);
    lCheekGeo.scale(1.25, 0.75, 0.45);
    const lCheek = new THREE.Mesh(lCheekGeo, blushMat);
    lCheek.position.set(-0.086, -0.024, 0.134);
    headGroup.add(lCheek);

    const rCheek = new THREE.Mesh(lCheekGeo, blushMat);
    rCheek.position.set(0.086, -0.024, 0.134);
    headGroup.add(rCheek);

    // Cute Soft Button Nose (matching reference horizontal pebble)
    const noseGeo = new THREE.SphereGeometry(0.028, 24, 24);
    noseGeo.scale(1.22, 0.92, 1.05);
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, -0.010, 0.156);
    headGroup.add(nose);

    // Big Glossy Pixar Button Eyes with Reflection Sparkles
    const createEye = (xPos: number, isRight: boolean) => {
      const eyeSubGroup = new THREE.Group();
      eyeSubGroup.position.set(xPos, 0.042, 0.138);

      const eyeBallGeo = new THREE.SphereGeometry(0.026, 28, 28);
      eyeBallGeo.scale(0.95, 1.30, 0.85);
      const eyeBall = new THREE.Mesh(eyeBallGeo, glossyEyeMat);
      eyeSubGroup.add(eyeBall);

      // Primary top-right glossy highlight
      const hiBigGeo = new THREE.SphereGeometry(0.009, 14, 14);
      const hiBig = new THREE.Mesh(hiBigGeo, eyeHighlightMat);
      hiBig.position.set(0.008, 0.013, 0.021);
      eyeSubGroup.add(hiBig);

      // Secondary bottom-left subtle reflection
      const hiSmallGeo = new THREE.SphereGeometry(0.0045, 10, 10);
      const hiSmall = new THREE.Mesh(hiSmallGeo, eyeHighlightMat);
      hiSmall.position.set(-0.007, -0.010, 0.019);
      eyeSubGroup.add(hiSmall);

      if (isRight) {
        eyeRightRef.current = eyeSubGroup;
      } else {
        eyeLeftRef.current = eyeSubGroup;
      }

      return eyeSubGroup;
    };

    headGroup.add(createEye(-0.064, false));
    headGroup.add(createEye(0.064, true));

    // Curved Rounded Eyebrows
    const createEyebrow = (xPos: number, isRight: boolean) => {
      const browGeo = new THREE.CylinderGeometry(0.0085, 0.0065, 0.048, 20);
      browGeo.rotateZ(isRight ? -Math.PI / 11 : Math.PI / 11);
      const brow = new THREE.Mesh(browGeo, browMat);
      brow.position.set(xPos, 0.110, 0.136);
      brow.rotation.x = 0.22;
      return brow;
    };
    headGroup.add(createEyebrow(-0.068, false));
    headGroup.add(createEyebrow(0.068, true));

    // Sweet Charming Curved Smile Line
    const mouthGeo = new THREE.TorusGeometry(0.036, 0.0045, 12, 32, Math.PI * 0.72);
    const mouth = new THREE.Mesh(mouthGeo, lipMat);
    mouth.rotation.x = Math.PI / 1.72;
    mouth.rotation.z = Math.PI * 1.14;
    mouth.position.set(0, -0.066, 0.137);
    headGroup.add(mouth);

    // Adorable Cartoon Ears with Cavity
    const createEar = (xPos: number, isRight: boolean) => {
      const earSub = new THREE.Group();
      earSub.position.set(xPos, 0.012, 0);
      earSub.rotation.y = isRight ? 0.32 : -0.32;

      const earRimGeo = new THREE.TorusGeometry(0.036, 0.012, 16, 24, Math.PI * 1.25);
      const earRim = new THREE.Mesh(earRimGeo, skinMat);
      earSub.add(earRim);

      const earLobeGeo = new THREE.SphereGeometry(0.024, 20, 20);
      earLobeGeo.scale(0.85, 1.15, 0.5);
      const earLobe = new THREE.Mesh(earLobeGeo, skinMat);
      earLobe.position.set(0, 0, -0.006);
      earSub.add(earLobe);

      return earSub;
    };
    headGroup.add(createEar(-0.162, false));
    headGroup.add(createEar(0.162, true));

    // ========================================================
    // SCULPTED CLAY POMPADOUR HAIR (Matching User Reference Image)
    // ========================================================
    const hairGroup = new THREE.Group();

    // Base Skull Cap
    const hairCapGeo = new THREE.SphereGeometry(0.165, 40, 40);
    hairCapGeo.scale(1.03, 1.15, 1.05);
    const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
    hairCap.position.set(0, 0.045, -0.02);
    hairGroup.add(hairCap);

    // Central Sweeping Pompadour Crest Lock (Front Forehead Curl)
    const crestGeo = new THREE.TorusGeometry(0.082, 0.038, 16, 28, Math.PI * 0.78);
    const crest = new THREE.Mesh(crestGeo, hairMat);
    crest.rotation.y = -Math.PI / 2;
    crest.rotation.z = 0.45;
    crest.position.set(0, 0.175, 0.08);
    crest.scale.set(1.2, 1.0, 1.3);
    hairGroup.add(crest);

    // Front-Right Sweeping Wave Lock
    const rWaveGeo = new THREE.TorusGeometry(0.068, 0.032, 16, 24, Math.PI * 0.65);
    const rWave = new THREE.Mesh(rWaveGeo, hairMat);
    rWave.rotation.y = -Math.PI / 1.7;
    rWave.rotation.z = 0.35;
    rWave.position.set(0.065, 0.16, 0.07);
    hairGroup.add(rWave);

    // Front-Left Sweeping Wave Lock
    const lWaveGeo = new THREE.TorusGeometry(0.068, 0.032, 16, 24, Math.PI * 0.65);
    const lWave = new THREE.Mesh(lWaveGeo, hairMat);
    lWave.rotation.y = -Math.PI / 2.3;
    lWave.rotation.z = -0.35;
    lWave.position.set(-0.065, 0.16, 0.07);
    hairGroup.add(lWave);

    // Top Volume Crown Ridge
    const topVolGeo = new THREE.SphereGeometry(0.095, 24, 24);
    topVolGeo.scale(1.35, 0.82, 1.25);
    const topVol = new THREE.Mesh(topVolGeo, hairMat);
    topVol.position.set(0, 0.198, 0.015);
    hairGroup.add(topVol);

    // Stylish Curved Sideburns (framing cheeks)
    const createSideburn = (xPos: number, isRight: boolean) => {
      const sbGeo = new THREE.CylinderGeometry(0.018, 0.008, 0.09, 16);
      const sb = new THREE.Mesh(sbGeo, hairMat);
      sb.position.set(xPos, 0.04, 0.10);
      sb.rotation.z = isRight ? -0.25 : 0.25;
      return sb;
    };
    hairGroup.add(createSideburn(-0.145, false));
    hairGroup.add(createSideburn(0.145, true));

    headGroup.add(hairGroup);
    group.add(headGroup);

    // Tapered Smooth Slender Neck
    const neckGeo = new THREE.CylinderGeometry(0.045, 0.054, 0.16, 32);
    const neckMesh = new THREE.Mesh(neckGeo, skinMat);
    neckMesh.position.set(0, 1.40, 0);
    group.add(neckMesh);

    // ==========================================
    // 3. SEAMLESS DRAPED COSTUME & CONTINUOUS LIMBS
    // ==========================================
    const mainTexture = createPatternTexture(outfit.pattern, outfit.mainColor);

    const garmentMat = new THREE.MeshPhysicalMaterial({
      map: mainTexture,
      roughness: 0.32,
      metalness: 0.14,
      clearcoat: 0.30,
      clearcoatRoughness: 0.28,
      sheen: 0.75,
      sheenColor: new THREE.Color(outfit.mainColor).lerp(new THREE.Color(0xffffff), 0.3),
      side: THREE.DoubleSide,
    });

    const isLeftVat = outfit.vatStyle === 'left';
    const vatSign = isLeftVat ? -1 : 1;

    // 3.1 Form-Fitting Bodice (Chest to Waist & Hips)
    const bodiceGroup = new THREE.Group();
    bodiceGroup.position.set(0, 1.12, 0);
    chestGroupRef.current = bodiceGroup;

    // Torso upper (chest & shoulders)
    const torsoUpperGeo = new THREE.CylinderGeometry(0.136, 0.116, 0.26, 36);
    const torsoUpper = new THREE.Mesh(torsoUpperGeo, garmentMat);
    torsoUpper.position.y = 0.13;
    bodiceGroup.add(torsoUpper);

    // Torso lower (slender waist to hips)
    const torsoLowerGeo = new THREE.CylinderGeometry(0.116, 0.136, 0.24, 36);
    const torsoLower = new THREE.Mesh(torsoLowerGeo, garmentMat);
    torsoLower.position.y = -0.12;
    bodiceGroup.add(torsoLower);

    group.add(bodiceGroup);

    // 3.2 Standing Collar (Cổ Lập Lĩnh)
    const collarGroup = new THREE.Group();
    collarGroup.position.set(0, 1.39, 0);

    const standCollarGeo = new THREE.CylinderGeometry(0.056, 0.060, 0.058, 36);
    const standCollar = new THREE.Mesh(standCollarGeo, garmentMat);
    collarGroup.add(standCollar);

    const goldTrimGeo = new THREE.TorusGeometry(0.057, 0.004, 12, 36);
    const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.15 });
    const goldTrim = new THREE.Mesh(goldTrimGeo, goldTrimMat);
    goldTrim.rotation.x = Math.PI / 2;
    goldTrim.position.y = 0.024;
    collarGroup.add(goldTrim);

    // For Áo Nhật Bình: Elegant flat embroidery panel flush against the chest
    if (outfit.mainTop.meshType === 'nhat_binh') {
      const nbPanelGeo = new THREE.PlaneGeometry(0.16, 0.28);
      const nbPanelMat = new THREE.MeshStandardMaterial({
        color: 0xd4af37,
        roughness: 0.25,
        metalness: 0.75,
        side: THREE.DoubleSide,
      });
      const nbPanel = new THREE.Mesh(nbPanelGeo, nbPanelMat);
      nbPanel.position.set(0, -0.15, 0.138);
      collarGroup.add(nbPanel);

      const nbTrimGeo = new THREE.PlaneGeometry(0.18, 0.035);
      const nbTrimMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x0f5257,
        side: THREE.DoubleSide,
      });
      const nbTrim = new THREE.Mesh(nbTrimGeo, nbTrimMat);
      nbTrim.position.set(0, -0.01, 0.140);
      collarGroup.add(nbTrim);
    } else if (outfit.mainTop.meshType === 'giao_linh') {
      const glGeo = new THREE.TorusGeometry(0.10, 0.02, 16, 32, Math.PI * 1.1);
      const glMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.6 });
      const glMesh = new THREE.Mesh(glGeo, glMat);
      glMesh.rotation.z = vatSign * -Math.PI / 4.5;
      glMesh.position.set(0, 0, 0.10);
      collarGroup.add(glMesh);
    }

    // 5 Cúc Ngũ Thường
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0xf5cd79,
      metalness: 0.95,
      roughness: 0.12,
    });

    const buttonPipingGeo = new THREE.CylinderGeometry(0.0035, 0.0035, 0.26, 16);
    const buttonPiping = new THREE.Mesh(buttonPipingGeo, buttonMat);
    buttonPiping.position.set(vatSign * 0.060, -0.13, 0.132);
    buttonPiping.rotation.z = vatSign * -0.55;
    collarGroup.add(buttonPiping);

    for (let i = 0; i < 5; i++) {
      const btnGeo = new THREE.SphereGeometry(0.010, 18, 18);
      const btn = new THREE.Mesh(btnGeo, buttonMat);
      btn.position.set(
        vatSign * (0.012 + i * 0.024),
        -0.025 - i * 0.050,
        0.136 - i * 0.006
      );
      collarGroup.add(btn);
    }

    group.add(collarGroup);

    // 3.3 CONTINUOUS, CONNECTED SLEEVES
    const createConnectedArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const xSign = isRight ? 1 : -1;
      armGroup.position.set(xSign * 0.155, 1.28, 0.01);

      // Shoulder cap
      const shoulderGeo = new THREE.SphereGeometry(0.046, 24, 24);
      const shoulder = new THREE.Mesh(shoulderGeo, garmentMat);
      armGroup.add(shoulder);

      if (outfit.mainTop.meshType === 'ao_tac') {
        const tacGeo = new THREE.CylinderGeometry(0.07, 0.18, 0.52, 32);
        const tacMesh = new THREE.Mesh(tacGeo, garmentMat);
        tacMesh.position.set(xSign * 0.07, -0.24, 0.03);
        tacMesh.rotation.z = xSign * -0.20;
        armGroup.add(tacMesh);
      } else {
        const upperSleeveGeo = new THREE.CylinderGeometry(0.045, 0.038, 0.26, 24);
        const upperSleeve = new THREE.Mesh(upperSleeveGeo, garmentMat);
        upperSleeve.position.set(xSign * 0.025, -0.12, 0);
        upperSleeve.rotation.z = xSign * -0.16;
        armGroup.add(upperSleeve);

        const elbowGeo = new THREE.SphereGeometry(0.038, 20, 20);
        const elbow = new THREE.Mesh(elbowGeo, garmentMat);
        elbow.position.set(xSign * 0.05, -0.24, 0.02);
        armGroup.add(elbow);

        const lowerSleeveGeo = new THREE.CylinderGeometry(0.038, 0.032, 0.24, 24);
        const lowerSleeve = new THREE.Mesh(lowerSleeveGeo, garmentMat);
        lowerSleeve.position.set(xSign * 0.08, -0.36, 0.04);
        lowerSleeve.rotation.z = xSign * -0.12;
        lowerSleeve.rotation.x = -0.15;
        armGroup.add(lowerSleeve);

        const cuffGeo = new THREE.TorusGeometry(0.033, 0.004, 10, 24);
        const cuff = new THREE.Mesh(cuffGeo, goldTrimMat);
        cuff.position.set(xSign * 0.10, -0.47, 0.06);
        cuff.rotation.x = Math.PI / 2;
        armGroup.add(cuff);
      }

      // Smooth cute hand emerging cleanly from sleeve cuff
      const handGeo = new THREE.SphereGeometry(0.026, 20, 20);
      handGeo.scale(0.8, 1.25, 0.6);
      const hand = new THREE.Mesh(handGeo, skinMat);
      hand.position.set(xSign * 0.11, -0.52, 0.075);
      hand.rotation.z = xSign * -0.08;
      armGroup.add(hand);

      if (isRight) {
        rightArmGroupRef.current = armGroup;
      } else {
        leftArmGroupRef.current = armGroup;
      }

      return armGroup;
    };

    group.add(createConnectedArm(false));
    group.add(createConnectedArm(true));

    // 3.4 ORGANIC DEFORMABLE FLOATING TÀ TRƯỚC (Front Flap) & TÀ SAU (Back Flap)
    let flapLength = 0.70;
    let flapWidthHem = 0.30;

    if (outfit.mainTop.meshType === 'ao_tac') {
      flapLength = 0.78;
      flapWidthHem = 0.36;
    } else if (outfit.mainTop.meshType === 'ao_dai_remix') {
      flapLength = 0.52;
      flapWidthHem = 0.26;
    }

    const frontFlapGeo = new THREE.PlaneGeometry(flapWidthHem, flapLength, 16, 24);
    frontFlapGeo.translate(0, -flapLength / 2, 0);

    const fPos = frontFlapGeo.attributes.position;
    const fOrigX = new Float32Array(fPos.count);
    const fOrigZ = new Float32Array(fPos.count);

    for (let i = 0; i < fPos.count; i++) {
      const y = fPos.getY(i);
      const normY = Math.max(0, -y / flapLength);
      const widthFactor = 0.82 + normY * 0.32;
      fPos.setX(i, fPos.getX(i) * widthFactor);
      fOrigX[i] = fPos.getX(i);
      fOrigZ[i] = fPos.getZ(i);
    }
    fPos.needsUpdate = true;
    frontFlapGeo.computeVertexNormals();

    const frontFlap = new THREE.Mesh(frontFlapGeo, garmentMat);
    frontFlap.position.set(0, 0.94, 0.128);
    frontFlap.rotation.x = -0.05;
    group.add(frontFlap);

    frontFlapDataRef.current = {
      mesh: frontFlap,
      pos: fPos as THREE.BufferAttribute,
      origX: fOrigX,
      origZ: fOrigZ,
      count: fPos.count,
      length: flapLength,
    };

    const backFlapGeo = new THREE.PlaneGeometry(flapWidthHem, flapLength, 16, 24);
    backFlapGeo.translate(0, -flapLength / 2, 0);

    const bPos = backFlapGeo.attributes.position;
    const bOrigX = new Float32Array(bPos.count);
    const bOrigZ = new Float32Array(bPos.count);

    for (let i = 0; i < bPos.count; i++) {
      const y = bPos.getY(i);
      const normY = Math.max(0, -y / flapLength);
      const widthFactor = 0.82 + normY * 0.32;
      bPos.setX(i, bPos.getX(i) * widthFactor);
      bOrigX[i] = bPos.getX(i);
      bOrigZ[i] = bPos.getZ(i);
    }
    bPos.needsUpdate = true;
    backFlapGeo.computeVertexNormals();

    const backFlap = new THREE.Mesh(backFlapGeo, garmentMat);
    backFlap.position.set(0, 0.94, -0.128);
    backFlap.rotation.x = Math.PI + 0.05;
    group.add(backFlap);

    backFlapDataRef.current = {
      mesh: backFlap,
      pos: bPos as THREE.BufferAttribute,
      origX: bOrigX,
      origZ: bOrigZ,
      count: bPos.count,
      length: flapLength,
    };

    // ==========================================
    // 4. TROUSERS & BOTTOMS
    // ==========================================
    const bottomMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(outfit.bottomColor).getHex(),
      roughness: outfit.bottom.id.includes('jean') ? 0.75 : 0.32,
      metalness: 0.08,
      sheen: 0.6,
      sheenColor: new THREE.Color(outfit.bottomColor).lerp(new THREE.Color(0xffffff), 0.35),
    });

    if (outfit.bottom.meshType === 'vay_tennis') {
      const skirtGeo = new THREE.CylinderGeometry(0.15, 0.30, 0.30, 36);
      const skirt = new THREE.Mesh(skirtGeo, bottomMat);
      skirt.position.y = 0.78;
      group.add(skirt);

      const lLegGeo = new THREE.CylinderGeometry(0.040, 0.033, 0.62, 24);
      const lLeg = new THREE.Mesh(lLegGeo, skinMat);
      lLeg.position.set(-0.070, 0.38, 0);
      group.add(lLeg);

      const rLeg = new THREE.Mesh(lLegGeo, skinMat);
      rLeg.position.set(0.070, 0.38, 0);
      group.add(rLeg);
    } else {
      const pantRadius = outfit.bottom.id.includes('cargo') ? 0.080 : 0.064;
      const legGeo = new THREE.CylinderGeometry(pantRadius, pantRadius * 1.12, 0.88, 32);

      const lPant = new THREE.Mesh(legGeo, bottomMat);
      lPant.position.set(-0.075, 0.46, 0);
      group.add(lPant);

      const rPant = new THREE.Mesh(legGeo, bottomMat);
      rPant.position.set(0.075, 0.46, 0);
      group.add(rPant);

      if (outfit.bottom.id.includes('cargo')) {
        const pocketGeo = new THREE.BoxGeometry(0.055, 0.09, 0.035);
        const pocketMat = new THREE.MeshStandardMaterial({ color: 0x1f242d, roughness: 0.8 });
        const lPocket = new THREE.Mesh(pocketGeo, pocketMat);
        lPocket.position.set(-0.150, 0.52, 0.02);
        group.add(lPocket);

        const rPocket = new THREE.Mesh(pocketGeo, pocketMat);
        rPocket.position.set(0.150, 0.52, 0.02);
        group.add(rPocket);
      }
    }

    // ==========================================
    // 5. FOOTWEAR (SNEAKER CHUNKY RETRO / GUỐC MỘC)
    // ==========================================
    const footMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(outfit.footwear.defaultColor).getHex(),
      roughness: 0.35,
    });

    if (outfit.footwear.meshType === 'sneaker') {
      const createSneaker = (xPos: number) => {
        const snkGroup = new THREE.Group();
        snkGroup.position.set(xPos, 0.035, 0.015);

        const soleGeo = new THREE.BoxGeometry(0.080, 0.040, 0.18);
        const soleMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
        const sole = new THREE.Mesh(soleGeo, soleMat);
        snkGroup.add(sole);

        const upperGeo = new THREE.BoxGeometry(0.072, 0.055, 0.15);
        const upper = new THREE.Mesh(upperGeo, footMat);
        upper.position.set(0, 0.035, -0.01);
        snkGroup.add(upper);

        const toeGeo = new THREE.SphereGeometry(0.035, 20, 20);
        toeGeo.scale(1.0, 0.6, 1.2);
        const toe = new THREE.Mesh(toeGeo, soleMat);
        toe.position.set(0, 0.02, 0.055);
        snkGroup.add(toe);

        return snkGroup;
      };

      group.add(createSneaker(-0.075));
      group.add(createSneaker(0.075));
    } else if (outfit.footwear.meshType === 'guoc_moc') {
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x8b5a2b, roughness: 0.6 });
      const soleGeo = new THREE.BoxGeometry(0.070, 0.030, 0.17);
      const lSole = new THREE.Mesh(soleGeo, woodMat);
      lSole.position.set(-0.075, 0.02, 0.015);
      group.add(lSole);

      const rSole = new THREE.Mesh(soleGeo, woodMat);
      rSole.position.set(0.075, 0.02, 0.015);
      group.add(rSole);

      const strapGeo = new THREE.TorusGeometry(0.035, 0.009, 10, 20, Math.PI);
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x9b1b30, roughness: 0.8 });
      const lStrap = new THREE.Mesh(strapGeo, strapMat);
      lStrap.position.set(-0.075, 0.042, 0.015);
      group.add(lStrap);

      const rStrap = new THREE.Mesh(strapGeo, strapMat);
      rStrap.position.set(0.075, 0.042, 0.015);
      group.add(rStrap);
    } else {
      const shoeGeo = new THREE.BoxGeometry(0.070, 0.045, 0.17);
      const lShoe = new THREE.Mesh(shoeGeo, footMat);
      lShoe.position.set(-0.075, 0.025, 0.015);
      group.add(lShoe);

      const rShoe = new THREE.Mesh(shoeGeo, footMat);
      rShoe.position.set(0.075, 0.025, 0.015);
      group.add(rShoe);
    }

    // ==========================================
    // 6. ACCESSORIES & HEADWEAR
    // ==========================================
    if (outfit.accessory?.id === 'kieng_bac_hiphop') {
      const kiengGeo = new THREE.TorusGeometry(0.078, 0.009, 20, 36, Math.PI * 1.85);
      const kiengMat = new THREE.MeshStandardMaterial({
        color: 0xf1f2f6,
        metalness: 0.95,
        roughness: 0.08,
      });
      const kieng = new THREE.Mesh(kiengGeo, kiengMat);
      kieng.rotation.x = Math.PI / 2.2;
      kieng.position.set(0, 1.36, 0.060);
      group.add(kieng);
    }

    if (outfit.accessory?.id === 'quat_xep_thuy_mac') {
      const fanGeo = new THREE.CircleGeometry(0.16, 24, 0, Math.PI);
      const fanMat = new THREE.MeshStandardMaterial({
        color: 0x9b1b30,
        roughness: 0.4,
        side: THREE.DoubleSide,
      });
      const fan = new THREE.Mesh(fanGeo, fanMat);
      fan.position.set(0.24, 0.88, 0.12);
      fan.rotation.y = -Math.PI / 4;
      fan.rotation.z = Math.PI / 6;
      fanMeshRef.current = fan;
      group.add(fan);
    }

    if (outfit.headwear?.id === 'man_truyen_thong' || outfit.headwear?.id === 'man_dinh_ngoc_y2k') {
      const isPearl = outfit.headwear?.id === 'man_dinh_ngoc_y2k';
      const manGeo = new THREE.TorusGeometry(0.130, 0.035, 24, 36);
      const manMat = new THREE.MeshStandardMaterial({
        color: isPearl ? 0xfcf8f2 : 0xd4af37,
        roughness: 0.3,
        metalness: isPearl ? 0.6 : 0.4,
      });
      const man = new THREE.Mesh(manGeo, manMat);
      man.rotation.x = Math.PI / 2.3;
      man.position.set(0, 1.68, -0.01);
      group.add(man);
    }

    if (outfit.headwear?.id === 'non_la_graffiti') {
      const nonGeo = new THREE.ConeGeometry(0.32, 0.16, 36);
      const nonMat = new THREE.MeshStandardMaterial({
        color: 0xf3e9d2,
        roughness: 0.6,
        side: THREE.DoubleSide,
      });
      const nonLa = new THREE.Mesh(nonGeo, nonMat);
      nonLa.position.set(0, 1.78, -0.02);
      nonLa.rotation.z = -0.15;
      group.add(nonLa);
    }

    if (outfit.headwear?.id === 'kinh_cyber_neon') {
      const frameGeo = new THREE.BoxGeometry(0.17, 0.035, 0.045);
      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x00f2fe,
        emissive: 0x00f2fe,
        emissiveIntensity: 0.8,
        roughness: 0.1,
      });
      const glasses = new THREE.Mesh(frameGeo, frameMat);
      glasses.position.set(0, 1.60, 0.135);
      group.add(glasses);
    }
  }, [outfit]);

  return (
    <div className="relative w-full h-full min-h-[520px] md:min-h-[660px] rounded-3xl overflow-hidden glass-panel border border-[#cba135]/40 shadow-2xl flex flex-col items-center justify-center bg-gradient-to-b from-[#161a29]/80 via-[#0e111a]/90 to-[#07090f]">
      {/* 3D Mount Point */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left Badge & Gender Tag matching screenshot */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#cba135] text-black text-xs font-bold shadow-lg">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Avatar Gen Z (Mượt mà)</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 text-amber-300 border border-[#cba135]/40 text-xs font-bold shadow-md">
          <User className="w-3.5 h-3.5" />
          <span>Nam</span>
        </div>
      </div>

      {/* Lighting Presets & Audio Toggle (Top Right) */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 shadow-lg">
        <button
          onClick={() => onLightingChange('studio')}
          title="Studio Runway (Ánh sáng chuẩn)"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'studio'
              ? 'bg-[#cba135] text-black font-semibold shadow-glow-gold'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onLightingChange('hoian')}
          title="Phố Cổ Hội An (Đèn lồng vàng ấm)"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'hoian'
              ? 'bg-amber-500 text-black font-semibold shadow-glow-gold'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onLightingChange('hue')}
          title="Hoàng Hôn Cố Đô (Tím Huế lãng mạn)"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'hue'
              ? 'bg-purple-600 text-white font-semibold shadow-glow-gold'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => onLightingChange('cyber')}
          title="Cyberpunk Sài Gòn (Neon rực rỡ)"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            lightingPreset === 'cyber'
              ? 'bg-cyan-400 text-black font-semibold shadow-glow-cyan'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>

        <div className="w-[1px] h-4 bg-white/20 mx-0.5" />

        <button
          onClick={() => setShowPetals(!showPetals)}
          title="Cánh hoa sen rơi (Atmosphere)"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            showPetals ? 'bg-pink-500/80 text-white' : 'text-stone-400 hover:text-white'
          }`}
        >
          <Flower2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title="Âm thanh hiệu ứng lụa & chuông gió"
          className={`p-2 rounded-lg text-xs font-medium transition-all ${
            soundEnabled ? 'text-amber-300' : 'text-stone-500'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Interactive Fashion Pose Dock (Center Bottom - Highly Engaging!) */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 p-1 rounded-2xl bg-black/75 backdrop-blur-md border border-[#cba135]/30 shadow-2xl">
        <button
          onClick={() => setActivePose('runway')}
          className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'runway'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>💃 Runway</span>
        </button>

        <button
          onClick={() => setActivePose('fan')}
          className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'fan'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Fan className="w-3.5 h-3.5" />
          <span>Phất Quạt</span>
        </button>

        <button
          onClick={() => setActivePose('peace')}
          className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'peace'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-pink-400" />
          <span>Bắn Tim ✌️</span>
        </button>

        <button
          onClick={() => setActivePose('traditional')}
          className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-1.5 transition-all ${
            activePose === 'traditional'
              ? 'bg-gradient-to-r from-amber-500 to-[#cba135] text-black font-semibold shadow-md'
              : 'text-stone-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>🙏 Cung Kính</span>
        </button>
      </div>

      {/* Bottom Camera View Angle & Auto-Rotate Controls */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 pointer-events-auto">
          <button
            onClick={() => onCameraViewChange('full')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              cameraView === 'full'
                ? 'bg-white/20 text-[#cba135] font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Toàn Thân
          </button>
          <button
            onClick={() => onCameraViewChange('torso')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              cameraView === 'torso'
                ? 'bg-white/20 text-[#cba135] font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Cổ Áo & Cúc
          </button>
          <button
            onClick={() => onCameraViewChange('head')}
            className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
              cameraView === 'head'
                ? 'bg-white/20 text-[#cba135] font-semibold'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            Gương Mặt
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs text-amber-200/90 font-medium pointer-events-auto">
          <Sparkles className="w-3.5 h-3.5 text-[#cba135]" />
          <span>Chế độ Vector Mượt</span>
        </div>
      </div>
    </div>
  );
};
