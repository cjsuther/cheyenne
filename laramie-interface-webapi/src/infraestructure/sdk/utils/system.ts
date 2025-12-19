import 'expose-gc';

export const callGC = () => {
    if (globalThis && globalThis.gc) globalThis.gc();
}
