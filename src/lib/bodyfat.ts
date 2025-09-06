// src/lib/bodyfat.ts
// U.S. Navy body fat estimate (tape measure method), inches in, % out.

export function bodyFatNavyMale(height_in: number, neck_in: number, waist_in: number): number {
    const wmn = Math.max(waist_in - neck_in, 0.1);
    const bf = 86.010 * Math.log10(wmn) - 70.041 * Math.log10(height_in) + 36.76;
    return clamp(bf, 3, 60);
}

export function bodyFatNavyFemale(
    height_in: number,
    neck_in: number,
    waist_in: number,
    hip_in: number
): number {
    const whn = Math.max(waist_in + hip_in - neck_in, 0.1);
    const bf = 163.205 * Math.log10(whn) - 97.684 * Math.log10(height_in) - 78.387;
    return clamp(bf, 5, 60);
}

function clamp(x: number, lo: number, hi: number) {
    return Math.max(lo, Math.min(hi, x));
}
