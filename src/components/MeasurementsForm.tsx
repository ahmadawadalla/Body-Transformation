import { cmToInches } from "@/lib/units";
import { bodyFatNavyFemale, bodyFatNavyMale } from "@/lib/bodyfat";
import type { Sex } from "./ProfileForm";
import NumberInput from "@/components/NumberInput";


type Props = {
    sex: Sex;
    height_cm: number;
    neckIn: number;  onNeckIn: (v: number) => void;
    waistIn: number; onWaistIn: (v: number) => void;
    hipIn: number;   onHipIn: (v: number) => void; // female only
    allowDecimals: boolean;
};

export default function MeasurementsForm({
                                             sex, height_cm, neckIn, onNeckIn, waistIn, onWaistIn, hipIn, onHipIn, allowDecimals
                                         }: Props) {
    const h_in = Math.max(1, Math.round(cmToInches(height_cm)));
    const bfEstimate = sex === "male"
        ? +bodyFatNavyMale(h_in, Math.max(1, neckIn), Math.max(1, waistIn)).toFixed(1)
        : +bodyFatNavyFemale(h_in, Math.max(1, neckIn), Math.max(1, waistIn), Math.max(1, hipIn)).toFixed(1);
    return (
        <section className="rounded-xl border bg-white p-3 space-y-2">
            <h2 className="font-semibold text-sm">Measurements (inches)</h2>
            <div className="grid grid-cols-2 gap-2">
                <label className="block text-xs">Neck (in)
                    <NumberInput
                        className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                        value={neckIn}
                        onChangeNumber={(n) => onNeckIn(n)}
                        allowDecimals={allowDecimals}
                        commitMode="immediate"             // 👈 live
                        min={0}
                        placeholder="e.g., 15.5"
                    />
                </label>

                <label className="block text-xs">
                    Waist (in)
                    <NumberInput
                        className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                        value={waistIn}
                        onChangeNumber={(n) => onWaistIn(n)}
                        allowDecimals={allowDecimals}
                        commitMode="immediate"             // 👈 live
                        min={0}
                        placeholder="e.g., 32.25"
                    />
                </label>

                {sex === "female" && (
                    <label className="block text-xs">Hip (in)
                        <NumberInput
                            className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                            value={hipIn}
                            onChangeNumber={(n) => onHipIn(n)}
                            allowDecimals={allowDecimals}
                            commitMode="immediate"             // 👈 live
                            min={0}
                            placeholder="e.g., 38.0"
                        />
                    </label>
                )}
            </div>

            <div className="text-[11px] text-gray-600">
                Estimated Body Fat: <span className="font-medium">{bfEstimate}%</span>
            </div>
        </section>
    );
}
