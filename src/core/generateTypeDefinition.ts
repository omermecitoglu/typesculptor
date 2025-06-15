import type { Definition } from "~/types/definition";
import { handleObjectType } from "./handleObjectType";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function generateTypeDefinition(schema: SchemaObject, indentation: number = 0): Definition {
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
    case "object": {
      return handleObjectType(schema, indentation);
    }
    default:
      return {
        dependencies: [],
        body: "unknown",
      };
  }
}
