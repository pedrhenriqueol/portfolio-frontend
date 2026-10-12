import type { ProjectArchitecturePreview } from '../types/project';

/** Shared schematic covers. These are architecture diagrams, never product screenshots. */
export const PROJECT_PREVIEWS: Record<number, ProjectArchitecturePreview> = {
    1: {
        kind: 'architecture', composition: 'stack',
        title: { pt: 'Da interface ao dado.', en: 'From interface to data.', es: 'De la interfaz al dato.' },
        caption: 'SPA + REST API',
        nodes: [
            { label: { pt: 'Interface', en: 'Interface', es: 'Interfaz' }, technology: 'React · TypeScript' },
            { label: { pt: 'Autenticação & API', en: 'Authentication & API', es: 'Autenticación & API' }, technology: 'Laravel · Sanctum' },
            { label: { pt: 'Negócio & fiscal', en: 'Business & fiscal', es: 'Negocio & fiscal' }, technology: 'PHP Services · ACBr' },
            { label: { pt: 'Persistência', en: 'Persistence', es: 'Persistencia' }, technology: 'SQL Server · MySQL' },
        ],
    },
    2: {
        kind: 'architecture', composition: 'branch',
        title: { pt: 'Contextos isolados.', en: 'Isolated contexts.', es: 'Contextos aislados.' },
        caption: 'Multi-tenant · RBAC',
        nodes: [
            { label: { pt: 'Portal', en: 'Portal', es: 'Portal' }, technology: 'React · TypeScript' },
            { label: { pt: 'Contexto da unidade', en: 'Business unit context', es: 'Contexto de la unidad' }, technology: 'Tenant Middleware' },
            { label: { pt: 'Controle de acesso', en: 'Access control', es: 'Control de acceso' }, technology: 'RBAC · Policies' },
            { label: { pt: 'Dados por tenant', en: 'Data by tenant', es: 'Datos por tenant' }, technology: 'SQL Server · tenant_id' },
        ],
    },
    3: {
        kind: 'architecture', composition: 'migration',
        title: { pt: 'O legado, na web.', en: 'Legacy, on the web.', es: 'El legado, en la web.' },
        caption: 'Desktop → Web',
        nodes: [
            { label: { pt: 'Origem', en: 'Origin', es: 'Origen' }, technology: 'Delphi · VCL' },
            { label: { pt: 'Ambiente web', en: 'Web environment', es: 'Entorno web' }, technology: 'Delphi 11 · UniGui' },
            { label: { pt: 'Fiscal & relatórios', en: 'Fiscal & reports', es: 'Fiscal & informes' }, technology: 'ACBr · FortesReport' },
            { label: { pt: 'Acesso aos dados', en: 'Data access', es: 'Acceso a datos' }, technology: 'FireDAC · SQL Server' },
        ],
    },
    4: {
        kind: 'architecture', composition: 'pipeline',
        title: { pt: 'Camadas independentes.', en: 'Independent layers.', es: 'Capas independientes.' },
        caption: 'MVC · DAO · JDBC',
        nodes: [
            { label: { pt: 'Apresentação', en: 'Presentation', es: 'Presentación' }, technology: 'Java Swing' },
            { label: { pt: 'Regras & controle', en: 'Rules & control', es: 'Reglas & control' }, technology: 'MVC Controllers' },
            { label: { pt: 'Persistência', en: 'Persistence', es: 'Persistencia' }, technology: 'DAO · JDBC' },
            { label: { pt: 'Banco relacional', en: 'Relational database', es: 'Base relacional' }, technology: 'MySQL' },
        ],
    },
    5: {
        kind: 'architecture', composition: 'request',
        title: { pt: 'Do pedido à resposta.', en: 'From request to response.', es: 'De petición a respuesta.' },
        caption: 'Blueprints · JSON · CORS',
        nodes: [
            { label: { pt: 'Cliente', en: 'Client', es: 'Cliente' }, technology: 'Fetch API · CORS' },
            { label: { pt: 'Rotas modulares', en: 'Modular routes', es: 'Rutas modulares' }, technology: 'Flask Blueprints' },
            { label: { pt: 'Validação', en: 'Validation', es: 'Validación' }, technology: 'JSON Schema' },
            { label: { pt: 'Resposta & exceções', en: 'Response & exceptions', es: 'Respuesta & excepciones' }, technology: 'JSON · HTTP Handlers' },
        ],
    },
    6: {
        kind: 'architecture', composition: 'entropy',
        title: { pt: 'Da entropia à senha.', en: 'From entropy to password.', es: 'De entropía a contraseña.' },
        caption: 'Tkinter · secrets · Regex',
        nodes: [
            { label: { pt: 'Preferências', en: 'Preferences', es: 'Preferencias' }, technology: 'Tkinter' },
            { label: { pt: 'Fonte de entropia', en: 'Entropy source', es: 'Fuente de entropía' }, technology: 'Python secrets' },
            { label: { pt: 'Complexidade', en: 'Complexity', es: 'Complejidad' }, technology: 'Regex' },
            { label: { pt: 'Área de transferência', en: 'Clipboard', es: 'Portapapeles' }, technology: 'Pyperclip' },
        ],
    },
};
