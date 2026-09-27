export function asset(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return `${base}${path}`;
}

export type StatusTone = "mint" | "copper" | "alert" | "neutral";

export function statusTone(status: string): StatusTone {
  const value = status.toLowerCase();
  if (
    value.includes("complete") ||
    value.includes("stable") ||
    value.includes("production") ||
    value.includes("ready")
  ) {
    return "mint";
  }
  if (
    value.includes("progress") ||
    value.includes("adding") ||
    value.includes("feature") ||
    value.includes("enhancement")
  ) {
    return "copper";
  }
  if (
    value.includes("block") ||
    value.includes("attention") ||
    value.includes("hold") ||
    value.includes("paused")
  ) {
    return "alert";
  }
  return "neutral";
}

export function getStatusColor(status: string): string {
  const tone = statusTone(status);
  if (tone === "mint") return "var(--mint)";
  if (tone === "copper") return "var(--copper)";
  if (tone === "alert") return "var(--alert)";
  return "var(--muted)";
}

export function getStatusIcon(status: string): string {
  const tone = statusTone(status);
  if (tone === "mint") return "Ready";
  if (tone === "copper") return "Active";
  if (tone === "alert") return "Hold";
  return "Status";
}

export function getProgressColor(progress: number): string {
  if (progress >= 90) return "var(--mint)";
  if (progress >= 70) return "var(--copper)";
  return "var(--alert)";
}
