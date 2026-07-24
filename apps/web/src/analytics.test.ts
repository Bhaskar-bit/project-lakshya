import { expect, test } from "vitest";
import { track } from "./analytics";

function memory(): Storage {
  const values = new Map<string, string>();
  return {
    get length() { return values.size; },
    clear: () => values.clear(),
    getItem: (key) => values.get(key) ?? null,
    key: (index) => [...values.keys()][index] ?? null,
    removeItem: (key) => { values.delete(key); },
    setItem: (key, value) => { values.set(key, value); },
  };
}

test("analytics drops sensitive financial values", () => {
  const storage = memory();
  track(
    "review_viewed",
    { grade: "FAIR", assessmentCoverage: 60, monthlyIncome: 150_000 } as never,
    storage,
    () => new Date("2026-07-25T00:00:00.000Z"),
  );
  const events = JSON.parse(storage.getItem("lakshya.analytics.v1")!);
  expect(events[0].properties).toEqual({ grade: "FAIR", assessmentCoverage: 60 });
  expect(JSON.stringify(events)).not.toContain("150000");
});
