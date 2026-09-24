import React from 'react';
import { useGLTF } from '@react-three/drei';

interface GLTFModelLoaderProps {
  url: string;
  pose: string;
  isBaseModelOnly: boolean;
}

export const GLTFModelLoader: React.FC<GLTFModelLoaderProps> = ({ url, pose, isBaseModelOnly }) => {
  // Load the GLTF/GLB model from the provided URL
  const { scene } = useGLTF(url);

  // You can traverse the scene here to apply animations based on `pose`,
  // or change materials/visibility of clothing meshes based on `isBaseModelOnly`

  return (
    <primitive 
      object={scene} 
      scale={1} 
      position={[0, 0, 0]} 
      castShadow 
      receiveShadow 
    />
  );
};
