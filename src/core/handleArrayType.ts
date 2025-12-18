import type { Definition } from "~/types/definition";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/json-schema-types";

export function handleArrayType(schema: SchemaObject): Definition {
  if (schema.type !== "array") throw new Error("Schema type must be 'array'");

  const dependencies: string[] = [];
  const itemBodies: string[] = [];
  for (const item of [schema.items].flat()) {
    const itemDefinition = generateTypeDefinition(item);
    dependencies.push(...itemDefinition.dependencies);
    itemBodies.push(itemDefinition.body);
  }

  if (schema.minItems && schema.maxItems && schema.minItems === schema.maxItems) {
    return { dependencies, body: `[${itemBodies.join(", ")}]` };
  }

  if (itemBodies.length > 1) {
    return { dependencies, body: `(${itemBodies.join(", ")})[]` };
  }

  return { dependencies, body: `${itemBodies.join(", ")}[]` };
}
