import { useSyncExternalStore } from 'react';

let active = false;
const owners = new Set<string>();
const listeners = new Set<() => void>();

/** Adjacent scenes can overlap without restoring ambient UI prematurely. */
export function setProjectFocus(next: boolean, owner = 'projects'): void {
    if (next) owners.add(owner);
    else owners.delete(owner);
    const focused = owners.size > 0;
    if (active === focused) return;
    active = focused;
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
