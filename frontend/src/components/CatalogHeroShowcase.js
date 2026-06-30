import React, { useState, useEffect, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Realistic 3D Teak Wood Accent Chair model built with R3F primitives
const TeakChair = () => {
  return (
    <group scale={1.95} position={[0, -0.15, 0]}>
      {/* Wooden Legs */}
      <mesh position={[-0.2, -0.3, 0.2]} castShadow>
        <cylinderGeometry args={[0.018, 0.012, 0.6, 12]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} metalness={0.05} />
      </mesh>
      <mesh position={[0.2, -0.3, 0.2]} castShadow>
        <cylinderGeometry args={[0.018, 0.012, 0.6, 12]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} metalness={0.05} />
      </mesh>
      <mesh position={[-0.2, -0.3, -0.2]} castShadow>
        <cylinderGeometry args={[0.018, 0.012, 0.6, 12]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} metalness={0.05} />
      </mesh>
      <mesh position={[0.2, -0.3, -0.2]} castShadow>
        <cylinderGeometry args={[0.018, 0.012, 0.6, 12]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} metalness={0.05} />
      </mesh>

      {/* Seat Frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.48, 0.05, 0.48]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.48} />
      </mesh>

      {/* Premium Ivory Cushion */}
      <mesh position={[0, 0.045, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.05, 0.44]} />
        <meshStandardMaterial color="#FAF5EF" roughness={0.8} />
      </mesh>

      {/* Backrest Spindles */}
      <mesh position={[-0.2, 0.28, -0.2]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.6, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>
      <mesh position={[-0.1, 0.28, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>
      <mesh position={[0.1, 0.28, -0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.6, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>
      <mesh position={[0.2, 0.28, -0.2]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.6, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>

      {/* Backrest curved support panel */}
      <mesh position={[0, 0.46, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.44, 0.2, 0.035]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.48} />
      </mesh>

      {/* Luxury Armrests */}
      <mesh position={[-0.23, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.035, 0.03, 0.44]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.48} />
      </mesh>
      <mesh position={[0.23, 0.18, 0.02]} castShadow>
        <boxGeometry args={[0.035, 0.03, 0.44]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.48} />
      </mesh>

      {/* Armrest vertical pillars */}
      <mesh position={[-0.23, 0.09, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>
      <mesh position={[0.23, 0.09, 0.2]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.18, 8]} />
        <meshStandardMaterial color="#4A2F13" roughness={0.52} />
      </mesh>
    </group>
  );
};

// Physics wrapper for slow float cycle and maximum 5-deg mouse tilt response
const InteractivePhysicsContainer = ({ children }) => {
  const groupRef = useRef();
  const mouseCoords = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const trackMouse = (e) => {
      // Normalize cursor coordinates to a range of -1 to 1
      mouseCoords.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoords.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', trackMouse);
    return () => window.removeEventListener('mousemove', trackMouse);
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const ticks = state.clock.getElapsedTime();
    
    // Smooth Y float cycle (0.06 unit displacement)
    groupRef.current.position.y = Math.sin(ticks * 0.6) * 0.06;
    
    // Slow rotational yaw & pitch calculations clamped to 5 degrees (~0.08 radians max)
    const targetX = -mouseCoords.current.y * 0.05;
    const targetY = mouseCoords.current.x * 0.08;
    
    groupRef.current.rotation.x += (targetX - groupRef.current.rotation.x) * 0.08;
    groupRef.current.rotation.y += (targetY - groupRef.current.rotation.y) * 0.08;
  });

  return <group ref={groupRef}>{children}</group>;
};

const CatalogHeroShowcase = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Subtle inline wood grain SVG background
  const woodGrainSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><path d="M0,50 Q25,40 50,50 T100,50 M0,20 Q25,30 50,20 T100,20 M0,80 Q25,75 50,80 T100,80" fill="none" stroke="%23B08D57" stroke-width="0.5" opacity="0.12"/></svg>`;

  return (
    <div className="relative w-full flex flex-col items-center justify-center p-6 lg:p-8 rounded-[24px] border border-borderSubtle bg-white dark:bg-dark-light overflow-hidden shadow-xl min-h-[460px] md:min-h-[500px]">
      
      {/* Wood grain micro texture background overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{ backgroundImage: `url('${woodGrainSvg}')`, backgroundSize: '180px 180px' }}
      />
      
      {/* Ambient shadow gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Model Display Port */}
      <div className="w-full h-[260px] sm:h-[300px] relative z-10 select-none">
        {isMobile ? (
          // Lightweight static mock image placeholder to prevent rendering lag on mobile viewports
          <div className="w-full h-full flex items-center justify-center relative group">
            <div className="absolute w-[180px] h-[180px] rounded-full bg-primary/10 blur-xl animate-pulse" />
            <img 
              src="/images/grey-armchair.png" 
              alt="Premium Sagwan Accent Chair" 
              className="w-auto h-[220px] object-contain relative z-10 drop-shadow-[0_20px_35px_rgba(43,38,33,0.22)] transform group-hover:scale-105 transition-all duration-700"
              onError={(e) => {
                // Fallback icon if image doesn't exist
                e.target.style.display = 'none';
              }}
            />
          </div>
        ) : (
          // Full 3D interactive stage on desktop viewports
          <Suspense fallback={
            <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest font-sans font-bold text-primary animate-pulse">
              Loading Luxury Preview...
            </div>
          }>
            <Canvas 
              shadows 
              camera={{ position: [0, 0, 3], fov: 42 }}
              style={{ background: 'transparent' }}
              gl={{ antialias: true }}
            >
              <ambientLight intensity={0.65} />
              
              {/* Rim light setup */}
              <spotLight
                position={[3, 5, 3]}
                angle={0.4}
                penumbra={1}
                intensity={3.2}
                color="#B08D57"
                castShadow
              />
              <directionalLight
                position={[-4, 2, -4]}
                intensity={1.2}
                color="#FFFFFF"
              />

              <InteractivePhysicsContainer>
                <TeakChair />
              </InteractivePhysicsContainer>
            </Canvas>
          </Suspense>
        )}
      </div>

      {/* Soft realistic shadow bar beneath the 3D chair model */}
      <div className="w-36 h-2 rounded-full bg-[#2B2621]/15 dark:bg-black/45 blur-md mt-1 mb-8 animate-pulse-subtle pointer-events-none" />

      {/* Luxury Statistics Banner */}
      <div className="relative z-10 w-full border-t border-borderSubtle/60 pt-6 grid grid-cols-2 gap-y-4 gap-x-2 text-center">
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">25+ Years</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Of Craftsmanship</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">500+</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Custom Projects</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">100%</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Sagwan Wood</div>
        </div>
        <div>
          <div className="font-serif text-lg md:text-xl font-bold text-primary">Mumbai</div>
          <div className="text-[9px] md:text-[10px] uppercase font-bold tracking-widest text-[#5B5048] dark:text-gray-400">Since 1999</div>
        </div>
      </div>

    </div>
  );
};

export default CatalogHeroShowcase;
