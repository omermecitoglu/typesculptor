import type { Definition } from "~/types/definition";
import { handleObjectType } from "./handleObjectType";
import { handleStringType } from "./handleStringType";
import type { ReferenceObject } from "@omer-x/openapi-types/reference";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function generateTypeDefinition(schema: SchemaObject | ReferenceObject, indentation: number = 0): Definition {
  if ("$ref" in schema) {
    const [_, __, _category, componentName] = schema.$ref.split("/");
    if (!componentName) throw new Error("Invalid $ref in schema");
    return {
      dependencies: [componentName],
      body: componentName,
    };
  }
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
      return handleStringType(schema);
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
