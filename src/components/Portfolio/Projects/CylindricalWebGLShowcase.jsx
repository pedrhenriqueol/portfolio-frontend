import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { MomentumScroller } from '../../../lib/momentumScroller';
import { cylindricalVertexShader, cylindricalFragmentShader } from './shaders/cylindricalShaders';
import MagneticButton from '../MagneticButton';
import { playMechanicalClick, playTabSwitch } from '../../../lib/sound';

const FLAGSHIP_CONFIGS = [
    {
        id: 101,
        title: 'PayStream Gateway',
        tagline: 'Motor Transacional de Pagamentos & Split de Liquidação',
        stepLabel: '01 • Motor Transacional',
        badge: 'Fintech de Alta Concorrência',
        stat: 'Idempotência Atômica',
        description: 'Gateway corporativo de pagamentos fintech com liquidação de split multipartes em centavos inteiros, idempotência atômica via restrição P2002 no PostgreSQL e webhooks assinados com HMAC-SHA256 com proteção contra timing attacks.',
        image: '/projects/paystream-dash.png',
        techs: ['Fastify', 'TypeScript', 'Prisma', 'PostgreSQL', 'HMAC-SHA256'],
        url: 'https://paystream-gateaway.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/paystream-gateway',
    },
    {
        id: 102,
        title: 'PortLog OS',
        tagline: 'Operações Portuárias & Telemetria Industrial',
        stepLabel: '02 • Operações Portuárias',
        badge: 'Logística Portuária & ZPEs',
        stat: '100% FSM Válida',
        description: 'Sistema operacional portuário com governança multi-tenant estrita por terminal, máquina de estados finita (FSM) no Kanban de manutenção de guindastes pesados (STS/RTG) e telemetria preditiva IoT em tempo real.',
        image: '/projects/portlog-dash.png',
        techs: ['React', 'TypeScript', 'Fastify', 'Prisma', 'Multi-tenant', 'FSM'],
        url: 'https://portlog-os.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/portlog-os',
    },
    {
        id: 103,
        title: 'SPECTR TestOps',
        tagline: 'Engenharia de Qualidade & Resiliência de APIs',
        stepLabel: '03 • Engenharia de Qualidade',
        badge: 'Observabilidade & TestOps',
        stat: 'NIST Nearest Rank Math',
        description: 'Plataforma corporativa de engenharia de testes com runner isolado, validação recursiva de esquemas OpenAPI/JSON Schema, testes de estresse no Chaos Lab e percentis de cauda p50/p90/p95/p99 padronizados pelo NIST.',
        image: '/projects/spectr-workbench.png',
        techs: ['React 18', 'TypeScript', 'OpenAPI', 'Chaos Lab', 'p95 SLA Math'],
        url: 'https://spectr-testops.vercel.app',
        repo: 'https://github.com/pedrhenriqueol/spectr-testops',
    },
];

/**
 * Cria a textura 2D nítida de alta densidade no Canvas antes de mapear no Three.js
 */
function createCardTexture(project) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 580;
    const ctx = canvas.getContext('2d');

    // Fundo do card
    ctx.fillStyle = '#0E1118';
    ctx.roundRect(10, 10, 1004, 560, 28);
    ctx.fill();

    // Borda elegante
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Mockup / Preview visual (placeholder de fundo enquanto imagem carrega)
    ctx.fillStyle = '#080A0F';
    ctx.roundRect(24, 24, 460, 532, 20);
    ctx.fill();

    // Carrega a imagem real e repinta
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = project.image;
    img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(24, 24, 460, 532, 20);
        ctx.clip();
        ctx.drawImage(img, 24, 24, 460, 532);
        // Gradiente escuro
        const grad = ctx.createLinearGradient(24, 24, 484, 556);
        grad.addColorStop(0, 'rgba(14, 17, 24, 0.1)');
        grad.addColorStop(1, 'rgba(14, 17, 24, 0.8)');
        ctx.fillStyle = grad;
        ctx.fillRect(24, 24, 460, 532);
        ctx.restore();
        texture.needsUpdate = true;
    };

    // Badge
    ctx.fillStyle = 'rgba(217, 119, 87, 0.15)';
    ctx.strokeStyle = 'rgba(217, 119, 87, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.roundRect(510, 48, 230, 36, 18);
    ctx.fill();
    ctx.stroke();
    ctx.font = 'bold 15px monospace';
    ctx.fillStyle = '#D97757';
    ctx.fillText(project.stepLabel, 526, 72);

    // Stat
    ctx.fillStyle = 'rgba(74, 222, 128, 0.12)';
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.3)';
    ctx.roundRect(760, 48, 220, 36, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4ADE80';
    ctx.fillText(project.stat, 778, 72);

    // Título
    ctx.font = 'bold 36px serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(project.title, 510, 140);

    // Tagline
    ctx.font = '19px sans-serif';
    ctx.fillStyle = '#D1D5DB';
    ctx.fillText(project.tagline, 510, 180);

    // Descrição
    ctx.font = '16px sans-serif';
    ctx.fillStyle = '#9CA3AF';
    const words = project.description.split(' ');
    let line = '';
    let y = 230;
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > 470 && n > 0) {
            ctx.fillText(line, 510, y);
            line = words[n] + ' ';
            y += 26;
            if (y > 360) break;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 510, y);

    // Tags de tecnologias
    let tagX = 510;
    const tagY = 410;
    project.techs.slice(0, 4).forEach((tech) => {
        ctx.font = '14px monospace';
        const textWidth = ctx.measureText(tech).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.roundRect(tagX, tagY, textWidth + 24, 32, 10);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = '#E5E7EB';
        ctx.fillText(tech, tagX + 12, tagY + 21);
        tagX += textWidth + 34;
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    return texture;
}

/**
 * CylindricalWebGLShowcase - Showcase Cilíndrico com Shaders GLSL e Three.js
 */
export default function CylindricalWebGLShowcase({ onSelectProject, projects = [] }) {
    const mountRef = useRef(null);
    const canvasRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollerRef = useRef(null);
    const mouseNormRef = useRef({ x: 0, y: 0 });

    const totalSlides = FLAGSHIP_CONFIGS.length;

    // Inicialização do Three.js Scene, Camera, Geometrias Cilíndricas e Shaders
    useEffect(() => {
        const container = mountRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        let width = container.clientWidth;
        let height = container.clientHeight || 480;

        // 1. Cena e Câmera de Perspectiva (Jesper Landberg FOV: 40°)
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
        camera.position.set(0, 0, 4.3);

        // 2. Renderizador WebGL com alta densidade de pixels
        const renderer = new THREE.WebGLRenderer({
            canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height);

        // 3. Geometria de Malha Curvada Côncava (32 subdivisões horizontais)
        const planeGeometry = new THREE.PlaneGeometry(2.55, 1.44, 32, 16);

        // 4. Criação dos 3 meshes com Shaders GLSL customizados
        const meshes = [];
        const textures = [];

        FLAGSHIP_CONFIGS.forEach((project, idx) => {
            const texture = createCardTexture(project);
            textures.push(texture);

            const material = new THREE.ShaderMaterial({
                vertexShader: cylindricalVertexShader,
                fragmentShader: cylindricalFragmentShader,
                uniforms: {
                    uTexture: { value: texture },
                    uMouse: { value: new THREE.Vector2(0, 0) },
                    uVelocity: { value: 0 },
                    uOpacity: { value: 1 },
                    uProgress: { value: 0 },
                    uIndex: { value: idx },
                },
                transparent: true,
                depthWrite: false,
            });

            const mesh = new THREE.Mesh(planeGeometry, material);
            scene.add(mesh);
            meshes.push(mesh);
        });

        // 5. Motor de Física de Inércia & Momentum (Rauno Freiberg / Jesper Landberg)
        const scroller = new MomentumScroller({
            totalItems: totalSlides,
            dragSensitivity: 450,
            stiffness: 220,
            damping: 25,
            onUpdate: (prog, vel) => {
                // Atualiza a posição de cada card na curvatura cilíndrica tridimensional
                const radius = 4.2;
                meshes.forEach((mesh, idx) => {
                    const diff = idx - prog;
                    const angle = diff * 0.58; // ~33 graus radianos

                    mesh.position.x = Math.sin(angle) * radius;
                    mesh.position.z = Math.cos(angle) * radius - radius;
                    mesh.rotation.y = angle;

                    // Passa velocidade e mouse para o Vertex/Fragment Shader
                    mesh.material.uniforms.uVelocity.value = vel * 0.85;
                    mesh.material.uniforms.uOpacity.value = Math.max(0.18, 1.0 - Math.abs(diff) * 0.44);
                    mesh.material.uniforms.uMouse.value.set(mouseNormRef.current.x, mouseNormRef.current.y);

                    const scale = Math.max(0.78, 1.0 - Math.abs(diff) * 0.12);
                    mesh.scale.set(scale, scale, scale);
                });
            },
            onSnap: (snapIdx) => {
                setActiveIndex(snapIdx);
            },
        });

        scrollerRef.current = scroller;
        scroller.start();

        // 6. Raycaster para clique nos cards laterais
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();

        const handleCanvasClick = (e) => {
            const rect = canvas.getBoundingClientRect();
            pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObjects(meshes);

            if (intersects.length > 0) {
                const clickedMesh = intersects[0].object;
                const clickedIndex = meshes.indexOf(clickedMesh);
                if (clickedIndex !== -1 && clickedIndex !== activeIndex) {
                    scroller.setTarget(clickedIndex);
                    playTabSwitch();
                }
            }
        };

        canvas.addEventListener('click', handleCanvasClick);

        // 7. Loop de Renderização e IntersectionObserver para pausar fora da viewport
        let isIntersecting = true;
        let animationFrameId = null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting;
            },
            { threshold: 0.1 }
        );
        observer.observe(container);

        const animate = () => {
            if (isIntersecting) {
                renderer.render(scene, camera);
            }
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);

        // Resize Listener
        const handleResize = () => {
            if (!container) return;
            width = container.clientWidth;
            height = container.clientHeight || 480;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);

        // 8. Descarte Rigoroso de Recursos (GPU Memory Leak Prevention)
        return () => {
            cancelAnimationFrame(animationFrameId);
            scroller.stop();
            observer.disconnect();
            window.removeEventListener('resize', handleResize);
            canvas.removeEventListener('click', handleCanvasClick);

            planeGeometry.dispose();
            textures.forEach((t) => t.dispose());
            meshes.forEach((m) => m.material.dispose());
            renderer.dispose();
        };
    }, [totalSlides]);

    // ── Handlers de Arraste com o Mouse & Touch ──
    const handlePointerDown = (e) => {
        if (!scrollerRef.current) return;
        scrollerRef.current.handlePointerDown({ clientX: e.clientX, clientY: e.clientY });

        const handlePointerMove = (ev) => {
            if (!scrollerRef.current) return;
            const handled = scrollerRef.current.handlePointerMove({ clientX: ev.clientX, clientY: ev.clientY });

            // Atualiza coordenadas relativas do mouse para reflexo especular no fragment shader
            if (canvasRef.current) {
                const rect = canvasRef.current.getBoundingClientRect();
                mouseNormRef.current = {
                    x: ((ev.clientX - rect.left) / rect.width) * 2 - 1,
                    y: -((ev.clientY - rect.top) / rect.height) * 2 + 1,
                };
            }

            if (handled) {
                ev.preventDefault();
            }
        };

        const handlePointerUp = () => {
            if (scrollerRef.current) {
                scrollerRef.current.handlePointerUp();
            }
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerUp);
            window.removeEventListener('pointercancel', handlePointerUp);
        };

        window.addEventListener('pointermove', handlePointerMove, { passive: false });
        window.addEventListener('pointerup', handlePointerUp);
        window.addEventListener('pointercancel', handlePointerUp);
    };

    const handleInspect = (config) => {
        playMechanicalClick();
        if (onSelectProject) {
            const fullProject = projects.find((p) => p.id === config.id) || config;
            onSelectProject(fullProject);
        }
    };

    const navigateTo = useCallback((idx) => {
        if (scrollerRef.current) {
            scrollerRef.current.setTarget(idx);
            playTabSwitch();
        }
    }, []);

    const handlePrev = useCallback(() => {
        if (scrollerRef.current) {
            scrollerRef.current.prev();
            playTabSwitch();
        }
    }, []);

    const handleNext = useCallback(() => {
        if (scrollerRef.current) {
            scrollerRef.current.next();
            playTabSwitch();
        }
    }, []);

    const activeProject = FLAGSHIP_CONFIGS[activeIndex];

    return (
        <section
            id="projetos-destaque"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'ArrowLeft') handlePrev();
                if (e.key === 'ArrowRight') handleNext();
            }}
            className="py-16 md:py-24 bg-darker relative border-t border-primary/20 overflow-hidden focus:outline-none"
        >
            {/* Iluminação de fundo cinemática */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* ── Header da Seção ── */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div>
                        <span className="text-accent text-[11px] font-mono font-bold tracking-[0.25em] uppercase block mb-2">
                            PROJETOS EM DESTAQUE ── ARQUITETURAS EM PRODUÇÃO
                        </span>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white font-bold">
                            Sistemas & Arquiteturas em Produção
                        </h2>
                        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mt-2 font-sans">
                            Viewport tridimensional em WebGL com malha cilíndrica e shaders GLSL de deformação e reflexo especular em tempo real.
                        </p>
                    </div>

                    {/* Controles de Navegação & Dica de Arraste */}
                    <div className="flex items-center gap-4 shrink-0">
                        <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-primary/70 bg-darker/90 px-3.5 py-1.5 rounded-full border border-white/10">
                            <i className="fas fa-cube text-accent text-xs" />
                            <span>Arraste para rotacionar o cilindro WebGL</span>
                        </div>

                        {/* Botões Magnéticos de Navegação */}
                        <div className="flex items-center gap-2">
                            <MagneticButton
                                onClick={handlePrev}
                                aria-label="Projeto Anterior"
                                data-cursor-morph="true"
                                className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                            >
                                <i className="fas fa-chevron-left text-xs" />
                            </MagneticButton>
                            <MagneticButton
                                onClick={handleNext}
                                aria-label="Próximo Projeto"
                                data-cursor-morph="true"
                                className="w-10 h-10 rounded-xl bg-dark/90 border border-white/15 text-primary hover:text-white hover:border-accent/50 transition-colors shadow-sm active:scale-95"
                            >
                                <i className="fas fa-chevron-right text-xs" />
                            </MagneticButton>
                        </div>
                    </div>
                </div>

                {/* ── Indicadores de Progresso com layoutId e Spring Physics ── */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-none py-1">
                    {FLAGSHIP_CONFIGS.map((item, idx) => {
                        const isActive = idx === activeIndex;
                        return (
                            <button
                                key={item.id}
                                onClick={() => navigateTo(idx)}
                                data-cursor-morph="true"
                                className={`relative px-4 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-2.5 cursor-pointer shrink-0 border ${
                                    isActive
                                        ? 'text-accent font-bold border-accent/60'
                                        : 'text-primary/70 border-white/10 hover:text-white hover:border-white/20'
                                }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="webglPillActive"
                                        className="absolute inset-0 bg-accent/15 rounded-xl border border-accent shadow-[0_0_15px_rgba(217,119,87,0.25)]"
                                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                                    />
                                )}
                                <span className={`relative z-10 w-2 h-2 rounded-full ${isActive ? 'bg-accent animate-pulse' : 'bg-white/25'}`} />
                                <span className="relative z-10">{item.stepLabel}</span>
                            </button>
                        );
                    })}
                </div>

                {/* ── Viewport WebGL Three.js com Curvatura Cilíndrica e Shaders GLSL ── */}
                <div
                    ref={mountRef}
                    onPointerDown={handlePointerDown}
                    className="relative w-full h-[460px] sm:h-[480px] lg:h-[500px] rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing select-none border border-white/10 bg-[#07090E]"
                >
                    {/* Canvas Three.js */}
                    <canvas ref={canvasRef} className="w-full h-full block touch-none" />

                    {/* Máscara de Gradiente Lateral (Fade Suave sem Cortes Retos) */}
                    <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 bg-gradient-to-r from-[#07090E] via-[#07090E]/80 to-transparent z-10" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 bg-gradient-to-l from-[#07090E] via-[#07090E]/80 to-transparent z-10" />
                </div>

                {/* ── HUD de Ação Sincronizado do Projeto em Foco ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeProject.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.25 }}
                        className="mt-6 p-4 sm:p-5 rounded-2xl bg-darker/95 border border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-xs font-mono font-bold text-accent bg-accent/15 px-3 py-1 rounded-lg border border-accent/30">
                                {activeProject.stepLabel}
                            </span>
                            <div>
                                <h4 className="text-white font-bold text-sm sm:text-base">{activeProject.title}</h4>
                                <span className="text-primary/70 text-xs font-sans">{activeProject.tagline}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button
                                onClick={() => handleInspect(activeProject)}
                                data-cursor-morph="true"
                                className="flex-1 sm:flex-initial py-2.5 px-4 bg-accent/20 border border-accent/40 hover:bg-accent hover:text-darker text-accent font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
                            >
                                <i className="fas fa-microchip text-xs" />
                                <span>Detalhes Técnicos</span>
                            </button>

                            <MagneticButton
                                as="a"
                                href={activeProject.url}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor-morph="true"
                                className="flex-1 sm:flex-initial py-2.5 px-4 bg-accent text-darker font-bold text-xs rounded-xl hover:bg-accent-hover transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95"
                            >
                                <span>Acessar Demonstração</span>
                                <i className="fas fa-external-link-alt text-[9px]" />
                            </MagneticButton>

                            <MagneticButton
                                as="a"
                                href={activeProject.repo}
                                target="_blank"
                                rel="noreferrer"
                                data-cursor-morph="true"
                                className="p-2.5 bg-dark border border-white/15 text-primary hover:text-white rounded-xl transition-colors active:scale-95"
                                title="Código-Fonte no GitHub"
                            >
                                <i className="fab fa-github text-sm" />
                            </MagneticButton>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Footer de Status */}
                <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-primary/50 gap-2">
                    <span>Renderizador WebGL Three.js • Shaders GLSL de Inércia & Especular</span>
                    <span>Navegação com momentum por arraste • {activeIndex + 1} de {totalSlides}</span>
                </div>
            </div>
        </section>
    );
}
