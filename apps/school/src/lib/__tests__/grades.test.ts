import { describe, expect, it } from "vitest";
import { computeTotal, validateScores } from "../grades";

describe("grade helpers", () => {
  it("computes totals", () => {
    expect(computeTotal(30, 50)).toBe(80);
    expect(computeTotal(null, 50)).toBeNull();
  });

  it("validates score bounds", () => {
    expect(validateScores(-1, 40, 40, 60)).toMatch(/negative/i);
    expect(validateScores(41, 40, 40, 60)).toMatch(/CA/i);
    expect(validateScores(30, 61, 40, 60)).toMatch(/Exam/i);
    expect(validateScores(30, 50, 40, 60)).toBeNull();
  });
});
