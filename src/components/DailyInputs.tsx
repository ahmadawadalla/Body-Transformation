import NumberInput from "@/components/NumberInput";

type Props = {
    kcal: number; onKcal: (v: number) => void;
    baseSteps: number; onBaseSteps: (v: number) => void;
    baseSleep: number; onBaseSleep: (v: number) => void;
    pal: number; onPAL: (v: number) => void;
    horizon: number; onHorizon: (v: number) => void;
    allowDecimals: boolean;
};

export default function DailyInputs({
                                        kcal, onKcal, baseSteps, onBaseSteps, baseSleep, onBaseSleep, pal, onPAL, horizon, onHorizon
                                    }: Props) {
    const digitsOnly = (s: string) => /^\d*$/.test(s);
    return (
        <section className="rounded-xl border bg-white p-3 space-y-3">
            <h2 className="font-semibold text-sm">Daily Inputs</h2>

            <label className="block text-xs">Daily Calorie Intake
                <NumberInput
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={kcal}
                    onChangeNumber={(n) => onKcal(n)}
                    allowDecimals={true}
                    commitMode="immediate"             // 👈 live update
                    min={0}
                    placeholder="e.g., 2400 or 2400.5"
                />
                <p className="text-[11px] text-gray-500 mt-1">Specific days can be overridden below.</p>
            </label>

            <label className="block text-xs">Steps per day (baseline)
                <input
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    value={baseSteps.toString()}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (digitsOnly(v)) onBaseSteps(v === "" ? 0 : Math.max(0, Number(v)));
                    }}
                />
            </label>

            <label className="block text-xs">Sleep per day (hours, baseline)
                <NumberInput
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={baseSleep}
                    onChangeNumber={(n) => onBaseSleep(n)}
                    allowDecimals={true}
                    commitMode="immediate"             // 👈 live update
                    min={0}
                    placeholder="e.g., 7 or 7.5"
                />
            </label>

            <label className="block text-xs">Activity
                <select
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={pal}
                    onChange={(e) => onPAL(+e.target.value)}
                >
                    <option value={1.2}>Sedentary — desk work, little/no exercise</option>
                    <option value={1.375}>Light — 1–3 workouts/week</option>
                    <option value={1.55}>Moderate — 3–5 workouts/week</option>
                    <option value={1.725}>Very — 6–7 workouts/week or active job</option>
                    <option value={1.9}>Extra — heavy labor or 2-a-days</option>
                </select>
                <p className="text-[11px] text-gray-500 mt-1">Activity (PAL) scales BMR into total daily burn (TDEE).</p>
            </label>

            <label className="block text-xs">Horizon (days)
                <input
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    value={horizon.toString()}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (digitsOnly(v)) onHorizon(v === "" ? 0 : Math.max(0, Number(v)));
                    }}
                />
            </label>
        </section>
    );
}
