import { describe, expect, it } from "vitest";
import { generateTypeDefinition } from "./index";

describe("generateTypeDefinition", () => {
  it("should be a function", () => {
    expect(typeof generateTypeDefinition).toBe("function");
  });
});
