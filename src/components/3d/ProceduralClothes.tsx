import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ProceduralClothesProps {
  gender: 'male' | 'female';
  clothes: any | null; // The selected garment item
  isBaseModelOnly: boolean;
  windSpeed: 'none' | 'light' | 'strong';
}

export const ProceduralClothes: React.FC<ProceduralClothesProps> = ({ gender, clothes, isBaseModelOnly, windSpeed }) => {
  const skirtRef = useRef<THREE.Mesh>(null);
  const leftSleeveRef = useRef<THREE.Mesh>(null);
  const rightSleeveRef = useRef<THREE.Mesh>(null);

  const isFemale = gender === 'female';
  const heightMult = isFemale ? 0.95 : 1.05;

  // If no clothes or base model only, render nothing
  if (isBaseModelOnly || !clothes) {
    return null;
  }

  // Determine material color based on the item category or type
  // Simple fallback color mapping
  let clothColor = '#ffffff';
  if (clothes.name.toLowerCase().includes('áo dài')) clothColor = isFemale ? '#4ade80' : '#1e3a8a';
  else if (clothes.name.toLowerCase().includes('nhật bình')) clothColor = '#b91c1c';
  else if (clothes.name.toLowerCase().includes('áo tấc')) clothColor = '#d97706';
  else if (clothes.name.toLowerCase().includes('tứ thân')) clothColor = '#ec4899';
  else clothColor = '#64748b';

  // Premium Silk Material (Lụa cao cấp)
  const clothMaterial = new THREE.MeshPhysicalMaterial({
    color: clothColor,
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.5,
    clearcoatRoughness: 0.2,
    sheen: 1.0,
    sheenColor: new THREE.Color(clothColor).offsetHSL(0, 0, 0.2), // Lighter sheen
    envMapIntensity: 1.0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.98,
  });

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    let windForce = 0;
    if (windSpeed === 'light') windForce = 0.05;
    if (windSpeed === 'strong') windForce = 0.15;

    if (skirtRef.current) {
      // Simulate wind blowing the skirt
      skirtRef.current.rotation.x = Math.sin(t * 3) * windForce;
      skirtRef.current.position.z = Math.sin(t * 3) * windForce * 2;
    }
    if (leftSleeveRef.current) {
      leftSleeveRef.current.rotation.x = Math.sin(t * 4) * windForce;
    }
    if (rightSleeveRef.current) {
      rightSleeveRef.current.rotation.x = Math.sin(t * 4 + 1) * windForce;
    }
  });

  // Abstract shapes for clothes based on type
  const isAoDai = clothes.name.toLowerCase().includes('áo dài');
  const isAoTac = clothes.name.toLowerCase().includes('áo tấc');
  
  return (
    <group position={[0, heightMult * 1.5, 0]}>
      {/* Torso Covering */}
      <mesh position={[0, 0.3, 0]} material={clothMaterial}>
        <cylinderGeometry args={[isFemale ? 0.22 : 0.32, isFemale ? 0.25 : 0.35, 1.0, 32]} />
      </mesh>

      {/* Skirt / Tà Áo (Front and Back flaps) */}
      {(isAoDai || isAoTac) && (
        <group ref={skirtRef} position={[0, -0.2, 0]}>
          {/* Front Flap */}
          <mesh position={[0, -0.6, 0.1]} material={clothMaterial}>
            <planeGeometry args={[0.5, 1.2]} />
          </mesh>
          {/* Back Flap */}
          <mesh position={[0, -0.6, -0.1]} material={clothMaterial} rotation={[0, Math.PI, 0]}>
            <planeGeometry args={[0.5, 1.2]} />
          </mesh>
        </group>
      )}

      {/* Sleeves */}
      <group position={[isFemale ? 0.25 : 0.35, 0.7, 0]}>
        <mesh ref={leftSleeveRef} position={[0, -0.4, 0]} material={clothMaterial} rotation={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.1, isAoTac ? 0.2 : 0.09, 0.8, 16]} />
        </mesh>
      </group>
      <group position={[isFemale ? -0.25 : -0.35, 0.7, 0]}>
        <mesh ref={rightSleeveRef} position={[0, -0.4, 0]} material={clothMaterial} rotation={[0, 0, -0.1]}>
          <cylinderGeometry args={[0.1, isAoTac ? 0.2 : 0.09, 0.8, 16]} />
        </mesh>
      </group>

      {/* Trousers (Quần) */}
      <group position={[0, -0.4, 0]}>
        {/* Left Leg */}
        <mesh position={[0.12, -0.6, 0]} material={new THREE.MeshPhysicalMaterial({ color: isFemale ? '#ffffff' : '#111111' })}>
          <cylinderGeometry args={[0.12, 0.15, 1.2, 16]} />
        </mesh>
        {/* Right Leg */}
        <mesh position={[-0.12, -0.6, 0]} material={new THREE.MeshPhysicalMaterial({ color: isFemale ? '#ffffff' : '#111111' })}>
          <cylinderGeometry args={[0.12, 0.15, 1.2, 16]} />
        </mesh>
      </group>
    </group>
  );
};
