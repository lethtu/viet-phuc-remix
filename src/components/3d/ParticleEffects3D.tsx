import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ParticleEffects3DProps {
  activeEffects: string[];
  windSpeed: 'none' | 'light' | 'strong';
}

export const ParticleEffects3D: React.FC<ParticleEffects3DProps> = ({ activeEffects, windSpeed }) => {
  const stardustRef = useRef<THREE.Points>(null);
  const fireflyRef = useRef<THREE.Points>(null);
  const lotusRef = useRef<THREE.InstancedMesh>(null);

  const particleCount = 2000; // Increased significantly for cinematic density

  // Stardust positions (Glowing Orbs)
  const stardustPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15; // x (Wider spread for full screen)
      pos[i * 3 + 1] = Math.random() * 8 - 2;  // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15; // z
    }
    return pos;
  }, []);

  // Firefly positions
  const fireflyPositions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12; // x
      pos[i * 3 + 1] = Math.random() * 6 - 1;  // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12; // z
    }
    return pos;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock, pointer, camera }) => {
    const t = clock.getElapsedTime();
    let windForce = 0;
    if (windSpeed === 'light') windForce = 0.05;
    if (windSpeed === 'strong') windForce = 0.2;

    // Subtle parallax effect on camera based on mouse movement for that premium awwwards feel
    camera.position.x += (pointer.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (pointer.y * 0.5 + 1.2 - camera.position.y) * 0.05;
    camera.lookAt(0, 0.5, 0);

    if (activeEffects.includes('bui_vang') && stardustRef.current) {
      stardustRef.current.rotation.y = t * 0.02 + windForce * t;
      stardustRef.current.rotation.x = pointer.y * 0.1;
      stardustRef.current.rotation.z = pointer.x * 0.1;
    }

    if (activeEffects.includes('dom_dom') && fireflyRef.current) {
      fireflyRef.current.rotation.y = Math.sin(t * 0.1) * 0.5;
      const positions = fireflyRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += Math.sin(t + i) * 0.002 + windForce * 0.01;
      }
      fireflyRef.current.geometry.attributes.position.needsUpdate = true;
    }

    if (activeEffects.includes('hoa_sen') && lotusRef.current) {
      // Animate instanced mesh
      for (let i = 0; i < 150; i++) {
        const time = t + i * 0.5;
        const x = Math.sin(time * 0.5) * 4 + Math.sin(time * 0.2) * 2 + (pointer.x * 2);
        const z = Math.cos(time * 0.5) * 4;
        const y = (8 - (time * (0.5 + windForce * 2)) % 8) - 1;
        
        dummy.position.set(x, y, z);
        dummy.rotation.x = time;
        dummy.rotation.y = time * 0.5 + pointer.x;
        dummy.scale.setScalar(0.08); // Slightly bigger
        dummy.updateMatrix();
        lotusRef.current.setMatrixAt(i, dummy.matrix);
      }
      lotusRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {activeEffects.includes('bui_vang') && (
        <points ref={stardustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[stardustPositions, 3]}
            />
          </bufferGeometry>
          {/* toneMapped={false} allows colors to exceed 1.0, enabling intense Bloom */}
          <pointsMaterial size={0.04} color="#ffe55c" transparent opacity={0.8} sizeAttenuation toneMapped={false} />
        </points>
      )}

      {activeEffects.includes('dom_dom') && (
        <points ref={fireflyRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[fireflyPositions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial size={0.07} color="#ff3366" transparent opacity={1} sizeAttenuation toneMapped={false} />
        </points>
      )}

      {activeEffects.includes('hoa_sen') && (
        <instancedMesh ref={lotusRef} args={[undefined, undefined, 150]}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial color="#ff69b4" side={THREE.DoubleSide} transparent opacity={0.9} toneMapped={false} />
        </instancedMesh>
      )}
    </group>
  );
};
