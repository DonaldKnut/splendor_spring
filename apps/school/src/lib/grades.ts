import { db } from "./db";

export async function getScoreLimits() {
  const settings = await db.setting.findMany({
    where: { key: { in: ["ca_max", "exam_max"] } },
  });
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));
  return {
    caMax: Number(map.ca_max ?? 40),
    examMax: Number(map.exam_max ?? 60),
  };
}

export function computeTotal(
  caScore: number | null | undefined,
  examScore: number | null | undefined
): number | null {
  if (caScore == null || examScore == null) return null;
  return Number((caScore + examScore).toFixed(2));
}

export async function assignGrade(total: number | null): Promise<{
  grade: string | null;
  remark: string | null;
}> {
  if (total == null) return { grade: null, remark: null };

  const scale = await db.gradingScale.findFirst({
    where: {
      isActive: true,
      minScore: { lte: total },
      maxScore: { gte: total },
    },
    orderBy: { sortOrder: "asc" },
  });

  if (!scale) return { grade: null, remark: null };
  return { grade: scale.grade, remark: scale.remark };
}

export function validateScores(
  caScore: number,
  examScore: number,
  caMax: number,
  examMax: number
): string | null {
  if (Number.isNaN(caScore) || Number.isNaN(examScore)) {
    return "Scores must be valid numbers.";
  }
  if (caScore < 0 || examScore < 0) {
    return "Scores cannot be negative.";
  }
  if (caScore > caMax) {
    return `CA score cannot exceed ${caMax}.`;
  }
  if (examScore > examMax) {
    return `Exam score cannot exceed ${examMax}.`;
  }
  return null;
}
