import { describe, expect, it } from "vitest";
import { handleStringType } from "./handleStringType";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("handleStringType", () => {
  it("should throw if schema.type is not 'string'", () => {
    expect(() => handleStringType({ type: "number" } as SchemaObject)).toThrowError("Schema type must be 'string'");
  });

  it("should return string type definition when no enum is present", () => {
    const schema: SchemaObject = { type: "string" };
    const result = handleStringType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: "string",
    });
  });

  it("should return union of string literals when enum is present", () => {
    const schema: SchemaObject = { type: "string", enum: ["foo", "bar", "baz"] };
    const result = handleStringType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: '"foo" | "bar" | "baz"',
    });
  });

  it("should handle empty enum array", () => {
    const schema: SchemaObject = { type: "string", enum: [] };
    const result = handleStringType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: "",
    });
  });

  it("should handle constant string", () => {
    const schema: SchemaObject = { type: "string", const: "UNKNOWN_ERROR" };
    const result = handleStringType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: '"UNKNOWN_ERROR"',
    });
  });
});
