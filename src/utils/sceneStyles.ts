/** Scene writes stay on their owning layers and skip unchanged values. */
export function createSceneStyles() {
    const written = new Map<HTMLElement | SVGElement, Map<string, string>>();
    return {
        set(element: HTMLElement | SVGElement, property: string, value: string) {
            let values = written.get(element);
            if (!values) {
                values = new Map();
                written.set(element, values);
            }
            if (values.get(property) === value) return;
            values.set(property, value);
            element.style.setProperty(property, value);
        },
        clear() {
            written.forEach((values, element) => values.forEach((_, property) => element.style.removeProperty(property)));
            written.clear();
        },
    };
}

export function setSceneInert(element: HTMLElement, inert: boolean) {
    if (element.inert !== inert) element.inert = inert;
}
