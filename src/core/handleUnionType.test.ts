import { describe, expect, it } from "vitest";
import { handleUnionType } from "./handleUnionType";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

describe("handleUnionType", () => {
  it("should be a function", () => {
    expect(typeof handleUnionType).toBe("function");
  });

  it("should return an empty union for an empty schema array", () => {
    const result = handleUnionType([]);
    expect(result).toEqual({ dependencies: [], body: "" });
  });

  it("should handle a single schema correctly", () => {
    const schema: SchemaObject = { type: "string" };
    const result = handleUnionType([schema]);
    expect(result).toEqual({ dependencies: [], body: "string" });
  });

  it("should handle multiple schemas correctly", () => {
    const schemas: SchemaObject[] = [
      { type: "string" },
      { type: "number" },
      { type: "boolean" },
    ];
    const result = handleUnionType(schemas);
    expect(result).toEqual({ dependencies: [], body: "(string | number | boolean)" });
  });

  it("should collect dependencies from schemas", () => {
    const schemas: SchemaObject[] = [
      { $ref: "#/components/schemas/Foo" },
      { $ref: "#/components/schemas/Bar" },
    ];
    const result = handleUnionType(schemas);
    expect(result).toEqual({
      dependencies: ["Foo", "Bar"],
      body: "(Foo | Bar)",
    });
  });
});
