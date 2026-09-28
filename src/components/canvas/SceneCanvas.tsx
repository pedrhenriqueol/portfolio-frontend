import React, { Suspense, useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface SceneCanvasProps {
    modelUrl?: string;
}

/**
 * Listener de Scroll de Alta Performance:
 * Monitora window.scrollY e aciona invalidate() do R3F sob demanda,
 * mantendo o frameloop em 0 FPS / 0% GPU quando o usuário está parado.
 */
function ScrollInvalidator() {
    const { invalidate } = useThree();

    useEffect(() => {
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    invalidate();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        
        // Render inicial
        invalidate();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [invalidate]);

    return null;
}

/**
 * Modelo GLTF com Tratamento Gracioso de Erro
 */
function LoadedModel({ url }: { url: string }) {
    const gltf = useGLTF(url);
    return <primitive object={gltf.scene} scale={1.2} />;
}

/**
 * Núcleo Geométrico Tecnológico Estilizado (Orbital Tech Construct):
 * Estrutura 3D procedural sutil de fundo (estilo Linear / Vercel),
 * operando em baixa emissão e opacidade reduzida para atuar como textura
 * atmosférica sem jamais distrair ou competir com a tipografia da HUD.
 */
function TechOrbitalCore() {
    const groupRef = useRef<THREE.Group>(null);
    const outerRingRef = useRef<THREE.Mesh>(null);
    const innerRingRef = useRef<THREE.Mesh>(null);
    const coreRef = useRef<THREE.Mesh>(null);

    // Scroll progress normalizado de 0 a 1 na página
    const [scrollFraction, setScrollFraction] = useState(0);

    useEffect(() => {
        const updateScroll = () => {
            const maxScroll = Math.max(
                document.documentElement.scrollHeight - window.innerHeight,
                1
            );
            const fraction = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
            setScrollFraction(fraction);
        };

        window.addEventListener('scroll', updateScroll, { passive: true });
        updateScroll();
        return () => window.removeEventListener('scroll', updateScroll);
    }, []);

    // Atualização da pose tridimensional suave atrelada ao scroll
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Dobra 1 (Hero): x: 2.2, y: 0.1, z: -2.5 (afastado no fundo direito)
        // Dobra 2 (Sobre Mim / O Que Eu Faço): x: 3.0, y: -0.3, z: -2.0
        // Dobra 3+ (Experiência/Projetos): x: 1.0, y: -0.6, z: -3.5
        const targetX = scrollFraction < 0.25 
            ? THREE.MathUtils.lerp(2.2, 3.0, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(3.0, 1.2, (scrollFraction - 0.25) / 0.75);

        const targetY = scrollFraction < 0.25
            ? THREE.MathUtils.lerp(0.1, -0.3, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(-0.3, -0.6, (scrollFraction - 0.25) / 0.75);

        const targetZ = scrollFraction < 0.25
            ? THREE.MathUtils.lerp(-2.5, -2.0, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(-2.0, -3.5, (scrollFraction - 0.25) / 0.75);

        // Amortecimento suave
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 3.5, delta);
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 3.5, delta);
        groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 3.5, delta);

        // Rotação sutil com base no scroll
        const scrollRotation = scrollFraction * Math.PI * 1.5;
        if (coreRef.current) {
            coreRef.current.rotation.y = scrollRotation;
            coreRef.current.rotation.x = scrollRotation * 0.5;
        }

        if (outerRingRef.current) {
            outerRingRef.current.rotation.x = scrollRotation * 0.8 + Math.PI / 4;
            outerRingRef.current.rotation.y = -scrollRotation * 0.6;
        }

        if (innerRingRef.current) {
            innerRingRef.current.rotation.y = scrollRotation * 1.2 + Math.PI / 3;
            innerRingRef.current.rotation.z = scrollRotation * 0.5;
        }
    });

    // Materiais sóbrios e translúcidos para textura de fundo não-distrativa
    const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#064e3b',
        emissive: '#022c22',
        emissiveIntensity: 0.15,
        roughness: 0.6,
        metalness: 0.4,
        transparent: true,
        opacity: 0.35,
    }), []);

    const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#10b981',
        wireframe: true,
        transparent: true,
        opacity: 0.18
    }), []);

    const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#0284c7',
        emissive: '#082f49',
        emissiveIntensity: 0.1,
        roughness: 0.5,
        metalness: 0.5,
        transparent: true,
        opacity: 0.22,
    }), []);

    return (
        <Float speed={1.0} rotationIntensity={0.2} floatIntensity={0.3}>
            <group ref={groupRef} position={[2.2, 0.1, -2.5]}>
                {/* Núcleo facetado com wireframe atmosférico */}
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[0.8, 1]} />
                    <primitive object={coreMaterial} attach="material" />
                </mesh>
                <mesh>
                    <icosahedronGeometry args={[0.82, 1]} />
                    <primitive object={wireframeMaterial} attach="material" />
                </mesh>

                {/* Anel Orbital Externo */}
                <mesh ref={outerRingRef}>
                    <torusGeometry args={[1.35, 0.015, 16, 64]} />
                    <primitive object={ringMaterial} attach="material" />
                </mesh>

                {/* Anel Orbital Interno */}
                <mesh ref={innerRingRef}>
                    <torusGeometry args={[1.1, 0.01, 16, 48]} />
                    <primitive object={ringMaterial} attach="material" />
                </mesh>

                {/* Micro-pontos de dados orbitais com brilho esmeralda atenuado */}
                {[0, 1, 2, 3].map((idx) => {
                    const angle = (idx / 4) * Math.PI * 2;
                    const r = 1.25;
                    return (
                        <mesh 
                            key={idx} 
                            position={[Math.cos(angle) * r, Math.sin(angle) * 0.3, Math.sin(angle) * r]}
                        >
                            <sphereGeometry args={[0.035, 8, 8]} />
                            <meshBasicMaterial color="#34d399" transparent opacity={0.3} />
                        </mesh>
                    );
                })}
            </group>
        </Float>
    );
}

/**
 * Cena com Iluminação de Estúdio Suave Atenuada
 */
function SceneContent({ modelUrl }: SceneCanvasProps) {
    return (
        <>
            <ScrollInvalidator />

            {/* Iluminação suave e discreta */}
            <ambientLight intensity={0.3} />
            <directionalLight position={[6, 8, 5]} intensity={0.5} color="#ffffff" />
            <directionalLight position={[-6, -4, -3]} intensity={0.2} color="#10b981" />

            <Suspense fallback={<TechOrbitalCore />}>
                {modelUrl ? <LoadedModel url={modelUrl} /> : <TechOrbitalCore />}
            </Suspense>
        </>
    );
}

/**
 * SceneCanvas:
 * Camada WebGL Isolada e Blindada no Fundo:
 * - className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40"
 * - pointer-events-none garantido no container e no elemento <canvas>
 * - z-[-1] mantendo o 3D permanentemente atrás de todo o conteúdo da HUD
 * - frameloop="demand" para zero consumo de GPU em repouso
 */
export default function SceneCanvas({ modelUrl }: SceneCanvasProps) {
    return (
        <div 
            className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden opacity-40" 
            style={{ pointerEvents: 'none' }}
            aria-hidden="true"
        >
            <Canvas
                frameloop="demand"
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 20 }}
                style={{ pointerEvents: 'none' }}
                gl={{
                    powerPreference: 'high-performance',
                    antialias: true,
                    alpha: true,
                    stencil: false,
                    depth: true
                }}
            >
                <SceneContent modelUrl={modelUrl} />
            </Canvas>
        </div>
    );
}
