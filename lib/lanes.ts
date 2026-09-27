const LANES = ["lane-ml", "lane-robotics", "lane-mobile", "lane-devops", "lane-web"] as const;

export function laneClass(value: string): string {
  const key = value.toLowerCase();
  if (key.includes("robot") || key.includes("hardware") || key.includes("embedded")) return "lane-robotics";
  if (key.includes("mobile") || key.includes("android") || key.includes("flutter")) return "lane-mobile";
  if (key.includes("devops")) return "lane-devops";
  if (key.includes("ai") || key.includes("ml") || key.includes("analytics") || key.includes("machine")) return "lane-ml";
  if (key.includes("cloud") || key.includes("tool") || key.includes("automat")) return "lane-devops";
  if (key.includes("web") || key.includes("api") || key.includes("database") || key.includes("backend")) return "lane-web";
  if (key === "languages" || key.includes("program")) return "lane-web";
  return "lane-ml";
}

export function laneAt(index: number): string {
  return LANES[index % LANES.length];
}

export const WORKFLOW_ICONS = ["HiSearch", "HiDraft", "HiChip", "HiBeaker", "HiRocket"];
