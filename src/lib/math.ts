export function clamp(x: number, min: number, max: number) {
    return Math.min(Math.max(x, min), max);
}

export function slidingWindow<T>(arr: T[], size: number) {
    return arr.reduce((acc: T[][], _, i) => {
        if (i + size >= arr.length) return acc;
        return acc.concat([arr.slice(i, i+size)]);
    }, [])
}