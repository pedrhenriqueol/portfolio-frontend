import React, { useState, useCallback, useMemo, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/pedrohc.forza@gmail.com';
const EMAIL_ADDRESS = 'pedrohc.forza@gmail.com';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Contact() {
    const { t, lang = 'pt' } = useLanguage();

    const [data, setData] = useState({ name: '', email: '', subject: '', message: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [copiedEmail, setCopiedEmail] = useState(false);

    const socialLinks = useMemo(() => [
        {
            icon: 'fab fa-linkedin',
            label: 'LinkedIn',
            subtitle: lang === 'en' ? 'Professional profile' : lang === 'es' ? 'Perfil profesional' : 'Perfil profissional',
            href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
        },
        {
            icon: 'fab fa-github',
            label: 'GitHub',
            subtitle: lang === 'en' ? 'Repositories & projects' : lang === 'es' ? 'Repositorios y proyectos' : 'Repositórios e projetos',
            href: 'https://github.com/pedrhenriqueol',
        },
        {
            icon: 'fab fa-instagram',
            label: 'Instagram',
            subtitle: lang === 'en' ? 'Personal network' : lang === 'es' ? 'Red personal' : 'Rede pessoal',
            href: 'https://www.instagram.com/pedrherg',
        },
    ], [lang]);

    // Spotlight direto via DOM Custom Properties (Zero Re-renders de Estado)
    const handleCardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    }, []);

    // Easter Egg sutil: detecta termos de contratação no assunto
    const isProposalMode = Boolean(
        data.subject &&
        /\b(vaga|proposta|entrevista|contratar|oportunidade|hiring|job|interview)\b/i.test(data.subject)
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
        if (errorMessage) setErrorMessage('');
    };

    // Copiar e-mail com 1 clique de forma silenciosa
    const handleCopyEmail = useCallback(async () => {
        try {
            await navigator.clipboard.writeText(EMAIL_ADDRESS);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = EMAIL_ADDRESS;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        if (e && e.preventDefault) e.preventDefault();

        const trimmedName = data.name.trim();
        const trimmedEmail = data.email.trim();
        const trimmedSubject = data.subject.trim();
        const trimmedMessage = data.message.trim();

        if (!trimmedName) {
            setErrorMessage(
                lang === 'en' ? 'Please enter your name.' : lang === 'es' ? 'Por favor, ingresa tu nombre.' : 'Por favor, informe seu nome.'
            );
            return;
        }
        if (!EMAIL_REGEX.test(trimmedEmail)) {
            setErrorMessage(
                lang === 'en' ? 'Please enter a valid email address.' : lang === 'es' ? 'Por favor, ingresa un correo válido.' : 'Por favor, informe um e-mail válido.'
            );
            return;
        }
        if (!trimmedSubject) {
            setErrorMessage(
                lang === 'en' ? 'Please enter a subject.' : lang === 'es' ? 'Por favor, completa el asunto.' : 'Por favor, preencha o assunto.'
            );
            return;
        }
        if (trimmedMessage.length < 10) {
            setErrorMessage(
                lang === 'en'
                    ? 'Please write a message with at least 10 characters.'
                    : lang === 'es'
                    ? 'Por favor, escribe un mensaje de al menos 10 caracteres.'
                    : 'Por favor, escreva uma mensagem com pelo menos 10 caracteres.'
            );
            return;
        }

        setProcessing(true);
        setErrorMessage('');
        setSuccess(false);

        try {
            const res = await fetch(FORM_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ ...data, _subject: `Portfólio — ${data.subject}` }),
            });

            if (res.ok) {
                setSuccess(true);
                setData({ name: '', email: '', subject: '', message: '' });
            } else {
                setErrorMessage(
                    t('contact.errorMsg') ||
                    (lang === 'en'
                        ? 'Could not send the message right now. Please try via email or LinkedIn.'
                        : 'Não foi possível enviar a mensagem no momento. Tente pelo e-mail ou LinkedIn.')
                );
            }
        } catch {
            setErrorMessage(
                t('contact.errorConn') ||
                (lang === 'en'
                    ? 'Connection error. Check your network and try again.'
                    : 'Erro de conexão. Verifique sua rede e tente novamente.')
            );
        } finally {
            setProcessing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <section id="contato" className="py-24 md:py-32 bg-transparent relative select-text">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Cabeçalho Limpo da Seção ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span className="text-[11px] tracking-wider text-neutral-400 uppercase font-mono">
                            {t('contact.tag') || (lang === 'en' ? 'Contact' : 'Contato')}
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {t('contact.title1') || (lang === 'en' ? "Let's " : "Vamos ")}
                        <span className="italic font-serif">{t('contact.title2') || (lang === 'en' ? "talk?" : "conversar?")}</span>
                    </h2>
                    <p className="text-neutral-400 max-w-xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
                        {t('contact.subtitle') || (lang === 'en'
                            ? "I am open to new opportunities, collaborations, or discussing software engineering."
                            : "Estou aberto a novas oportunidades, colaborações ou apenas uma boa conversa sobre tecnologia.")}
                    </p>
                </motion.div>

                {/* ── Grid Principal de Dois Cartões (Alinhados e Limpos) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* ── Coluna Esquerda: Canais Diretos (5 Colunas) ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="lg:col-span-5 flex flex-col h-full"
                    >
                        <div
                            onMouseMove={handleCardMouseMove}
                            style={{ transform: 'translateZ(0)' }}
                            className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-6 md:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] h-full flex flex-col justify-between space-y-6 relative overflow-hidden group will-change-transform transition-all duration-200 hover:border-white/[0.12]"
                        >
                            {/* Spotlight monocromático suave */}
                            <div
                                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
                                style={{
                                    background: 'radial-gradient(600px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(255, 255, 255, 0.035), transparent 60%)',
                                }}
                            />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white font-sans">
                                    {lang === 'en' ? 'Direct Channels' : lang === 'es' ? 'Canales Directos' : 'Canais diretos'}
                                </h3>
                                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mt-1.5 mb-6">
                                    {t('contact.directMessage') || (lang === 'en'
                                        ? "Prefer to get straight to the point? Feel free to reach out via any channel below."
                                        : "Sinta-se à vontade para me mandar uma mensagem por aqui ou pelos canais abaixo.")}
                                </p>

                                <div className="space-y-3">
                                    {/* Cartão de E-mail com Botão Copiar */}
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between gap-3 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
                                                <i className="fas fa-envelope text-sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-xs font-medium text-white">{lang === 'en' ? 'Email' : 'E-mail'}</p>
                                                <p className="text-[12px] text-neutral-400 truncate" title={EMAIL_ADDRESS}>
                                                    {EMAIL_ADDRESS}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCopyEmail}
                                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-[11px] font-sans text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                                            title={lang === 'en' ? 'Copy email address' : 'Copiar endereço de e-mail'}
                                        >
                                            {copiedEmail ? (
                                                <>
                                                    <i className="fas fa-check text-emerald-400 text-[10px]" />
                                                    <span className="text-emerald-400 font-medium">
                                                        {lang === 'en' ? 'Copied!' : 'Copiado!'}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-copy text-[10px]" />
                                                    <span>{lang === 'en' ? 'Copy' : 'Copiar'}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Redes Sociais */}
                                    {socialLinks.map(({ icon, label, subtitle, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between transition-all group cursor-pointer select-none"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-300 group-hover:text-white shrink-0 transition-colors">
                                                    <i className={`${icon} text-sm`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-medium text-white group-hover:text-white transition-colors">
                                                        {label}
                                                    </p>
                                                    <p className="text-[12px] text-neutral-400 truncate">
                                                        {subtitle}
                                                    </p>
                                                </div>
                                            </div>
                                            <i className="fas fa-arrow-right text-neutral-600 group-hover:text-neutral-300 text-xs transition-all duration-200 group-hover:translate-x-1" />
                                        </a>
                                    ))}
                                </div>
                            </div>

                            {/* Rodapé humano da coluna esquerda */}
                            <div className="pt-4 border-t border-white/[0.05]">
                                <span className="text-[12px] text-neutral-400">
                                    {lang === 'en'
                                        ? 'Usually reply in less than 24 hours.'
                                        : lang === 'es'
                                        ? 'Suelo responder en menos de 24 horas.'
                                        : 'Normalmente respondo em menos de 24 horas.'}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* ── Coluna Direita: Formulário de Contato ── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="lg:col-span-7 flex flex-col h-full"
                    >
                        <div
                            onMouseMove={handleCardMouseMove}
                            style={{ transform: 'translateZ(0)' }}
                            className="bg-[#0c0e14]/90 backdrop-blur-sm border border-white/[0.07] rounded-2xl p-6 md:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] h-full flex flex-col justify-between relative overflow-hidden group will-change-transform transition-all duration-200 hover:border-white/[0.12]"
                        >
                            {/* Spotlight monocromático suave */}
                            <div
                                className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-0"
                                style={{
                                    background: 'radial-gradient(600px circle at var(--mouse-x, -500px) var(--mouse-y, -500px), rgba(255, 255, 255, 0.035), transparent 60%)',
                                }}
                            />
                            <div className="relative z-10">
                                <h3 className="text-lg font-semibold text-white font-sans mb-1.5">
                                    {lang === 'en' ? 'Send a message' : lang === 'es' ? 'Enviar un mensaje' : 'Mande uma mensagem'}
                                </h3>
                                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed mb-6">
                                    {lang === 'en'
                                        ? 'Fill in the fields below and I will get back to you as soon as possible.'
                                        : lang === 'es'
                                        ? 'Completa los campos a continuación y me pondré en contacto lo antes posible.'
                                        : 'Preencha os campos abaixo e entrarei em contato o mais rápido possível.'}
                                </p>

                                {/* Mensagem de Sucesso */}
                                <AnimatePresence mode="wait">
                                    {success && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -6 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -6 }}
                                            className="mb-5 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2.5 text-xs sm:text-sm"
                                        >
                                            <i className="fas fa-check-circle text-emerald-400 text-sm shrink-0" />
                                            <span>
                                                {t('contact.successMsg') || (lang === 'en'
                                                    ? 'Message sent successfully! I will reach out soon.'
                                                    : 'Mensagem enviada com sucesso! Entrarei em contato em breve.')}
                                            </span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Formulário */}
                                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4" noValidate>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        
                                        {/* Nome */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-neutral-300">
                                                {t('contact.labelName') || (lang === 'en' ? 'Name' : 'Nome')}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'Your name' : 'Como posso te chamar?'}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-white/25 focus:bg-white/[0.04] focus:outline-none text-neutral-200 placeholder:text-neutral-500 text-xs sm:text-sm transition-all"
                                            />
                                        </div>

                                        {/* E-mail */}
                                        <div className="space-y-1.5">
                                            <label className="block text-xs font-medium text-neutral-300">
                                                {t('contact.labelEmail') || (lang === 'en' ? 'Email' : 'E-mail')}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'your.email@company.com' : 'seu.email@exemplo.com'}
                                                className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-white/25 focus:bg-white/[0.04] focus:outline-none text-neutral-200 placeholder:text-neutral-500 text-xs sm:text-sm transition-all"
                                            />
                                        </div>

                                    </div>

                                    {/* Assunto */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-300">
                                            {t('contact.labelSubject') || (lang === 'en' ? 'Subject' : 'Assunto')}
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={data.subject}
                                            onChange={handleChange}
                                            disabled={processing}
                                            placeholder={t('contact.formSubjectPlaceholder') || (lang === 'en' ? 'Opportunity, project or collaboration' : 'Sobre uma oportunidade, projeto ou conversa')}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-white/25 focus:bg-white/[0.04] focus:outline-none text-neutral-200 placeholder:text-neutral-500 text-xs sm:text-sm transition-all"
                                        />
                                    </div>

                                    {/* Mensagem */}
                                    <div className="space-y-1.5">
                                        <label className="block text-xs font-medium text-neutral-300">
                                            {t('contact.labelMessage') || (lang === 'en' ? 'Message' : 'Mensagem')}
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={handleChange}
                                            disabled={processing}
                                            placeholder={t('contact.formMessagePlaceholder') || (lang === 'en' ? 'Write your message here...' : 'Escreva sua mensagem aqui...')}
                                            className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] focus:border-white/25 focus:bg-white/[0.04] focus:outline-none text-neutral-200 placeholder:text-neutral-500 text-xs sm:text-sm transition-all resize-none"
                                        />
                                    </div>

                                    {/* Rodapé do Formulário: Botão + Aviso Suave */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center justify-center gap-2 bg-white text-neutral-900 hover:bg-neutral-200 font-medium text-xs px-5 py-2.5 rounded-xl transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                            >
                                                {processing ? (
                                                    <>
                                                        <i className="fas fa-circle-notch fa-spin text-xs" />
                                                        <span>{t('contact.btnSending') || (lang === 'en' ? 'Sending...' : 'Enviando...')}</span>
                                                    </>
                                                ) : (
                                                    <span>
                                                        {isProposalMode
                                                            ? (lang === 'en' ? 'Send proposal ✦' : 'Enviar proposta ✦')
                                                            : (t('contact.btnSend') || (lang === 'en' ? 'Send message' : 'Enviar mensagem'))}
                                                    </span>
                                                )}
                                            </button>

                                            {/* Micro-badge de alta prioridade sutil */}
                                            {isProposalMode && (
                                                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                                    {lang === 'en' ? 'High priority' : 'Prioridade alta'}
                                                </span>
                                            )}
                                        </div>

                                        {/* Mensagem de Erro Discreta (apenas se houver erro ao submeter) */}
                                        {errorMessage && (
                                            <p className="text-xs text-rose-400/90 font-sans">
                                                {errorMessage}
                                            </p>
                                        )}
                                    </div>
                                </form>
                            </div>

                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}

export default memo(Contact);
