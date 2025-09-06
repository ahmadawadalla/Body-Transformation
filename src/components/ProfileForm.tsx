import { cmToFtIn, ftInToCm, kgToLb, lbToKg } from "@/lib/units";
import NumberInput from "@/components/NumberInput";

export type Sex = "male" | "female";

type Props = {
    sex: Sex;
    onSex: (s: Sex) => void;
    height_cm: number;
    onHeightCm: (cm: number) => void;
    weight_kg: number;
    onWeightKg: (kg: number) => void;
    age: number;
    onAge: (a: number) => void;
    allowDecimals: boolean;
};

export default function ProfileForm({
                                        sex, onSex, height_cm, onHeightCm, weight_kg, onWeightKg, age, onAge, allowDecimals
                                    }: Props) {
    const { ft, inches } = cmToFtIn(height_cm);

    const digitsOnly = (s: string) => /^\d*$/.test(s);
    return (
        <section className="rounded-xl border bg-white p-3 space-y-3">
            <h2 className="font-semibold text-sm">Profile</h2>

            <label className="block text-xs">Sex
                <select
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={sex}
                    onChange={(e) => onSex(e.target.value as Sex)}
                >
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
            </label>

            {/* Height (integers) */}
            <label className="block text-xs">Height (ft/in)
                <div className="flex gap-2 mt-1">
                    <input
                        className="border rounded px-2 py-1.5 w-20 bg-gray-100 text-gray-900"
                        type="text" inputMode="numeric" pattern="[0-9]*"
                        value={ft.toString()}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (digitsOnly(v)) {
                                const newFt = v === "" ? 0 : +v;
                                const safeIn = Math.max(0, Math.min(11, inches));
                                onHeightCm(ftInToCm(newFt, safeIn));
                            }
                        }}
                    />
                    <input
                        className="border rounded px-2 py-1.5 w-20 bg-gray-100 text-gray-900"
                        type="text" inputMode="numeric" pattern="[0-9]*"
                        value={inches.toString()}
                        onChange={(e) => {
                            const v = e.target.value;
                            if (digitsOnly(v)) {
                                const newIn = v === "" ? 0 : Math.max(0, Math.min(11, +v));
                                onHeightCm(ftInToCm(ft, newIn));
                            }
                        }}
                    />
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Use barefoot morning height for consistency.</p>
            </label>

            {/* Weight (toggle decimals) */}
            <label className="block text-xs">Weight (lb)
                <NumberInput
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    value={kgToLb(weight_kg)}
                    onChangeNumber={(lb) => onWeightKg(lbToKg(lb))}
                    allowDecimals={allowDecimals}
                    commitMode="immediate"             // 👈 live
                    min={0}
                    placeholder="e.g., 172.5"
                />
                <p className="text-[11px] text-gray-500 mt-1">Stored in metric internally for accurate math.</p>
            </label>


            {/* Age (integer) */}
            <label className="block text-xs">Age
                <input
                    className="mt-1 border rounded px-2 py-1.5 w-full bg-gray-100 text-gray-900"
                    type="text" inputMode="numeric" pattern="[0-9]*"
                    value={age.toString()}
                    onChange={(e) => {
                        const v = e.target.value;
                        if (digitsOnly(v)) onAge(v === "" ? 0 : +v);
                    }}
                />
            </label>
        </section>
    );
}
