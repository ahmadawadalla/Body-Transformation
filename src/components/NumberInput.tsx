import { useEffect, useRef, useState } from "react";
import { formatTrim } from "@/lib/format";

type Props = {
    value: number;                       // canonical numeric value from parent
    onChangeNumber: (n: number) => void; // called on commit
    allowDecimals: boolean;
    min?: number;
    placeholder?: string;
    className?: string;
    commitMode?: "immediate" | "blur";   // 👈 NEW
};

export default function NumberInput({
                                        value,
                                        onChangeNumber,
                                        allowDecimals,
                                        min = 0,
                                        placeholder,
                                        className,
                                        commitMode = "blur",
                                    }: Props) {
    const [text, setText] = useState<string>(formatTrim(value));
    const focused = useRef(false);

    const reInt = /^\d*$/;
    const reDec = /^\d*\.?\d*$/;

    // Keep local text in sync with parent when not focused.
    useEffect(() => {
        if (!focused.current) setText(formatTrim(value));
    }, [value]);

    const clamp = (n: number) => Math.max(min, n);

    const tryCommit = (raw: string) => {
        if (raw.trim() === "") return; // don't commit empties
        // Avoid committing while user just typed trailing dot (e.g., "124.")
        if (allowDecimals && raw.endsWith(".")) return;
        const num = Number(raw);
        if (!Number.isNaN(num)) onChangeNumber(clamp(num));
    };

    const onChange = (v: string) => {
        const ok = allowDecimals ? reDec.test(v) : reInt.test(v);
        if (!ok) return;
        setText(v);
        if (commitMode === "immediate") tryCommit(v);
    };

    const commit = () => {
        focused.current = false;
        if (text.trim() === "") {
            onChangeNumber(min);
            setText(formatTrim(min));
            return;
        }
        tryCommit(text);
        // refresh display (trims trailing .0 etc.)
        setText(formatTrim(clamp(Number(text) || min)));
    };

    return (
        <input
            className={className}
            type="text"
            inputMode={allowDecimals ? "decimal" : "numeric"}
            pattern={allowDecimals ? "[0-9]*\\.?[0-9]*" : "[0-9]*"}
            value={text}
            placeholder={placeholder}
            onFocus={() => (focused.current = true)}
            onChange={(e) => onChange(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur(); // triggers commit()
            }}
        />
    );
}
