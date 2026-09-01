import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagneticButton } from './InteractiveEffects';
import { useLanguage } from '../../context/LanguageContext';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/pedrohc.forza@gmail.com';

const CONTACT_LINKS = [
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
        icon: 'fas fa-envelope',
        label: 'E-mail',
        value: 'pedrohc.forza@gmail.com',
        href: 'https://mail.google.com/mail/?view=cm&fs=1&to=pedrohc.forza@gmail.com',
    },
    {
        icon: 'fab fa-instagram',
        label: 'Instagram',
        value: '@pedrherg',
        href: 'https://www.instagram.com/pedrherg',
    },
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactSection() {
    const { t, lang } = useLanguage();
    const [data, setData]             = useState({ name: '', email: '', subject: '', message: '' });
    const [touched, setTouched]       = useState({ name: false, email: false, subject: false, message: false });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess]       = useState(false);
    const [submitError, setSubmitError] = useState('');

    // Validação em tempo real
    const errors = {
        name: data.name.trim().length < 2 ? (lang === 'en' ? 'Name must have at least 2 characters.' : lang === 'es' ? 'El nombre debe tener al menos 2 caracteres.' : 'Nome deve ter no mínimo 2 caracteres.') : null,
        email: !EMAIL_REGEX.test(data.email.trim()) ? (lang === 'en' ? 'Please enter a valid email address.' : lang === 'es' ? 'Ingresa un correo electrónico válido.' : 'Insira um e-mail válido.') : null,
        subject: data.subject.trim().length < 3 ? (lang === 'en' ? 'Subject must have at least 3 characters.' : lang === 'es' ? 'El asunto debe tener al menos 3 caracteres.' : 'Assunto deve ter no mínimo 3 caracteres.') : null,
        message: data.message.trim().length < 10 ? (lang === 'en' ? 'Message must have at least 10 characters.' : lang === 'es' ? 'El mensaje debe tener al menos 10 caracteres.' : 'Mensagem deve ter no mínimo 10 caracteres.') : null,
    };

    const isFormValid = !errors.name && !errors.email && !errors.subject && !errors.message;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const handleBlur = (field) => {
        setTouched(prev => ({ ...prev, [field]: true }));
    };

    const submit = async (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, subject: true, message: true });

        if (!isFormValid) return;

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
            } else {
                setSubmitError(t('contact.errorMsg') || 'Erro ao enviar. Tente novamente.');
            }
        } catch {
            setSubmitError(t('contact.errorConn') || 'Erro de conexão. Verifique sua rede.');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <section id="contato" className="grid-bg py-20 md:py-24 bg-dark relative border-t border-primary/30 overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-12"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('contact.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-3">
                        {t('contact.title1')} <span className="text-accent italic font-serif">{t('contact.title2')}</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto font-sans text-sm sm:text-base">
                        {t('contact.subtitle')}
                    </p>
                </motion.div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Left: Contact Info ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="lg:col-span-2 flex flex-col gap-3.5"
                    >
                        <p className="text-gray-400 text-sm leading-relaxed mb-1 font-sans">
                            {t('contact.directMessage')}
                        </p>

                        {CONTACT_LINKS.map(({ icon, label, value, href }, idx) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.08 }}
                                whileHover={{ x: 4 }}
                                data-cursor-morph="true"
                                className="group flex items-center gap-3.5 p-3.5 rounded-xl border border-primary/20 bg-darker/60 hover:border-accent/40 hover:bg-accent/5 transition-all duration-200 cursor-pointer"
                            >
                                <span
                                    className="flex items-center justify-center w-10 h-10 rounded-lg shrink-0 bg-accent/10 border border-accent/20 transition-all duration-200"
                                >
                                    <i className={`${icon} text-lg text-accent`} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-[11px] text-gray-400 mb-0.5 font-sans">{label}</p>
                                    <p className="text-xs sm:text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors font-mono">
                                        {value}
                                    </p>
                                </div>
                                <i className="fas fa-arrow-right ml-auto text-gray-600 group-hover:text-accent text-xs transition-all duration-200 group-hover:translate-x-1" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* ── Right: Form com Validação em Tempo Real ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="relative bg-darker/90 border border-primary/25 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

                            <AnimatePresence>
                                {success && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-6 bg-green-500/10 border border-green-500/30 text-green-300 px-4 py-3 rounded-xl flex items-center gap-3 font-sans text-xs sm:text-sm"
                                    >
                                        <i className="fas fa-check-circle text-green-400 text-lg shrink-0" />
                                        <span>{t('contact.successMsg') || 'Mensagem enviada com sucesso! Responderei em breve.'}</span>
                                    </motion.div>
                                )}

                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-6 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-3 font-sans text-xs sm:text-sm"
                                    >
                                        <i className="fas fa-exclamation-circle text-red-400 text-lg shrink-0" />
                                        <span>{submitError}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <form onSubmit={submit} className="space-y-4 font-sans" noValidate>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {/* Nome */}
                                    <div>
                                        <label className="block text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5 font-mono">
                                            {t('contact.labelName') || t('contact.formName') || 'Nome'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('name')}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'John Doe' : 'Seu Nome'}
                                                className={`w-full bg-dark/70 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-primary/30 outline-hidden transition-all duration-200 ${
                                                    touched.name && errors.name
                                                        ? 'border-red-500/60 bg-red-500/5 focus:border-red-400'
                                                        : touched.name && !errors.name
                                                        ? 'border-green-500/50 focus:border-accent'
                                                        : 'border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent/30'
                                                }`}
                                            />
                                            {touched.name && !errors.name && (
                                                <i className="fas fa-check text-green-400 text-xs absolute right-3 top-3.5 pointer-events-none" />
                                            )}
                                        </div>
                                        {touched.name && errors.name && (
                                            <span className="text-[11px] text-red-400 font-mono mt-1 block">
                                                {errors.name}
                                            </span>
                                        )}
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <label className="block text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5 font-mono">
                                            {t('contact.labelEmail') || t('contact.formEmail') || 'E-mail'}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                onChange={handleChange}
                                                onBlur={() => handleBlur('email')}
                                                disabled={processing}
                                                placeholder={lang === 'en' ? 'john@example.com' : 'seu@email.com'}
                                                className={`w-full bg-dark/70 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-primary/30 outline-hidden transition-all duration-200 ${
                                                    touched.email && errors.email
                                                        ? 'border-red-500/60 bg-red-500/5 focus:border-red-400'
                                                        : touched.email && !errors.email
                                                        ? 'border-green-500/50 focus:border-accent'
                                                        : 'border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent/30'
                                                }`}
                                            />
                                            {touched.email && !errors.email && (
                                                <i className="fas fa-check text-green-400 text-xs absolute right-3 top-3.5 pointer-events-none" />
                                            )}
                                        </div>
                                        {touched.email && errors.email && (
                                            <span className="text-[11px] text-red-400 font-mono mt-1 block">
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Assunto */}
                                <div>
                                    <label className="block text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5 font-mono">
                                        {t('contact.labelSubject') || t('contact.formSubject') || 'Assunto'}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="subject"
                                            value={data.subject}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('subject')}
                                            disabled={processing}
                                            placeholder={lang === 'en' ? 'Project inquiry / Opportunity' : 'Oportunidade / Proposta de Projeto'}
                                            className={`w-full bg-dark/70 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-primary/30 outline-hidden transition-all duration-200 ${
                                                touched.subject && errors.subject
                                                    ? 'border-red-500/60 bg-red-500/5 focus:border-red-400'
                                                    : touched.subject && !errors.subject
                                                    ? 'border-green-500/50 focus:border-accent'
                                                    : 'border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent/30'
                                            }`}
                                        />
                                        {touched.subject && !errors.subject && (
                                            <i className="fas fa-check text-green-400 text-xs absolute right-3 top-3.5 pointer-events-none" />
                                        )}
                                    </div>
                                    {touched.subject && errors.subject && (
                                        <span className="text-[11px] text-red-400 font-mono mt-1 block">
                                            {errors.subject}
                                        </span>
                                    )}
                                </div>

                                {/* Mensagem */}
                                <div>
                                    <label className="block text-xs font-semibold text-primary/80 uppercase tracking-wider mb-1.5 font-mono">
                                        {t('contact.labelMessage') || t('contact.formMessage') || 'Mensagem'}
                                    </label>
                                    <div className="relative">
                                        <textarea
                                            name="message"
                                            rows={4}
                                            value={data.message}
                                            onChange={handleChange}
                                            onBlur={() => handleBlur('message')}
                                            disabled={processing}
                                            placeholder={lang === 'en' ? 'Describe your project or message here...' : 'Descreva seu projeto, desafio ou mensagem aqui...'}
                                            className={`w-full bg-dark/70 border rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-primary/30 outline-hidden transition-all duration-200 resize-none ${
                                                touched.message && errors.message
                                                    ? 'border-red-500/60 bg-red-500/5 focus:border-red-400'
                                                    : touched.message && !errors.message
                                                    ? 'border-green-500/50 focus:border-accent'
                                                    : 'border-primary/20 focus:border-accent focus:ring-1 focus:ring-accent/30'
                                            }`}
                                        />
                                    </div>
                                    {touched.message && errors.message && (
                                        <span className="text-[11px] text-red-400 font-mono mt-1 block">
                                            {errors.message}
                                        </span>
                                    )}
                                </div>

                                {/* Submit button */}
                                <div className="pt-2">
                                    <MagneticButton strength={0.3}>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            data-cursor-morph="true"
                                            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-darker font-semibold py-3 px-6 rounded-xl hover:bg-accent-hover transition-all duration-200 shadow-md hover:shadow-accent/20 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99] focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-hidden"
                                        >
                                            {processing ? (
                                                <>
                                                    <i className="fas fa-circle-notch fa-spin text-sm" />
                                                    <span>{t('contact.sending') || t('contact.btnSending') || 'Enviando...'}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-paper-plane text-xs" />
                                                    <span>{t('contact.submitBtn') || t('contact.btnSend') || 'Enviar Mensagem'}</span>
                                                </>
                                            )}
                                        </button>
                                    </MagneticButton>
                                </div>
                            </form>
                        </div>
                    </motion.div>

                </div>

            </div>
        </section>
    );
}
