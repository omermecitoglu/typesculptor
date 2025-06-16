import type { Definition } from "~/types/definition";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

export function handleUnionType(schemas: SchemaObject[]): Definition {
  const dependencies: string[] = [];
  const itemBodies: string[] = [];
  for (const item of schemas) {
    const itemDefinition = generateTypeDefinition(item);
    dependencies.push(...itemDefinition.dependencies);
    itemBodies.push(itemDefinition.body);
  }

  if (itemBodies.length > 1) {
    return { dependencies, body: `(${itemBodies.join(" | ")})` };
  }

  return { dependencies, body: itemBodies.join(" | ") };
}
