import { describe, expect, it } from "vitest";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/json-schema-types";

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

  it("should generate an object type definition for object type", () => {
    const schema: SchemaObject = { type: "object", properties: { foo: { type: "string" }, bar: { type: "number" } } };
    const output = generateTypeDefinition(schema);
    expect(output).toStrictEqual({
      dependencies: [],
      body: `{
  /**
   * missing-description
   */
  foo?: string,
  /**
   * missing-description
   */
  bar?: number,
}`,
    });
  });

  it("should generate an array type definition for array type", () => {
    const schema: SchemaObject = {
      type: "array",
      items: { type: "string" },
    };
    const output = generateTypeDefinition(schema);
    expect(output).toStrictEqual({
      dependencies: [],
      body: "Array<string>",
    });
  });

  it("should return unknown type definition for unknown type", () => {
    const output = generateTypeDefinition({ type: "something-else" as "string" });
    expect(output).toStrictEqual({
      dependencies: [],
      body: "unknown",
    });
  });

  it("should throw an error for invalid $ref in schema", () => {
    expect(() => generateTypeDefinition({ $ref: "#/components/schemas/" })).toThrowError("Invalid $ref in schema");
  });

  it("should generate a type definition for valid $ref in schema", () => {
    const output = generateTypeDefinition({ $ref: "#/components/schemas/AwesomeType" });
    expect(output).toStrictEqual({
      dependencies: [
        "AwesomeType",
      ],
      body: "AwesomeType",
    });
  });

  it("should generate a union type definition for anyOf in schema", () => {
    const schema = {
      anyOf: [
        { type: "string" as const },
        { type: "number" as const },
      ],
    } as SchemaObject;
    const output = generateTypeDefinition(schema);
    expect(output).toStrictEqual({
      dependencies: [],
      body: "(string | number)",
    });
  });

  it("should generate a union type definition for oneOf in schema", () => {
    const schema = {
      oneOf: [
        { type: "boolean" as const },
        { type: "null" as const },
      ],
    } as SchemaObject;
    const output = generateTypeDefinition(schema);
    expect(output).toStrictEqual({
      dependencies: [],
      body: "(boolean | null)",
    });
  });
});
