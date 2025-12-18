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

  it("handles an array schema without items or constraints", () => {
    const schema: SchemaObject = {
      type: "array",
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("unknown[]");
  });

  it("handles an array schema with string items", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("string[]");
  });

  it("handles an array schema with items set to false", () => {
    const schema: SchemaObject = {
      type: "array",
      items: false,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("never[]");
  });

  it("handles an array schema with minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      minItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("unknown[]");
  });

  it("handles an array schema with maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("unknown[]");
  });

  it("handles an array schema with minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      minItems: 1,
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("unknown[]");
  });

  it("handles an array schema with string items and minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
      minItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("string[]");
  });

  it("handles an array schema with string items and maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("string[]");
  });

  it("handles an array schema with string items and minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
      minItems: 1,
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("string[]");
  });

  it("handles an array schema with items set to false and maximum items of 0", () => {
    const schema: SchemaObject = {
      type: "array",
      items: false,
      maxItems: 0,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("never[]");
  });

  it("handles an array schema with empty prefixItems", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [], // <------ this is not valid
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[]");
  });

  it("handles an array schema with prefixItems containing a string schema", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string]");
  });

  it("handles an array schema with prefixItems and items set to true", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: true,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, ...unknown[]]");
  });

  it("handles an array schema with prefixItems and items set to false", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: false,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string]");
  });

  it("handles an array schema with prefixItems and additional items schema", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, ...number[]]");
  });

  it("handles an array schema with prefixItems and minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      minItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string]");
  });

  it("handles an array schema with prefixItems and maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      maxItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string]");
  });

  it("handles an array schema with prefixItems and minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      minItems: 1,
      maxItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string]");
  });

  it("handles an array schema with prefixItems, additional items schema, and minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
      minItems: 1,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, ...number[]]");
  });

  it("handles an array schema with prefixItems, additional items schema, and maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, ...number[]]");
  });

  it("handles an array schema with prefixItems, additional items schema, and minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }],
      items: { type: "number" },
      minItems: 1,
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, ...number[]]");
  });

  it("handles an array schema with multiple prefixItems", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles an array schema with multiple prefixItems and items set to true", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: true,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number, ...unknown[]]");
  });

  it("handles an array schema with multiple prefixItems and items set to false", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: false,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles an array schema with multiple prefixItems and additional items schema", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: { type: "boolean" },
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number, ...boolean[]]");
  });

  it("handles an array schema with multiple prefixItems and minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      minItems: 2,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles an array schema with multiple prefixItems and maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      maxItems: 2,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles an array schema with multiple prefixItems and minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      minItems: 2,
      maxItems: 2,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number]");
  });

  it("handles an array schema with multiple prefixItems, additional items schema, and minimum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: { type: "boolean" },
      minItems: 2,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number, ...boolean[]]");
  });

  it("handles an array schema with multiple prefixItems, additional items schema, and maximum items constraint", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: { type: "boolean" },
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number, ...boolean[]]");
  });

  // eslint-disable-next-line @stylistic/max-len
  it("handles an array schema with multiple prefixItems, additional items schema, and minimum and maximum items constraints", () => {
    const schema: SchemaObject = {
      type: "array",
      prefixItems: [{ type: "string" }, { type: "number" }],
      items: { type: "boolean" },
      minItems: 2,
      maxItems: 5,
    };
    const result = handleArrayType(schema);
    expect(result.body).toBe("[string, number, ...boolean[]]");
  });
});
