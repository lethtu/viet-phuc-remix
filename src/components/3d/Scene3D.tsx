import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { GLTFModelLoader } from './GLTFModelLoader';
import { ProceduralClothes } from './ProceduralClothes';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { ParticleEffects3D } from './ParticleEffects3D';

interface Scene3DProps {
  gender: 'male' | 'female';
  clothes: any | null;
  pose: string;
  activeEffects: string[];
  windSpeed: 'none' | 'light' | 'strong';
  isBaseModelOnly: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({
  gender,
  clothes,
  pose,
  activeEffects,
  windSpeed,
  isBaseModelOnly,
}) => {
  return (
    <div className="w-full h-full absolute inset-0 bg-[#0c0d12]">
      <Canvas shadows camera={{ position: [0, 1.2, 3.5], fov: 40 }}>
        <color attach="background" args={['#050508']} />
        
        <fog attach="fog" args={['#050508', 3, 10]} />

        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <spotLight position={[3, 5, 3]} angle={0.4} penumbra={1} intensity={5} castShadow color="#ffb6c1" />
        <spotLight position={[-3, 4, -3]} angle={0.3} penumbra={1} intensity={3} color="#8a2be2" />
        <directionalLight position={[0, 8, 2]} intensity={2} color="#d4af37" />

        {/* Environment for nice reflections on the procedural materials */}
        <Suspense fallback={null}>
          <Environment preset="city" />
          
          <group position={[0, -1, 0]}>
            {/* Real 3D Avatar (from provided GLB) */}
            <GLTFModelLoader url="/avatar.glb" pose={pose} isBaseModelOnly={isBaseModelOnly} />
            
            {/* Pedestal */}
            <mesh position={[0, -0.05, 0]} receiveShadow>
              <cylinderGeometry args={[1.5, 1.8, 0.05, 64]} />
              <meshPhysicalMaterial color="#111" roughness={0.1} metalness={0.9} clearcoat={1} />
            </mesh>

            {/* Shadows */}
            <ContactShadows position={[0, 0, 0]} opacity={0.8} scale={6} blur={2.5} far={2} color="#000" />
          </group>

          {/* Particle Effects */}
          <ParticleEffects3D activeEffects={activeEffects} windSpeed={windSpeed} />
          
          {/* Post Processing Cinematic Effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} />
            <Noise opacity={0.02} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </Suspense>

        {/* Controls */}
        <OrbitControls 
          enablePan={false} 
          minDistance={2} 
          maxDistance={5} 
          minPolarAngle={Math.PI / 4} 
          maxPolarAngle={Math.PI / 2}
          target={[0, 0.5, 0]}
          autoRotate
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
};
