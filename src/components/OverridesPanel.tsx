import { useState } from "react";
import { isoPlusDays } from "@/lib/dateutils";
import NumberInput from "@/components/NumberInput";

export type DayOverride = {
    calories?: number;
    steps?: number;
    sleep?: number;
};

type Overrides = Record<number, DayOverride>;

type Props = {
    horizon: number;
    startISO: string;
    overrides: Overrides;
    onSave: (day: number, override: DayOverride) => void;
    onRemove: (day: number) => void;
    allowDecimals: boolean;
};

export default function OverridesPanel({
                                           horizon,
                                           startISO,
                                           overrides,
                                           onSave,
                                           onRemove,
                                           allowDecimals,
                                       }: Props) {
    const sorted = Object.keys(overrides)
        .map(Number)
        .filter((d) => d >= 0 && d < horizon)
        .sort((a, b) => a - b);

    return (
        <section className="rounded-xl border bg-white p-3 space-y-2">
            <h2 className="font-semibold text-sm">Per-day Overrides</h2>

            <Editor
                horizon={horizon}
                allowDecimals={allowDecimals}
                onSubmit={(day, cal, steps, sleep) =>
                    onSave(day, {
                        calories: isNaN(cal) ? undefined : cal,
                        steps: isNaN(steps) ? undefined : steps,
                        sleep: isNaN(sleep) ? undefined : sleep,
                    })
                }
            />

            {sorted.length > 0 && (
                <div className="mt-2">
                    <h3 className="text-xs font-semibold mb-1">Current overrides</h3>
                    <ul className="space-y-1">
                        {sorted.map((d) => {
                            const date = isoPlusDays(startISO, d);
                            const o = overrides[d];
                            return (
                                <li
                                    key={d}
                                    className="text-xs flex items-center justify-between border rounded px-2 py-1 bg-gray-50"
                                >
                  <span>
                    Day {d} — {date} — {o.calories ?? "-"} kcal
                      {o.steps ? ` · ${o.steps} steps` : ""}
                      {o.sleep ? ` · ${o.sleep}h` : ""}
                  </span>
                                    <button
                                        className="text-red-600 hover:underline"
                                        onClick={() => onRemove(d)}
                                        aria-label={`Remove override for day ${d}`}
                                    >
                                        remove
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}

            <p className="text-[11px] text-gray-500">
                Example: Overate on day 30? Set Day=30 and enter that day’s total
                calories. You can also set steps and sleep.
            </p>
        </section>
    );
}

function Editor({
                    horizon,
                    onSubmit,
                }: {
    horizon: number;
    allowDecimals: boolean;
    onSubmit: (day: number, calories: number, steps: number, sleep: number) => void;
}) {
    const [day, setDay] = useState(30);
    const [cal, setCal] = useState(0);
    const [steps, setSteps] = useState(0);
    const [sleep, setSleep] = useState(0);

    const save = () => {
        const dayNum = Math.max(0, Math.min(day, Math.max(horizon - 1, 0)));
        onSubmit(dayNum, cal, steps, sleep);
    };

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 items-end">
            {/* Day (integer only) */}
            <label className="block text-xs">
                Day #
                <input
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={day.toString()}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (/^\d*$/.test(v)) setDay(v === "" ? 0 : Math.max(0, Number(v)));
                    }}
                />
            </label>

            {/* Calories (toggle decimals) */}
            <label className="block text-xs">
                Calories
                <NumberInput
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={cal}
                    onChangeNumber={(n) => setCal(n)}
                    allowDecimals={true}
                    commitMode="immediate"             // 👈 live
                    min={0}
                    placeholder="e.g., 5400.5"
                />
            </label>

            {/* Steps (integer only) */}
            <label className="block text-xs">
                Steps
                <input
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="e.g., 12000"
                    value={steps.toString()}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (/^\d*$/.test(v)) setSteps(v === "" ? 0 : Number(v));
                    }}
                />
            </label>

            {/* Sleep (toggle decimals) */}
            <label className="block text-xs">
                Sleep (h)
                <NumberInput
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={sleep}
                    onChangeNumber={(n) => setSleep(n)}
                    allowDecimals={true}
                    commitMode="immediate"             // 👈 live
                    min={0}
                    placeholder="e.g., 7.5"
                />
            </label>

            <button
                className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={save}
            >
                Save
            </button>
        </div>
    );
}
