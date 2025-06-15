import { describe, expect, it } from "vitest";
import { handleObjectType } from "./handleObjectType";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("handleObjectType", () => {
  it("should throw if schema type is not 'object'", () => {
    expect(() => handleObjectType({ type: "string" }, 0)).toThrow("Schema type must be 'object'");
  });

  it("should return empty object for object with no properties", () => {
    const schema: SchemaObject = { type: "object" };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("{");
    expect(result.body).toContain("}");
    expect(result.dependencies).toEqual([]);
  });

  it("should generate type definition for single property", () => {
    const schema: SchemaObject = {
      type: "object" as const,
      properties: {
        foo: { type: "string", description: "Foo property" },
      },
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("foo: string");
    expect(result.body).toContain("Foo property");
  });

  it("should use 'missing-description' if property description is missing", () => {
    const schema: SchemaObject = {
      type: "object",
      properties: {
        baz: { type: "number" },
      },
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("missing-description");
  });
});
