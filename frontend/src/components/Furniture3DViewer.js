import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage } from '@react-three/drei';

// A dynamic luxury sofa model
const SofaModel = () => {
  return (
    <group>
      {/* Base wood frame */}
      <mesh position={[0, -0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.2, 0.9]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} metalness={0.1} />
      </mesh>
      {/* Seat Cushion Left */}
      <mesh position={[-0.51, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.3, 0.8]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
      {/* Seat Cushion Right */}
      <mesh position={[0.51, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.0, 0.3, 0.8]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.5, -0.35]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.7, 0.2]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
      {/* Armrest Left */}
      <mesh position={[-1.15, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 0.9]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Armrest Right */}
      <mesh position={[1.15, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.6, 0.9]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Legs */}
      <mesh position={[-1.0, -0.4, 0.35]} castShadow>
        <cylinderGeometry args={[0.05, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      <mesh position={[1.0, -0.4, 0.35]} castShadow>
        <cylinderGeometry args={[0.05, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      <mesh position={[-1.0, -0.4, -0.35]} castShadow>
        <cylinderGeometry args={[0.05, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      <mesh position={[1.0, -0.4, -0.35]} castShadow>
        <cylinderGeometry args={[0.05, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
    </group>
  );
};

// A dynamic teak dining table model with realistic glass top
const TableModel = () => {
  return (
    <group>
      {/* Wooden Legs */}
      <mesh position={[-0.8, -0.4, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.03, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      <mesh position={[0.8, -0.4, 0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.03, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      <mesh position={[-0.8, -0.4, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.03, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      <mesh position={[0.8, -0.4, -0.4]} castShadow>
        <cylinderGeometry args={[0.05, 0.03, 0.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Table Frame */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <boxGeometry args={[1.8, 0.05, 1.0]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Glass Top */}
      <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.0, 0.04, 1.2]} />
        <meshPhysicalMaterial 
          color="#e0f7fa" 
          transparent 
          opacity={0.35} 
          roughness={0.05} 
          metalness={0.9} 
          transmission={0.95} 
          thickness={0.6} 
        />
      </mesh>
    </group>
  );
};

// A dynamic royal bed model
const BedModel = () => {
  return (
    <group>
      {/* Headboard */}
      <mesh position={[0, 0.5, -0.95]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 1.2, 0.1]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Bed Base Frame */}
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.3, 1.8]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.15, -0.05]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.25, 1.7]} />
        <meshStandardMaterial color="#FAF9F6" roughness={0.8} />
      </mesh>
      {/* Pillow Left */}
      <mesh position={[-0.35, 0.3, -0.7]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
      {/* Pillow Right */}
      <mesh position={[0.35, 0.3, -0.7]} castShadow>
        <boxGeometry args={[0.5, 0.1, 0.35]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
    </group>
  );
};

// A dynamic teak armchair model
const ChairModel = () => {
  return (
    <group>
      {/* Seat Frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.08, 0.6]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.45, -0.26]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.8, 0.06]} />
        <meshStandardMaterial color="#5C4033" roughness={0.65} />
      </mesh>
      {/* Cushion */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.54, 0.06, 0.54]} />
        <meshStandardMaterial color="#C59D5F" roughness={0.8} />
      </mesh>
      {/* Front Left Leg */}
      <mesh position={[-0.26, -0.35, 0.26]} castShadow>
        <cylinderGeometry args={[0.025, 0.015, 0.7]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      {/* Front Right Leg */}
      <mesh position={[0.26, -0.35, 0.26]} castShadow>
        <cylinderGeometry args={[0.025, 0.015, 0.7]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      {/* Back Left Leg */}
      <mesh position={[-0.26, -0.35, -0.26]} castShadow>
        <cylinderGeometry args={[0.025, 0.015, 0.7]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
      {/* Back Right Leg */}
      <mesh position={[0.26, -0.35, -0.26]} castShadow>
        <cylinderGeometry args={[0.025, 0.015, 0.7]} />
        <meshStandardMaterial color="#2C241B" roughness={0.7} />
      </mesh>
    </group>
  );
};

const Furniture3DViewer = ({ category }) => {
  const renderModel = () => {
    switch (category) {
      case 'Sofas':
        return <SofaModel />;
      case 'Tables':
        return <TableModel />;
      case 'Beds':
        return <BedModel />;
      case 'Chairs':
      default:
        return <ChairModel />;
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden bg-parchment">
      <Canvas shadows camera={{ position: [3, 2, 4], fov: 45 }}>
        <color attach="background" args={["#FAF9F6"]} />
        <ambientLight intensity={0.7} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
        >
          <orthographicCamera attach="shadow-camera" args={[-2, 2, 2, -2, 0.1, 20]} />
        </directionalLight>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.5} adjustCamera={false}>
            {renderModel()}
          </Stage>
        </Suspense>
        <OrbitControls 
          enableZoom={true} 
          autoRotate 
          autoRotateSpeed={0.5} 
          minDistance={2} 
          maxDistance={8} 
        />
      </Canvas>
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md py-1.5 px-3 border border-borderSubtle text-[10px] font-sans tracking-widest uppercase pointer-events-none text-stone font-semibold">
        Drag to Orbit | Scroll to Zoom
      </div>
    </div>
  );
};

export default Furniture3DViewer;
