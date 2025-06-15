import { describe, expect, it } from "vitest";
import { generateIndentation } from "./generateIndentation";

describe("generateIndentation", () => {
  it("should return an empty string when count is 0", () => {
    expect(generateIndentation(0)).toBe("");
  });

  it("should return two spaces when count is 1 and default size", () => {
    expect(generateIndentation(1)).toBe("  ");
  });

  it("should return four spaces when count is 2 and default size", () => {
    expect(generateIndentation(2)).toBe("    ");
  });

  it("should return correct number of spaces for custom size", () => {
    expect(generateIndentation(2, 4)).toBe("        ");
  });

  it("should return an empty string when count is negative", () => {
    expect(generateIndentation(-1)).toBe("");
  });

  it("should return an empty string when size is 0", () => {
    expect(generateIndentation(3, 0)).toBe("");
  });

  it("should return an empty string when both count and size are 0", () => {
    expect(generateIndentation(0, 0)).toBe("");
  });
});
