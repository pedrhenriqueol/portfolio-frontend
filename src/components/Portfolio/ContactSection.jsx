import { useState } from 'react';
import { motion } from 'framer-motion';
import { MagneticButton } from './InteractiveEffects';
import { useLanguage } from '../../context/LanguageContext';

const FORM_ENDPOINT = 'https://formsubmit.co/ajax/pedrohc.forza@gmail.com';

const CONTACT_LINKS = [
    {
        icon: 'fab fa-linkedin',
        label: 'LinkedIn',
        value: '/in/pedro-henrique-b0a015391',
        href: 'https://www.linkedin.com/in/pedro-henrique-b0a015391/',
        color: '#0A66C2',
    },
    {
        icon: 'fab fa-github',
        label: 'GitHub',
        value: 'github.com/pedrhenriqueol',
        href: 'https://github.com/pedrhenriqueol',
        color: '#C9A84C',
    },
    {
        icon: 'fas fa-envelope',
        label: 'E-mail',
        value: 'pedrohc.forza@gmail.com',
        href: 'https://mail.google.com/mail/?view=cm&fs=1&to=pedrohc.forza@gmail.com',
        color: '#F59E0B',
    },
    {
        icon: 'fab fa-instagram',
        label: 'Instagram',
        value: '@pedrherg',
        href: 'https://www.instagram.com/pedrherg',
        color: '#E1306C',
    },
];

export default function ContactSection() {
    const { t } = useLanguage();
    const [data, setData]     = useState({ name: '', email: '', subject: '', message: '' });
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess]   = useState(false);
    const [error, setError]       = useState('');

    const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

    const submit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');
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
                setError(t('contact.errorMsg'));
            }
        } catch {
            setError(t('contact.errorConn'));
        }
        setProcessing(false);
    };

    return (
        <section id="contato" className="grid-bg py-24 bg-dark relative border-t border-primary/30 overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <span className="text-accent text-[11px] font-semibold tracking-[0.25em] uppercase mb-2 block font-sans">
                        {t('contact.tag')}
                    </span>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">
                        {t('contact.title1')} <span className="text-accent italic font-serif">{t('contact.title2')}</span>
                    </h2>
                    <p className="text-gray-400 max-w-xl mx-auto font-sans text-sm sm:text-base">
                        {t('contact.subtitle')}
                    </p>
                </motion.div>

                {/* Two-column layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                    {/* ── Left: contact info ── */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-2 flex flex-col gap-4"
                    >
                        <p className="text-gray-400 leading-relaxed mb-2">
                            {t('contact.directMessage')}
                        </p>

                        {CONTACT_LINKS.map(({ icon, label, value, href, color }, idx) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noreferrer"
                                initial={{ opacity: 0, x: -24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ x: 6 }}
                                className="group flex items-center gap-4 p-4 rounded-xl border border-primary/20 bg-darker/60 hover:border-opacity-60 transition-all duration-300"
                                style={{ '--card-color': color }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = `${color}50`;
                                    e.currentTarget.style.boxShadow   = `0 0 20px ${color}18`;
                                    e.currentTarget.style.background   = `${color}08`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(197,198,199,0.2)';
                                    e.currentTarget.style.boxShadow   = 'none';
                                    e.currentTarget.style.background   = 'rgba(31,40,51,0.6)';
                                }}
                            >
                                <span
                                    className="flex items-center justify-center w-11 h-11 rounded-lg shrink-0 transition-all duration-300"
                                    style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                                >
                                    <i className={`${icon} text-xl`} style={{ color }} />
                                </span>
                                <div className="min-w-0">
                                    <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                                    <p className="text-sm font-medium text-gray-200 truncate group-hover:text-white transition-colors">
                                        {value}
                                    </p>
                                </div>
                                <i className="fas fa-arrow-right ml-auto text-gray-600 group-hover:text-gray-300 text-sm transition-all duration-300 group-hover:translate-x-1" />
                            </motion.a>
                        ))}
                    </motion.div>

                    {/* ── Right: form ── */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        className="lg:col-span-3"
                    >
                        <div className="relative bg-darker/80 border border-primary/25 rounded-2xl p-8 md:p-10 shadow-2xl backdrop-blur-sm">
                            {/* Top glow bar */}
                            <div className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1,  y: 0 }}
                                    className="mb-6 bg-secondary/10 border border-secondary/40 text-secondary px-4 py-3 rounded-xl flex items-center gap-3"
                                >
                                    <i className="fas fa-check-circle text-xl shrink-0" />
                                    <span className="text-sm">{t('contact.successMsg')}</span>
                                </motion.div>
                            )}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1,  y: 0 }}
                                    className="mb-6 bg-red-900/15 border border-red-500/40 text-red-400 px-4 py-3 rounded-xl flex items-center gap-3"
                                >
                                    <i className="fas fa-exclamation-circle text-xl shrink-0" />
                                    <span className="text-sm">{error}</span>
                                </motion.div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    {[
                                        { id: 'name',  label: t('contact.formName'),   type: 'text',  placeholder: '' },
                                        { id: 'email', label: t('contact.formEmail'), type: 'email', placeholder: '' },
                                    ].map(({ id, label, type }) => (
                                        <div key={id}>
                                            <label htmlFor={id} className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                                {label}
                                            </label>
                                            <input
                                                type={type}
                                                id={id}
                                                name={id}
                                                value={data[id]}
                                                onChange={handleChange}
                                                required
                                                className="w-full bg-dark/80 border border-primary/25 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-secondary/70 focus:ring-1 focus:ring-secondary/30 focus:bg-dark transition-all duration-200"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label htmlFor="subject" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        {t('contact.formSubject')}
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={data.subject}
                                        onChange={handleChange}
                                        placeholder={t('contact.formSubjectPlaceholder')}
                                        required
                                        className="w-full bg-dark/80 border border-primary/25 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-secondary/70 focus:ring-1 focus:ring-secondary/30 focus:bg-dark transition-all duration-200"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                                        {t('contact.formMessage')}
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={data.message}
                                        onChange={handleChange}
                                        rows="5"
                                        placeholder={t('contact.formMessagePlaceholder')}
                                        required
                                        className="w-full bg-dark/80 border border-primary/25 text-white rounded-xl px-4 py-3 text-sm placeholder-gray-600 focus:outline-none focus:border-secondary/70 focus:ring-1 focus:ring-secondary/30 focus:bg-dark transition-all duration-200 resize-none"
                                    />
                                </div>

                                <MagneticButton strength={0.25} className="w-full">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        id="btn-enviar-mensagem"
                                        className={`w-full relative overflow-hidden bg-accent text-darker font-bold py-4 rounded-xl text-sm hover:bg-accent-hover transition-all duration-300 flex items-center justify-center gap-2 group ${processing ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    >
                                        {/* Shimmer effect */}
                                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
                                        {processing ? (
                                            <><i className="fas fa-spinner fa-spin" /><span>{t('contact.btnSending')}</span></>
                                        ) : (
                                            <><span>{t('contact.btnSend')}</span><i className="fas fa-paper-plane group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" /></>
                                        )}
                                    </button>
                                </MagneticButton>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
