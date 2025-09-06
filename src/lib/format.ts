// Trim trailing zeros without exposing long float noise.
// 124   -> "124"
// 124.5 -> "124.5"
// 124.5678 (dp=2) -> "124.57"
export function formatTrim(n: number, dp = 2): string {
    if (!Number.isFinite(n)) return "";
    return parseFloat(n.toFixed(dp)).toString();
}
