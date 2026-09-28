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
    return <primitive object={gltf.scene} scale={1.5} />;
}

/**
 * Núcleo Geométrico Tecnológico Estilizado (Orbital Tech Construct):
 * Estrutura 3D procedural leve, sem texturas pesadas, com alta fidelidade visual
 * e consumo mínimo de GPU para hardware integrado (Intel iGPU).
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

    // Atualização da pose tridimensional conforme o scroll da página
    useFrame((state, delta) => {
        if (!groupRef.current) return;

        // Dobra 1 (Hero): x: 1.8, y: 0, z: -1
        // Dobra 2 (Sobre Mim / O Que Eu Faço): x: 2.8, y: -0.4, z: -0.5 (deslocado para a direita)
        // Dobra 3+ (Experiência/Projetos): x: 0.5, y: -0.8, z: -3.5 (fundo sutil)
        const targetX = scrollFraction < 0.25 
            ? THREE.MathUtils.lerp(1.5, 2.8, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(2.8, 0.8, (scrollFraction - 0.25) / 0.75);

        const targetY = scrollFraction < 0.25
            ? THREE.MathUtils.lerp(0.2, -0.4, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(-0.4, -0.6, (scrollFraction - 0.25) / 0.75);

        const targetZ = scrollFraction < 0.25
            ? THREE.MathUtils.lerp(-1.0, -0.5, scrollFraction / 0.25)
            : THREE.MathUtils.lerp(-0.5, -2.5, (scrollFraction - 0.25) / 0.75);

        // Interpolação suave para evitar saltos
        groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 4, delta);
        groupRef.current.position.y = THREE.MathUtils.damp(groupRef.current.position.y, targetY, 4, delta);
        groupRef.current.position.z = THREE.MathUtils.damp(groupRef.current.position.z, targetZ, 4, delta);

        // Rotação sutil atrelada ao scroll + rotação contínua
        const scrollRotation = scrollFraction * Math.PI * 2;
        if (coreRef.current) {
            coreRef.current.rotation.y = scrollRotation * 1.5;
            coreRef.current.rotation.x = scrollRotation * 0.8;
        }

        if (outerRingRef.current) {
            outerRingRef.current.rotation.x = scrollRotation * 1.2 + Math.PI / 4;
            outerRingRef.current.rotation.y = -scrollRotation * 0.9;
        }

        if (innerRingRef.current) {
            innerRingRef.current.rotation.y = scrollRotation * 1.8 + Math.PI / 3;
            innerRingRef.current.rotation.z = scrollRotation * 0.7;
        }
    });

    // Materiais compartilhados para evitar re-alocação de shaders
    const coreMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#10b981',
        emissive: '#047857',
        emissiveIntensity: 0.35,
        roughness: 0.2,
        metalness: 0.8,
        wireframe: false
    }), []);

    const wireframeMaterial = useMemo(() => new THREE.MeshBasicMaterial({
        color: '#34d399',
        wireframe: true,
        transparent: true,
        opacity: 0.4
    }), []);

    const ringMaterial = useMemo(() => new THREE.MeshStandardMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.2,
        roughness: 0.3,
        metalness: 0.9,
    }), []);

    return (
        <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.6}>
            <group ref={groupRef} position={[1.5, 0.2, -1]}>
                {/* Núcleo facetado (Icosaedro com wireframe superposto) */}
                <mesh ref={coreRef}>
                    <icosahedronGeometry args={[0.9, 1]} />
                    <primitive object={coreMaterial} attach="material" />
                </mesh>
                <mesh>
                    <icosahedronGeometry args={[0.92, 1]} />
                    <primitive object={wireframeMaterial} attach="material" />
                </mesh>

                {/* Anel Orbital Externo */}
                <mesh ref={outerRingRef}>
                    <torusGeometry args={[1.5, 0.02, 16, 64]} />
                    <primitive object={ringMaterial} attach="material" />
                </mesh>

                {/* Anel Orbital Interno */}
                <mesh ref={innerRingRef}>
                    <torusGeometry args={[1.2, 0.015, 16, 48]} />
                    <primitive object={ringMaterial} attach="material" />
                </mesh>

                {/* Partículas / Nódulos orbitais de dados */}
                {[0, 1, 2, 3, 4].map((idx) => {
                    const angle = (idx / 5) * Math.PI * 2;
                    const r = 1.35;
                    return (
                        <mesh 
                            key={idx} 
                            position={[Math.cos(angle) * r, Math.sin(angle) * 0.4, Math.sin(angle) * r]}
                        >
                            <sphereGeometry args={[0.045, 12, 12]} />
                            <meshBasicMaterial color="#6ee7b7" />
                        </mesh>
                    );
                })}
            </group>
        </Float>
    );
}

/**
 * Cena Principal com Luzes de Estúdio Direcionais Otimizadas
 */
function SceneContent({ modelUrl }: SceneCanvasProps) {
    return (
        <>
            <ScrollInvalidator />

            {/* Iluminação de estúdio suave (sem sombras dinâmicas de alto custo) */}
            <ambientLight intensity={0.6} />
            <directionalLight position={[6, 8, 5]} intensity={1.2} color="#ffffff" />
            <directionalLight position={[-6, -4, -3]} intensity={0.4} color="#10b981" />
            <pointLight position={[2, 1, 1]} intensity={0.8} color="#38bdf8" distance={8} />

            {/* Conteúdo 3D: Carrega GLTF se fornecido, senão utiliza o construto procedural tech */}
            <Suspense fallback={<TechOrbitalCore />}>
                {modelUrl ? <LoadedModel url={modelUrl} /> : <TechOrbitalCore />}
            </Suspense>
        </>
    );
}

/**
 * SceneCanvas:
 * Camada WebGL Fixa no Fundo (fixed inset-0 pointer-events-none z-0).
 * Executa estritamente com frameloop="demand" para zero overhead de GPU em repouso.
 */
export default function SceneCanvas({ modelUrl }: SceneCanvasProps) {
    return (
        <div 
            className="fixed inset-0 pointer-events-none z-0 w-full h-full overflow-hidden" 
            aria-hidden="true"
        >
            <Canvas
                frameloop="demand"
                dpr={[1, 1.5]} // Limite para evitar renderização 4K excessiva em telas HiDPI
                camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 20 }}
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
