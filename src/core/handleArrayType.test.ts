import { describe, expect, it } from "vitest";
import { handleArrayType } from "./handleArrayType";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("handleArrayType", () => {
  it("should be a function", () => {
    expect(typeof handleArrayType).toBe("function");
  });

  it("throws if schema.type is not 'array'", () => {
    expect(() => handleArrayType({ type: "string" })).toThrow("Schema type must be 'array'");
  });

  it("handles simple array of strings", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("string[]");
    expect(Array.isArray(result.dependencies)).toBe(true);
  });

  it("handles array of numbers", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "number" },
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("number[]");
  });

  it("handles tuple (minItems == maxItems)", () => {
    const schema: SchemaObject = {
      type: "array",
      items: [{ type: "string" }, { type: "number" }],
      minItems: 2,
      maxItems: 2,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles array with multiple item types (not tuple)", () => {
    const schema: SchemaObject = {
      type: "array",
      items: [{ type: "string" }, { type: "number" }],
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("(string, number)[]");
  });

  it("collects dependencies from items", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { $ref: "#/components/schemas/Foo" },
    };
    const result = handleArrayType(schema);
    expect(result.dependencies).toStrictEqual(["Foo"]);
    expect(result.body).toStrictEqual("Foo[]");
  });
});
