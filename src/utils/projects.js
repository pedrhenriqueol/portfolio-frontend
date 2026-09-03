export const FILTER_ICONS = {
    all:       'fas fa-th-large',
    fullstack: 'fas fa-globe',
    desktop:   'fas fa-desktop',
    backend:   'fas fa-server',
    outros:    'fas fa-code-branch',
};

export const TAG_MAP = {
    fullstack: [
        'React', 'TypeScript', 'Laravel', 'Multi-tenant', 'RBAC', 
        'Dashboard', 'API REST', 'Tailwind CSS', 'Fastify', 'Prisma', 
        'Framer Motion', 'Fintech', 'IoT Telemetry', 'FSM', 
        'OpenAPI', 'Chaos Engineering', 'p95 SLA'
    ],
    desktop:   ['Delphi 11', 'UniGui', 'Java', 'Swing', 'JVCL', 'ACBr', 'FortesReport'],
    backend:   ['PHP', 'Python', 'Flask', 'Node.js', 'MySQL', 'SQL Server', 'PostgreSQL', 'HMAC-SHA256'],
    outros:    ['Tkinter', 'Paradox', 'BDE'],
};

export function projectCategory(project) {
    const tags = project?.tags || [];
    if (tags.some(t => TAG_MAP.fullstack.includes(t))) return 'fullstack';
    if (tags.some(t => TAG_MAP.desktop.includes(t)))   return 'desktop';
    if (tags.some(t => TAG_MAP.backend.includes(t)))   return 'backend';
    return 'outros';
}
