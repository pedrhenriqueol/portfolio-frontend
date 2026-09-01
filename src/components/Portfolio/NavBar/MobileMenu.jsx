import { motion, AnimatePresence } from 'framer-motion';
import LanguageDropdown from './LanguageDropdown';
import ThemeDropdown from './ThemeDropdown';

export default function MobileMenu({ isOpen, navLinks, active, scrollTo, onClose, t }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="md:hidden overflow-hidden border-b border-primary/20 bg-darker/98 backdrop-blur-2xl"
                >
                    <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col">
                        {/* Mobile Language Selector */}
                        <LanguageDropdown isMobile onSelect={onClose} />

                        {/* Mobile Palette Selector */}
                        <ThemeDropdown isMobile onSelect={onClose} />

                        {/* Navigation Links */}
                        {[...navLinks, { id: 'contato', label: t('nav.contato') }].map(({ id, label }, i) => (
                            <motion.button
                                key={id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.045 }}
                                onClick={() => scrollTo(id)}
                                className={`w-full text-left py-4 text-[11px] tracking-[0.22em] uppercase font-medium border-b transition-colors duration-200 flex items-center justify-between cursor-pointer ${
                                    active === id
                                        ? 'text-accent border-white/10'
                                        : 'text-primary border-white/5 hover:text-secondary'
                                }`}
                            >
                                {label}
                                {active === id && (
                                    <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
