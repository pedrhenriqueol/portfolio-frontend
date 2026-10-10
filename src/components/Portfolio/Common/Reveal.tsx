import { useState, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** One entrance per content group. Never applied to section roots or layers
 * owned by the measured scroll scenes. Focus also reveals offscreen controls. */
export default function Reveal({ children, className = '', delay = 0 }: {
    children: ReactNode;
    className?: string;
    delay?: number;
}) {
    const reduceMotion = useReducedMotion();
    const [focused, setFocused] = useState(false);
    return (
        <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={focused || reduceMotion ? { opacity: 1, y: 0 } : undefined}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: .12, margin: '0px 0px -32px 0px' }}
            transition={{ duration: reduceMotion ? 0 : .65, delay: focused ? 0 : Math.min(delay, .3), ease: [.22, 1, .36, 1] }}
            onFocusCapture={() => setFocused(true)}
            className={className}
        >
            {children}
        </motion.div>
    );
}
