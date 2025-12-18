import type { Definition } from "~/types/definition";
import type { SchemaObject } from "@omer-x/json-schema-types";

export function handleStringType(schema: SchemaObject): Definition {
  if (schema.type !== "string") throw new Error("Schema type must be 'string'");
  if (schema.enum) {
    return {
      dependencies: [],
      body: schema.enum.map(item => `"${item}"`).join(" | "),
    };
  }
  return {
    dependencies: [],
    body: "string",
  };
}
