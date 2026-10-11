import { useSyncExternalStore } from 'react';

let active = false;
const listeners = new Set<() => void>();

export function setProjectFocus(next: boolean): void {
    if (active === next) return;
    active = next;
    listeners.forEach(listener => listener());
}

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
};
const snapshot = () => active;
export function useProjectFocus(): boolean {
    return useSyncExternalStore(subscribe, snapshot, () => false);
}
