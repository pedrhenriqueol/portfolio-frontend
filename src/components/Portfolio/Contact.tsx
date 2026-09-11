import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';

/* ── Som de tecla mecânica via Web Audio API ── */
function playMechanicalKey(freq = 700, duration = 0.04) {
    try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + duration);
        gain.gain.setValueAtTime(0.035, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + duration);
    } catch (e) {}
}

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/pedrohc.forza@gmail.com';

const SOCIAL_CHANNELS = [
    {
        icon: 'fab fa-linkedin',
        label: 'LinkedIn',
        value: '/in/pedro-henrique-b0a015391',
        href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
    },
    {
        icon: 'fab fa-github',
        label: 'GitHub',
        value: 'github.com/pedrhenriqueol',
        href: 'https://github.com/pedrhenriqueol',
    },
    {
        icon: 'fab fa-instagram',
        label: 'Instagram',
        value: '@pedrherg',
        href: 'https://www.instagram.com/pedrherg',
    },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_ADDRESS = 'pedrohc.forza@gmail.com';

export default function Contact() {
    const { t, lang } = useLanguage();

    const [data, setData] = useState({ name: '', email: '', subject: '', message: '' });
    const [touched, setTouched] = useState({ name: false, email: false, subject: false, message: false });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [copiedEmail, setCopiedEmail] = useState(false);

    // Validação em tempo real
    const errors = {
        name: data.name.trim().length < 2 ? (lang === 'en' ? 'Name must have at least 2 characters.' : lang === 'es' ? 'El nombre debe tener al menos 2 caracteres.' : 'Nome deve ter no mínimo 2 caracteres.') : null,
        email: !EMAIL_REGEX.test(data.email.trim()) ? (lang === 'en' ? 'Please enter a valid email address.' : lang === 'es' ? 'Ingresa un correo electrónico válido.' : 'Insira um e-mail válido.') : null,
        subject: data.subject.trim().length < 3 ? (lang === 'en' ? 'Subject must have at least 3 characters.' : lang === 'es' ? 'El asunto debe tener al menos 3 caracteres.' : 'Assunto deve ter no mínimo 3 caracteres.') : null,
        message: data.message.trim().length < 10 ? (lang === 'en' ? 'Message must have at least 10 characters.' : lang === 'es' ? 'El mensaje debe tener al menos 10 caracteres.' : 'Mensagem deve ter no mínimo 10 caracteres.') : null,
    };

    const isFormValid = !errors.name && !errors.email && !errors.subject && !errors.message;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field: string) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    // Copiar e-mail com 1 clique
    const handleCopyEmail = useCallback(async () => {
        playMechanicalKey(850, 0.04);
        try {
            await navigator.clipboard.writeText(EMAIL_ADDRESS);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2200);
        } catch (e) {
            // Fallback manual se clipboard API for restrita
            const textarea = document.createElement('textarea');
            textarea.value = EMAIL_ADDRESS;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2200);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        if (e && e.preventDefault) e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });

        if (!isFormValid || processing) return;

        playMechanicalKey(950, 0.05);
        setProcessing(true);
        setSubmitError('');
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
                setTouched({ name: false, email: false, subject: false, message: false });
                playMechanicalKey(1200, 0.08);
            } else {
                setSubmitError(t('contact.errorMsg') || 'Erro ao enviar. Tente novamente ou use o e-mail diretamente.');
            }
        } catch {
            setSubmitError(t('contact.errorConn') || 'Erro de conexão. Verifique sua rede.');
        } finally {
            setProcessing(false);
        }
    };

    // Submissão rápida via teclado (Ctrl + Enter ou Cmd + Enter)
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent);
        }
    };

    return (
        <section id="contato" className="py-24 md:py-36 bg-transparent relative overflow-hidden select-text">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* ── Section Header com estética industrial ── */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.07] mb-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80 animate-pulse" />
                        <span className="font-mono text-[11px] tracking-[0.25em] text-neutral-400 uppercase">
                            // 06. CANAIS DE COMUNICAÇÃO &amp; CONTATO
                        </span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {t('contact.title1')} <span className="text-white italic font-serif">{t('contact.title2')}</span>
                    </h2>
                    <p className="text-neutral-400 max-w-xl mx-auto font-sans text-sm sm:text-base leading-relaxed">
                        {t('contact.subtitle')}
                    </p>
                </motion.div>

                {/* ── Layout de Duas Colunas Alinhadas ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

                    {/* ── Coluna Esquerda: Canais Diretos (5 Colunas) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-5"
                    >
                        <div className="bg-[#0c0e14]/70 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6 md:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] h-full flex flex-col justify-between space-y-6">
                            
                            <div>
                                {/* Barra técnica superior */}
                                <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] text-[11px] font-mono text-neutral-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        DIRECT_CHANNELS
                                    </span>
                                    <span className="text-[10px] font-mono text-emerald-400">
                                        ● Resposta habitual: &lt; 24h
                                    </span>
                                </div>

                                <p className="text-neutral-400 text-xs sm:text-[13px] leading-relaxed font-sans mt-4 mb-6">
                                    {t('contact.directMessage')}
                                </p>

                                {/* Lista de canais de comunicação */}
                                <div className="space-y-3">

                                    {/* Cartão de E-mail com Botão Copiar Integrado */}
                                    <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between gap-3 transition-all">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-300 shrink-0">
                                                <i className="fas fa-envelope text-sm" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                                                    E-mail Direto
                                                </p>
                                                <p className="text-xs font-mono text-neutral-200 truncate" title={EMAIL_ADDRESS}>
                                                    {EMAIL_ADDRESS}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={handleCopyEmail}
                                            className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.16] text-[11px] font-mono text-neutral-300 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
                                            title="Copiar endereço de e-mail"
                                        >
                                            {copiedEmail ? (
                                                <>
                                                    <i className="fas fa-check text-emerald-400 text-[10px]" />
                                                    <span className="text-emerald-400 font-medium">Copiado!</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-copy text-[10px]" />
                                                    <span>Copiar</span>
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Redes Sociais no mesmo acabamento dos chips */}
                                    {SOCIAL_CHANNELS.map(({ icon, label, value, href }) => (
                                        <a
                                            key={label}
                                            href={href}
                                            target="_blank"
                                            rel="noreferrer"
                                            onClick={() => playMechanicalKey(700, 0.03)}
                                            className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] hover:border-white/[0.12] flex items-center justify-between transition-all group cursor-pointer select-none"
                                        >
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-neutral-300 group-hover:text-white shrink-0 transition-colors">
                                                    <i className={`${icon} text-sm`} />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">
                                                        {label}
                                                    </p>
                                                    <p className="text-xs font-mono text-neutral-300 group-hover:text-white truncate transition-colors">
                                                        {value}
                                                    </p>
                                                </div>
                                            </div>
                                            <i className="fas fa-arrow-right text-neutral-600 group-hover:text-neutral-300 text-xs transition-all duration-200 group-hover:translate-x-1" />
                                        </a>
                                    ))}

                                </div>
                            </div>

                            {/* Rodapé técnico da coluna esquerda */}
                            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-neutral-500">
                                <span>TIMEZONE: UTC-3 (Fortaleza)</span>
                                <span className="text-emerald-400/80 font-medium">STATUS: ONLINE</span>
                            </div>

                        </div>
                    </motion.div>

                    {/* ── Coluna Direita: Formulário de Transmissão (7 Colunas) ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-[#0c0e14]/70 backdrop-blur-xl border border-white/[0.07] rounded-2xl p-6 md:p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] h-full flex flex-col justify-between">
                            
                            {/* Barra técnica de cabeçalho interno */}
                            <div>
                                <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.05] text-[11px] font-mono text-neutral-400">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        DISPATCH_MESSAGE_SERVICE
                                    </span>
                                    <span className="text-[10px] text-neutral-500">ENCRYPTED: TLS</span>
                                </div>

                                {/* Alertas de Feedback */}
                                <AnimatePresence mode="wait">
                                    {success && (
                                        <motion.div
                                            key="contact-success-alert"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-5 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-3 font-mono text-xs"
                                        >
                                            <i className="fas fa-check-circle text-emerald-400 text-sm shrink-0" />
                                            <span>{t('contact.successMsg') || 'Mensagem transmitida com sucesso! Responderei em breve.'}</span>
                                        </motion.div>
                                    )}

                                    {submitError && (
                                        <motion.div
                                            key="contact-error-alert"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="mb-5 bg-rose-500/[0.08] border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl flex items-center gap-3 font-mono text-xs"
                                        >
                                            <i className="fas fa-exclamation-circle text-rose-400 text-sm shrink-0" />
                                            <span>{submitError}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Formulário com suporte a Ctrl+Enter */}
                                <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="space-y-4" noValidate>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        
                                        {/* Nome */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                                {t('contact.labelName') || t('contact.formName') || 'Nome'}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('name')}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'John Doe' : 'Seu Nome'}
                                                className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border text-neutral-200 placeholder:text-neutral-600 font-sans text-xs md:text-sm transition-all focus:outline-none ${
                                                    touched.name && errors.name
                                                        ? 'border-rose-500/50 bg-rose-500/[0.02] focus:border-rose-400'
                                                        : 'border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.04]'
                                                }`}
                                            />
                                            {touched.name && errors.name && (
                                                <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                                                    {errors.name}
                                                </span>
                                            )}
                                        </div>

                                        {/* E-mail */}
                                        <div className="space-y-1.5">
                                            <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                                {t('contact.labelEmail') || t('contact.formEmail') || 'E-mail'}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('email')}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'john@example.com' : 'seu@email.com'}
                                                className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border text-neutral-200 placeholder:text-neutral-600 font-sans text-xs md:text-sm transition-all focus:outline-none ${
                                                    touched.email && errors.email
                                                        ? 'border-rose-500/50 bg-rose-500/[0.02] focus:border-rose-400'
                                                        : 'border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.04]'
                                                }`}
                                            />
                                            {touched.email && errors.email && (
                                                <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                                                    {errors.email}
                                                </span>
                                            )}
                                        </div>

                                    </div>

                                    {/* Assunto */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                            {t('contact.labelSubject') || t('contact.formSubject') || 'Assunto'}
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={data.subject}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('subject')}
                                            disabled={processing}
                                            placeholder={lang === 'en' ? 'Project inquiry / Opportunity' : 'Oportunidade / Proposta de Projeto'}
                                            className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border text-neutral-200 placeholder:text-neutral-600 font-sans text-xs md:text-sm transition-all focus:outline-none ${
                                                touched.subject && errors.subject
                                                    ? 'border-rose-500/50 bg-rose-500/[0.02] focus:border-rose-400'
                                                    : 'border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.04]'
                                            }`}
                                        />
                                        {touched.subject && errors.subject && (
                                            <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                                                {errors.subject}
                                            </span>
                                        )}
                                    </div>

                                    {/* Mensagem */}
                                    <div className="space-y-1.5">
                                        <label className="block text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                                            {t('contact.labelMessage') || t('contact.formMessage') || 'Mensagem'}
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('message')}
                                            disabled={processing}
                                            placeholder={lang === 'en' ? 'Describe your project or message here...' : 'Descreva seu projeto, desafio ou mensagem aqui...'}
                                            className={`w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border text-neutral-200 placeholder:text-neutral-600 font-sans text-xs md:text-sm transition-all resize-none focus:outline-none ${
                                                touched.message && errors.message
                                                    ? 'border-rose-500/50 bg-rose-500/[0.02] focus:border-rose-400'
                                                    : 'border-white/[0.08] focus:border-emerald-500/50 focus:bg-white/[0.04]'
                                            }`}
                                        />
                                        {touched.message && errors.message && (
                                            <span className="text-[11px] text-rose-400 font-mono mt-1 block">
                                                {errors.message}
                                            </span>
                                        )}
                                    </div>

                                    {/* Botão de Envio Tátil com Atalho de Teclado */}
                                    <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full md:w-auto inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-neutral-200 font-mono text-xs font-semibold tracking-tight transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
                                        >
                                            {processing ? (
                                                <>
                                                    <i className="fas fa-circle-notch fa-spin text-xs" />
                                                    <span>{t('contact.sending') || t('contact.btnSending') || 'Enviando...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{lang === 'en' ? 'Transmit Message' : lang === 'es' ? 'Transmitir Mensaje' : 'Transmitir Mensagem'}</span>
                                                    <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded bg-black/10 text-[10px] text-neutral-600 font-mono">
                                                        Ctrl + ↵
                                                    </kbd>
                                                </>
                                            )}
                                        </button>

                                        <span className="text-[10px] font-mono text-neutral-500 hidden sm:inline">
                                            POST /api/dispatch • 200 OK
                                        </span>
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
