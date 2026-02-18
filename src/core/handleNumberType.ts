import type { Definition } from "~/types/definition";
import type { SchemaObject } from "@omer-x/json-schema-types";

export function handleNumberType(schema: SchemaObject): Definition {
  if (schema.type !== "number" && schema.type !== "integer") {
    throw new Error("Schema type must be 'number' or 'integer'");
  }
  if (schema.const) {
    return {
      dependencies: [],
      body: `${schema.const}`,
    };
  }
  return {
    dependencies: [],
    body: "number",
  };
}
