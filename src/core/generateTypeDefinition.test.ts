import { describe, expect, it } from "vitest";
import { generateTypeDefinition } from "./generateTypeDefinition";

describe("generateTypeDefinition", () => {
  it("should generate a null type definition for null type", () => {
    const output = generateTypeDefinition({ type: "null" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "null",
    });
  });

  it("should generate a boolean type definition for boolean type", () => {
    const output = generateTypeDefinition({ type: "boolean" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "boolean",
    });
  });

  it("should generate a number type definition for integer type", () => {
    const output = generateTypeDefinition({ type: "integer" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "number",
    });
  });

  it("should generate a number type definition for number type", () => {
    const output = generateTypeDefinition({ type: "number" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "number",
    });
  });

  it("should generate a string type definition for string type", () => {
    const output = generateTypeDefinition({ type: "string" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "string",
    });
  });
});
