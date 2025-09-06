// src/lib/units.ts
export function kgToLb(kg: number) {
    return kg * 2.20462;
}
export function lbToKg(lb: number) {
    return lb / 2.20462;
}

export function cmToFtIn(cm: number) {
    const totalInches = cm / 2.54;
    const ft = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return { ft, inches };
}
export function ftInToCm(ft: number, inches: number) {
    return (ft * 12 + inches) * 2.54;
}

export function inchesToCm(inches: number) {
    return inches * 2.54;
}
export function cmToInches(cm: number) {
    return cm / 2.54;
}
