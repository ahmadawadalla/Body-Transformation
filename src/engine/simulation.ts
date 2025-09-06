// src/engine/simulation.ts

export type State = {
    day: number;
    weight_kg: number;
    bf_percent: number;
    lean_kg: number;
    fat_kg: number;
};

export type DayMods = {
    steps?: number;       // ~0..30k
    sleepHours?: number;  // ~4..10
};

export function mifflinStJeor(
    weight_kg: number,
    height_cm: number,
    age: number,
    sex: "male" | "female"
) {
    const s = sex === "male" ? 5 : -161;
    return 10 * weight_kg + 6.25 * height_cm - 5 * age + s;
}

export function initialState(weight_kg: number, bf_percent: number): State {
    const fat_kg = weight_kg * (bf_percent / 100);
    const lean_kg = weight_kg - fat_kg;
    return { day: 0, weight_kg, bf_percent, lean_kg, fat_kg };
}

/**
 * One-day update using energy balance with lean/fat partitioning.
 * - Steps add NEAT burn (~0.04 kcal/step)
 * - Sleep shifts partitioning (better sleep = protect/gain lean)
 */
export function stepDay(
    s: State,
    tdee: number,
    calories: number,
    leanBias = 0.35,
    mods?: DayMods
): State {
    const extraBurn = (mods?.steps ?? 0) * 0.04; // kcal
    const sleep = mods?.sleepHours ?? 7;
    const sleepProtect = Math.max(-0.05, Math.min(0.05, (sleep - 7) * 0.02));

    const dW = (calories - tdee - extraBurn) / 7700; // kg/day
    let dLean = 0,
        dFat = 0;

    if (dW >= 0) {
        const leanFrac = Math.max(0.15, Math.min(0.7, leanBias + sleepProtect));
        dLean = Math.min(leanFrac * dW, 0.008); // ~8 g/day cap
        dFat = dW - dLean;
    } else {
        const leanLossFrac = Math.max(0.02, Math.min(0.25, 0.15 - sleepProtect));
        dLean = Math.max(dW * leanLossFrac, -0.0015); // ~1.5 g/day cap
        dFat = dW - dLean;
    }

    const lean = Math.max(30, s.lean_kg + dLean);
    const fat = Math.max(3, s.fat_kg + dFat);
    const wt = lean + fat;
    const bf = Math.min(60, Math.max(3, (100 * fat) / wt));

    return { day: s.day + 1, weight_kg: wt, bf_percent: bf, lean_kg: lean, fat_kg: fat };
}

export function simulate(
    start: State,
    days: number,
    dailyCalories: (d: number) => number,
    dailyTDEE: (d: number) => number,
    dailyMods?: (d: number) => DayMods
) {
    const out: State[] = [start];
    let s = start;
    for (let d = 0; d < days; d++) {
        s = stepDay(s, dailyTDEE(d), dailyCalories(d), 0.35, dailyMods?.(d));
        out.push(s);
    }
    return out;
}
