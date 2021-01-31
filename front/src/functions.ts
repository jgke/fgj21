export function shuffle<T>(arr: T[]) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function clamp(a: number, x: number, b: number) {
    if (a > x) {
        return a;
    } else if (b < x) {
        return b;
    }
    return x;
}
