/**
 * MomentumScroller - Decoupled Inertial Physics Engine (Rauno Freiberg / Jesper Landberg)
 * 
 * - Continuous requestAnimationFrame physics loop.
 * - Raw pointer drag input with velocity tracking.
 * - Magnetic snap-to-card damping (stiffness: 220, damping: 25).
 * - Zero scroll hijacking: isolates horizontal drag from natural vertical page scrolling.
 */
export interface MomentumScrollerOptions {
    totalItems: number;
    dragSensitivity?: number; // pixels per slide
    stiffness?: number;
    damping?: number;
    snapResistance?: number;
    onUpdate?: (progress: number, velocity: number) => void;
    onSnap?: (index: number) => void;
}

export class MomentumScroller {
    private totalItems: number;
    private dragSensitivity: number;
    private stiffness: number;
    private damping: number;

    public currentProgress: number = 0;
    public targetProgress: number = 0;
    public velocity: number = 0;
    public isDragging: boolean = false;

    private startX: number = 0;
    private startY: number = 0;
    private startProgress: number = 0;
    private lastX: number = 0;
    private lastTime: number = 0;
    private dragVelocity: number = 0;
    private isHorizontalGesture: boolean | null = null;

    private rafId: number | null = null;
    private isRunning: boolean = false;

    private onUpdate?: (progress: number, velocity: number) => void;
    private onSnap?: (index: number) => void;

    constructor(options: MomentumScrollerOptions) {
        this.totalItems = options.totalItems;
        this.dragSensitivity = options.dragSensitivity || 420;
        this.stiffness = options.stiffness || 220;
        this.damping = options.damping || 25;
        this.onUpdate = options.onUpdate;
        this.onSnap = options.onSnap;

        this.loop = this.loop.bind(this);
    }

    public start(): void {
        if (this.isRunning) return;
        this.isRunning = true;
        this.lastTime = performance.now();
        this.rafId = requestAnimationFrame(this.loop);
    }

    public stop(): void {
        this.isRunning = false;
        if (this.rafId !== null) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    public setTarget(index: number): void {
        this.targetProgress = Math.max(0, Math.min(this.totalItems - 1, index));
        if (this.onSnap) {
            this.onSnap(this.targetProgress);
        }
    }

    public next(): void {
        const nextIndex = Math.round(this.targetProgress) + 1;
        this.setTarget(nextIndex >= this.totalItems ? 0 : nextIndex);
    }

    public prev(): void {
        const prevIndex = Math.round(this.targetProgress) - 1;
        this.setTarget(prevIndex < 0 ? this.totalItems - 1 : prevIndex);
    }

    public handlePointerDown(e: { clientX: number; clientY: number }): void {
        this.isDragging = true;
        this.startX = e.clientX;
        this.startY = e.clientY;
        this.startProgress = this.currentProgress;
        this.lastX = e.clientX;
        this.lastTime = performance.now();
        this.dragVelocity = 0;
        this.isHorizontalGesture = null;
    }

    public handlePointerMove(e: { clientX: number; clientY: number }): boolean {
        if (!this.isDragging) return false;

        const deltaX = e.clientX - this.startX;
        const deltaY = e.clientY - this.startY;

        // Determina se o gesto é primariamente horizontal ou vertical (lock)
        if (this.isHorizontalGesture === null) {
            if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) {
                this.isHorizontalGesture = Math.abs(deltaX) > Math.abs(deltaY);
            }
        }

        // Se o usuário estiver rolando verticalmente a página, libera o evento nativo
        if (this.isHorizontalGesture === false) {
            return false;
        }

        const now = performance.now();
        const dt = Math.max(now - this.lastTime, 1);
        const dx = e.clientX - this.lastX;

        this.dragVelocity = dx / dt; // px / ms
        this.lastX = e.clientX;
        this.lastTime = now;

        const progressDelta = -deltaX / this.dragSensitivity;
        // Permite arraste com elasticidade suave além dos limites
        const rawProgress = this.startProgress + progressDelta;
        this.targetProgress = Math.max(-0.25, Math.min(this.totalItems - 0.75, rawProgress));

        return true;
    }

    public handlePointerUp(): void {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.isHorizontalGesture = null;

        // Projeção com momentum baseado na velocidade do arraste
        const momentum = -this.dragVelocity * 0.18;
        let snapIndex = Math.round(this.targetProgress + momentum);
        snapIndex = Math.max(0, Math.min(this.totalItems - 1, snapIndex));

        this.targetProgress = snapIndex;
        if (this.onSnap) {
            this.onSnap(snapIndex);
        }
    }

    private loop(time: number): void {
        if (!this.isRunning) return;

        // Física de Mola Amortecida (Spring-Damping Math)
        const displacement = this.targetProgress - this.currentProgress;
        const springForce = displacement * (this.stiffness * 0.001);
        const dampingForce = -this.velocity * (this.damping * 0.01);

        const acceleration = springForce + dampingForce;
        this.velocity += acceleration;
        this.currentProgress += this.velocity;

        // Chama callback de atualização para os Shaders WebGL
        if (this.onUpdate) {
            this.onUpdate(this.currentProgress, this.velocity);
        }

        this.rafId = requestAnimationFrame(this.loop);
    }
}
