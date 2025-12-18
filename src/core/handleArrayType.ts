import type { Definition } from "~/types/definition";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/json-schema-types";

export function handleArrayType(schema: SchemaObject): Definition {
  if (schema.type !== "array") throw new Error("Schema type must be 'array'");

  const dependencies: string[] = [];

  if (schema.prefixItems) {
    // Tuple type
    const prefixTypes: string[] = [];
    for (const itemSchema of schema.prefixItems) {
      const itemDef = generateTypeDefinition(itemSchema);
      dependencies.push(...itemDef.dependencies);
      prefixTypes.push(itemDef.body);
    }

    let additionalType = "";
    if (schema.items === false) {
      // No additional items
    } else if (schema.items === true) {
      additionalType = "...Array<unknown>";
    } else if (schema.items && typeof schema.items === "object") {
      const additionalDef = generateTypeDefinition(schema.items);
      dependencies.push(...additionalDef.dependencies);
      additionalType = `...Array<${additionalDef.body}>`;
    } else {
      // items is undefined, no additional items
    }

    const tupleBody = `[${prefixTypes.join(", ")}${additionalType ? ", " + additionalType : ""}]`;
    return {
      dependencies,
      body: tupleBody,
    };
  } else {
    // Array type
    let itemType = "unknown";
    if (schema.items === false) {
      itemType = "never";
    } else if (schema.items && typeof schema.items === "object") {
      const itemDef = generateTypeDefinition(schema.items);
      dependencies.push(...itemDef.dependencies);
      itemType = itemDef.body;
    }

    return {
      dependencies,
      body: `Array<${itemType}>`,
    };
  }
}
