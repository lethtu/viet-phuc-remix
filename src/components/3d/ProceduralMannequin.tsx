import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralMannequinProps {
  gender: 'male' | 'female';
  pose: string;
  isBaseModelOnly: boolean;
}

export const ProceduralMannequin: React.FC<ProceduralMannequinProps> = ({ gender, pose, isBaseModelOnly }) => {
  const group = useRef<THREE.Group>(null);
  
  // Base proportions based on gender
  const isFemale = gender === 'female';
  const shoulderWidth = isFemale ? 0.4 : 0.6;
  const hipWidth = isFemale ? 0.45 : 0.35;
  const heightMult = isFemale ? 0.95 : 1.05;
  
  // Premium Metallic Material for a high-end fashion mannequin look
  const materialSkin = new THREE.MeshPhysicalMaterial({
    color: isFemale ? '#ffb6c1' : '#d4af37', // Rose Gold for Female, Royal Gold for Male
    metalness: 0.9,
    roughness: 0.15,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    envMapIntensity: 1.5,
  });

  const materialUndergarment = new THREE.MeshPhysicalMaterial({
    color: isFemale ? '#ffffff' : '#1a1a1a',
    metalness: 0.1,
    roughness: 0.8,
    clearcoat: 0.2,
  });

  // Breathing animation
  useFrame(({ clock }) => {
    if (group.current) {
      const t = clock.getElapsedTime();
      // Gentle breathing scale on Y and Z for the torso
      const torso = group.current.children.find(c => c.name === 'torso');
      if (torso) {
        torso.scale.z = 1 + Math.sin(t * 2) * 0.02;
        torso.scale.x = 1 + Math.sin(t * 2) * 0.01;
      }
      
      // Handle simple poses
      const leftArm = group.current.children.find(c => c.name === 'leftArm');
      const rightArm = group.current.children.find(c => c.name === 'rightArm');
      
      if (leftArm && rightArm) {
        if (pose === 'cung_kinh') {
          leftArm.rotation.z = Math.PI / 4;
          rightArm.rotation.z = -Math.PI / 4;
          leftArm.rotation.x = -Math.PI / 4;
          rightArm.rotation.x = -Math.PI / 4;
        } else if (pose === 'phat_quat') {
          rightArm.rotation.z = -Math.PI / 2;
          rightArm.rotation.x = Math.sin(t) * 0.2;
          leftArm.rotation.z = 0.1;
        } else if (pose === 'ban_tim') {
          rightArm.rotation.z = -Math.PI / 1.5;
          rightArm.rotation.x = -Math.PI / 3;
          leftArm.rotation.z = Math.PI / 1.5;
          leftArm.rotation.x = -Math.PI / 3;
        } else {
          // Runway (walking slightly)
          leftArm.rotation.x = Math.sin(t * 2) * 0.2;
          rightArm.rotation.x = -Math.sin(t * 2) * 0.2;
          leftArm.rotation.z = 0.1;
          rightArm.rotation.z = -0.1;
        }
      }
    }
  });

  return (
    <group ref={group} position={[0, heightMult * 1.5, 0]}>
      {/* Head */}
      <mesh name="head" position={[0, 1.2, 0]} material={materialSkin}>
        <sphereGeometry args={[0.2, 32, 32]} />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 0.95, 0]} material={materialSkin}>
        <cylinderGeometry args={[0.08, 0.1, 0.2, 16]} />
      </mesh>

      {/* Torso */}
      <mesh name="torso" position={[0, 0.3, 0]} material={isBaseModelOnly ? materialUndergarment : materialSkin}>
        <capsuleGeometry args={[shoulderWidth/2, 0.8, 16, 16]} />
      </mesh>

      {/* Hips (Pelvis) */}
      <mesh position={[0, -0.4, 0]} material={isBaseModelOnly ? materialUndergarment : materialSkin}>
        <sphereGeometry args={[hipWidth/2, 32, 32]} />
      </mesh>

      {/* Left Arm */}
      <group name="leftArm" position={[shoulderWidth/2 + 0.1, 0.7, 0]}>
        <mesh position={[0, -0.4, 0]} material={materialSkin}>
          <capsuleGeometry args={[0.08, 0.7, 16, 16]} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group name="rightArm" position={[-shoulderWidth/2 - 0.1, 0.7, 0]}>
        <mesh position={[0, -0.4, 0]} material={materialSkin}>
          <capsuleGeometry args={[0.08, 0.7, 16, 16]} />
        </mesh>
      </group>

      {/* Left Leg */}
      <group name="leftLeg" position={[hipWidth/4, -0.5, 0]}>
        <mesh position={[0, -0.6, 0]} material={materialSkin}>
          <capsuleGeometry args={[0.1, 1.1, 16, 16]} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group name="rightLeg" position={[-hipWidth/4, -0.5, 0]}>
        <mesh position={[0, -0.6, 0]} material={materialSkin}>
          <capsuleGeometry args={[0.1, 1.1, 16, 16]} />
        </mesh>
      </group>
    </group>
  );
};
