import { describe, expect, it } from "vitest";
import { handleNumberType } from "./handleNumberType";
import type { SchemaObject } from "@omer-x/json-schema-types";

describe("handleNumberType", () => {
  it("should throw if schema.type is not 'number'", () => {
    expect(() => handleNumberType({ type: "string" } as SchemaObject)).toThrowError("Schema type must be 'number'");
  });

  it("should return string type definition when no enum is present", () => {
    const schema: SchemaObject = { type: "number" };
    const result = handleNumberType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: "number",
    });
  });

  it("should handle constant numbers", () => {
    const schema: SchemaObject = { type: "number", const: 42 };
    const result = handleNumberType(schema);
    expect(result).toEqual({
      dependencies: [],
      body: "42",
    });
  });
});
