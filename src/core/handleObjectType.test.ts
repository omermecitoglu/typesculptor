import { describe, expect, it } from "vitest";
import { handleObjectType } from "./handleObjectType";
import type { SchemaObject } from "@omer-x/json-schema-types";

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
      required: ["foo"],
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("foo: string");
    expect(result.body).toContain("Foo property");
    expect(result.body).not.toContain("foo?:");
  });

  it("should mark property as optional if not required", () => {
    const schema: SchemaObject = {
      type: "object",
      properties: {
        bar: { type: "boolean", description: "Bar property" },
      },
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("bar?: boolean");
    expect(result.body).toContain("Bar property");
  });

  it("should use 'missing-description' if property description is missing", () => {
    const schema: SchemaObject = {
      type: "object",
      properties: {
        baz: { type: "number" },
      },
      required: ["baz"],
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toContain("baz: number");
    expect(result.body).toContain("missing-description");
  });

  it("should handle propertyNames with additionalProperties", () => {
    const schema: SchemaObject = {
      type: "object",
      propertyNames: {
        type: "string",
      },
      additionalProperties: {
        anyOf: [
          {
            type: "string",
          },
          {
            type: "number",
          },
          {
            type: "boolean",
          },
        ],
      },
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toBe("Record<string, (string | number | boolean)>");
  });

  it("should handle propertyNames without additionalProperties", () => {
    const schema: SchemaObject = {
      type: "object",
      propertyNames: {
        type: "string",
      },
      additionalProperties: {},
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toBe("Record<string, unknown>");
  });

  it("should handle propertyNames with additionalProperties as false", () => {
    const schema: SchemaObject = {
      type: "object",
      propertyNames: {
        type: "string",
      },
      additionalProperties: false,
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toBe("{}");
  });

  it("should handle propertyNames with additionalProperties as true", () => {
    const schema: SchemaObject = {
      type: "object",
      propertyNames: {
        type: "string",
      },
      additionalProperties: true,
    };
    const result = handleObjectType(schema, 0);
    expect(result.body).toBe("Record<string, unknown>");
  });
});
