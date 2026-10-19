import { useCityJsonRenderer } from '@/lib/cityjson';
import { Error as ErrorIcon } from '@mui/icons-material';
import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useThree } from '@react-three/fiber';
import { FC, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { roof3DViewerStyle } from './style';

interface Roof3DSceneProps {
  cityJson: any;
}

// Lights are added imperatively (rather than as <ambientLight>/<directionalLight> JSX)
// because @react-three/fiber's JSX intrinsic-elements augmentation targets a bare global
// `JSX` namespace, which this project's newer @types/react no longer exposes JSX
// resolution through (it moved to `React.JSX`).
const addLights = (scene: THREE.Scene) => {
  const ambient = new THREE.AmbientLight(0x999999, 0.7 * Math.PI);
  const keyLight = new THREE.DirectionalLight(0xdddddd, Math.PI);
  keyLight.position.set(1, 2, 3);
  const fillLight = new THREE.DirectionalLight(0xdddddd, Math.PI);
  fillLight.position.set(-1, -2, -3);

  scene.add(ambient, keyLight, fillLight);
  return [ambient, keyLight, fillLight];
};

const Roof3DScene: FC<Roof3DSceneProps> = ({ cityJson }) => {
  const { scene, camera } = useThree();
  const { buildSceneGroup } = useCityJsonRenderer({ enableTexture: true });
  const groupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const lights = addLights(scene);
    return () => lights.forEach(light => scene.remove(light));
  }, [scene]);

  useEffect(() => {
    if (!cityJson) return;

    if (groupRef.current) {
      groupRef.current.traverse(child => {
        const mesh = child as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach(material => material?.dispose());
        }
      });
      scene.remove(groupRef.current);
    }

    const group = buildSceneGroup(cityJson);
    scene.add(group);
    groupRef.current = group;

    const box = new THREE.Box3().setFromObject(group);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    camera.position.set(center.x, center.y + maxDim, center.z + maxDim);
    camera.up.set(0, 1, 0);
    camera.lookAt(center);

    return () => {
      if (groupRef.current) scene.remove(groupRef.current);
    };
  }, [cityJson]);

  return <OrbitControls enableDamping dampingFactor={0.05} />;
};

interface Roof3DViewerProps {
  cityJson: any;
  isLoading: boolean;
  isError: boolean;
  height: string | number;
}

export const Roof3DViewer: FC<Roof3DViewerProps> = ({ cityJson, isLoading, isError, height }) => {
  return (
    <Box sx={roof3DViewerStyle} height={height}>
      {!isLoading && !isError && cityJson && (
        <Canvas
          data-cy='roof-3d-canvas'
          camera={{ position: [0, -1, 1], up: [0, 0, 1], fov: 60, near: 0.0001, far: 4000 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        >
          <Roof3DScene cityJson={cityJson} />
        </Canvas>
      )}
      {isLoading && (
        <Box className='loading-container'>
          <Stack className='loading-element-container'>
            <CircularProgress />
            <Typography>Génération du modèle 3D de la toiture...</Typography>
          </Stack>
        </Box>
      )}
      {!isLoading && isError && (
        <Box className='error-container'>
          <Stack>
            <ErrorIcon />
            <Typography>Le modèle 3D de la toiture n’est pas disponible pour le moment.</Typography>
          </Stack>
        </Box>
      )}
    </Box>
  );
};
