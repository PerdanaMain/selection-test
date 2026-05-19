import { AnalysisTask } from "../models/AnalysisTask";

describe("AnalysisTask.calculate", () => {
  it("counts matching characters case-insensitively", () => {
    const { percentage, details } = AnalysisTask.calculate("ABBCD", "Gallant Duck", false);
    // s1="abbcd", s2="gallant duck": a✓ b✗ b✗ c✓ d✓ → 3/5 = 60%
    expect(percentage).toBe("60.00");
    expect(details).toContain("3 of 5");
  });

  it("counts matching characters case-sensitively", () => {
    const { percentage, details } = AnalysisTask.calculate("ABBCD", "Gallant Duck", true);
    // s1="ABBCD", s2="Gallant Duck": A✗ B✗ B✗ C✗ D✓ → 1/5 = 20%
    expect(percentage).toBe("20.00");
    expect(details).toContain("1 of 5");
  });

  it("handles empty input1 with zero percentage", () => {
    const { percentage } = AnalysisTask.calculate("", "hello", false);
    expect(percentage).toBe("0.00");
  });

  it("returns partial match percentage", () => {
    const { percentage } = AnalysisTask.calculate("abc", "axy", false);
    // "a" matches → 1/3 = 33.33%
    expect(percentage).toBe("33.33");
  });
});

describe("AnalysisTask instance", () => {
  it("assigns a unique incremental id", () => {
    const t1 = new AnalysisTask("a", "b", true, "50.00", "detail");
    const t2 = new AnalysisTask("c", "d", false, "100.00", "detail");
    expect(t2.getId()).toBeGreaterThan(t1.getId());
  });

  it("preserves a given id when provided", () => {
    const task = new AnalysisTask("a", "b", true, "50.00", "detail", 999);
    expect(task.getId()).toBe(999);
  });

  it("stores all fields correctly", () => {
    const task = new AnalysisTask("hello", "world", true, "60.00", "some detail");
    expect(task.input1).toBe("hello");
    expect(task.input2).toBe("world");
    expect(task.isCaseSensitive).toBe(true);
    expect(task.resultPercentage).toBe("60.00");
    expect(task.details).toBe("some detail");
  });
});
