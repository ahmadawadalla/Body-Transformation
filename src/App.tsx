import { useMemo, useState } from "react";
import { initialState, simulate, mifflinStJeor } from "@/engine/simulation";
import { kgToLb, cmToInches } from "@/lib/units";
import { bodyFatNavyFemale, bodyFatNavyMale } from "@/lib/bodyfat";
import { isoPlusDays, todayISO } from "@/lib/dateutils";
import ProfileForm, { type Sex } from "@/components/ProfileForm";
import MeasurementsForm from "@/components/MeasurementsForm";
import DailyInputs from "@/components/DailyInputs";
import OverridesPanel, { type DayOverride } from "@/components/OverridesPanel";
import Charts from "@/components/Charts";

type Overrides = Record<number, DayOverride>;

export default function App() {
    // Profile
    const [sex, setSex] = useState<Sex>("male");
    const [height_cm, setH] = useState(178);
    const [weight_kg, setW] = useState(80);
    const [age, setAge] = useState(24);

    // Measurements (inches)
    const [neckIn, setNeckIn] = useState(15);
    const [waistIn, setWaistIn] = useState(32);
    const [hipIn, setHipIn] = useState(38); // only for female

    // Daily inputs
    const [kcal, setKcal] = useState(2400);
    const [pal, setPAL] = useState(1.55);
    const [horizon, setHorizon] = useState(365);
    const [baseSteps, setBaseSteps] = useState(6000);
    const [baseSleep, setBaseSleep] = useState(7);

    // Overrides
    const [overrides, setOverrides] = useState<Overrides>({});

    // NEW: global decimal toggle
    const [allowDecimals] = useState(true);

    const startISO = todayISO();
    const endISO = isoPlusDays(startISO, Math.max(horizon, 1));

    // BF% estimate from measurements
    const bfEstimate = useMemo(() => {
        const h_in = Math.max(1, Math.round(cmToInches(height_cm)));
        const n = Math.max(1, neckIn);
        const w = Math.max(1, waistIn);
        if (sex === "male") return +bodyFatNavyMale(h_in, n, w).toFixed(1);
        return +bodyFatNavyFemale(h_in, n, w, Math.max(1, hipIn)).toFixed(1);
    }, [sex, height_cm, neckIn, waistIn, hipIn]);

    // Metabolism
    const bmr = useMemo(() => mifflinStJeor(weight_kg, height_cm, age, sex), [weight_kg, height_cm, age, sex]);
    const tdee = useMemo(() => bmr * pal, [bmr, pal]);

    // Daily getters
    const dailyCalories = (d: number) => typeof overrides[d]?.calories === "number" ? overrides[d]!.calories! : kcal;
    const dailySteps    = (d: number) => typeof overrides[d]?.steps    === "number" ? overrides[d]!.steps!    : baseSteps;
    const dailySleep    = (d: number) => typeof overrides[d]?.sleep    === "number" ? overrides[d]!.sleep!    : baseSleep;

    // Simulation
    const series = useMemo(() => {
        const start = initialState(weight_kg, bfEstimate);
        const sim = simulate(
            start, horizon,
            (d) => dailyCalories(d),
            () => tdee,
            (d) => ({ steps: dailySteps(d), sleepHours: dailySleep(d) })
        );
        return sim.map((s) => ({
            day: s.day,
            date: isoPlusDays(startISO, s.day),
            weight_lb: +kgToLb(s.weight_kg).toFixed(1),
            lean_lb: +kgToLb(s.lean_kg).toFixed(1),
            bf: +s.bf_percent.toFixed(1),
        }));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [weight_kg, bfEstimate, kcal, tdee, horizon, overrides, baseSteps, baseSleep]);

    // Overrides handlers
    const saveOverride = (d: number, o: DayOverride) =>
        setOverrides((prev) => ({ ...prev, [d]: { ...prev[d], ...o } }));
    const removeOverride = (d: number) =>
        setOverrides((prev) => { const c = { ...prev }; delete c[d]; return c; });

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <header className="p-4 sm:p-6 border-b bg-white">
                <h1 className="text-xl sm:text-2xl font-bold">Future You</h1>
                <p className="text-gray-500">
                    Range: <span className="font-medium">{startISO}</span> → <span className="font-medium">{endISO}</span>
                </p>
            </header>

            <main className="p-4 sm:p-6 grid gap-4 lg:grid-cols-3">
                {/* LEFT: inputs */}
                <div className="lg:col-span-1 space-y-3">
                    <ProfileForm
                        sex={sex} onSex={setSex}
                        height_cm={height_cm} onHeightCm={setH}
                        weight_kg={weight_kg} onWeightKg={setW}
                        age={age} onAge={setAge}
                        allowDecimals={allowDecimals}
                    />
                    <MeasurementsForm
                        sex={sex}
                        height_cm={height_cm}
                        neckIn={neckIn} onNeckIn={setNeckIn}
                        waistIn={waistIn} onWaistIn={setWaistIn}
                        hipIn={hipIn} onHipIn={setHipIn}
                        allowDecimals={allowDecimals}
                    />
                    <DailyInputs
                        kcal={kcal} onKcal={setKcal}
                        baseSteps={baseSteps} onBaseSteps={setBaseSteps}
                        baseSleep={baseSleep} onBaseSleep={setBaseSleep}
                        pal={pal} onPAL={setPAL}
                        horizon={horizon} onHorizon={setHorizon}
                        allowDecimals={allowDecimals}
                    />
                    <OverridesPanel
                        horizon={horizon}
                        startISO={startISO}
                        overrides={overrides}
                        onSave={saveOverride}
                        onRemove={removeOverride}
                        allowDecimals={allowDecimals}
                    />
                </div>

                {/* RIGHT: charts */}
                <Charts series={series} />
            </main>
        </div>
    );
}
