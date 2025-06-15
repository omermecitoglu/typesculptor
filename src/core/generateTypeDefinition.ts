import type { SchemaObject } from "@omer-x/openapi-types/schema";

type Definition = {
  dependencies: string[],
  body: string,
};

export function generateTypeDefinition(schema: SchemaObject): Definition {
  switch (schema.type) {
    case "null":
      return {
        dependencies: [],
        body: "null",
      };
    case "boolean":
      return {
        dependencies: [],
        body: "boolean",
      };
    case "integer":
    case "number":
      return {
        dependencies: [],
        body: "number",
      };
    case "string":
      return {
        dependencies: [],
        body: "string",
      };
    default:
      return {
        dependencies: [],
        body: "unknown",
      };
  }
}
