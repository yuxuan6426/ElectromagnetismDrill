import { describe, expect, it } from "vitest";
import {
  answer,
  bank,
  compare,
  eligible,
  importData,
  initial,
  rate,
  start,
  submitAnswer,
  type Config,
} from "./core";

const config: Config = {
  profile: "primary",
  mode: "input",
  filter: "all",
  category: "",
  tag: "",
  order: "source",
  length: 1,
};

describe("mechanics training", () => {
  it("loads 19 distinct exercises in five homework groups", () => {
    expect(new Set(bank.questions.map((q) => q.id)).size).toBe(19);
    expect(bank.categories).toHaveLength(5);
    expect(answer(bank.questions[0], "primary").solution).toContain("\\vec{E}");
  });

  it("accepts typographic variants without erasing symbol boundaries", () => {
    expect(compare(" 4 × a ÷ (3 × π) ", "4*a/(3*pi)")).toBe(true);
    expect(compare("m × a² / 2", "m*a^2/2")).toBe(true);
    expect(compare("G 1", "G1")).toBe(false);
    expect(compare("4 × a", "4*a", true)).toBe(false);
  });

  it("records a match once and leaves a differing expression for self-assessment", () => {
    const started = start(initial(), config, "1.3-1");
    const matched = submitAnswer({
      ...started,
      session: { ...started.session!, draft: "０" },
    });
    expect(matched.attempts).toHaveLength(1);
    expect(matched.session?.finished).toBe(true);
    expect(submitAnswer(matched)).toBe(matched);
    const unmatched = submitAnswer({
      ...started,
      session: { ...started.session!, draft: "1" },
    });
    expect(unmatched.attempts).toHaveLength(0);
    expect(unmatched.session?.revealed).toBe(true);
    const wrong = rate(unmatched, "wrong", new Date(2026, 10, 10, 12));
    expect(
      eligible(wrong, { ...config, filter: "wrong" }).map((q) => q.id),
    ).toEqual(["1.3-1"]);
    expect(wrong.progress["1.3-1:common"].due).toBe("2026-11-10");
  });

  it("preserves unfinished drafts and rejects unrelated backups", () => {
    const started = start(initial(), config, "2.3-22");
    const draft = { ...started, session: { ...started.session!, draft: "2" } };
    expect(importData(JSON.stringify(draft))).toEqual({
      type: "backup",
      data: draft,
    });
    expect(() =>
      importData(JSON.stringify({ ...draft, app: "PhysDrill" })),
    ).toThrow();
  });
});
