import type { Definition } from "~/types/definition";
import { generateIndentation } from "~/utils/generateIndentation";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/openapi-types/schema";

/**
 * Handles the generation of a TypeScript object type definition from a given JSON Schema.
 *
 * @param schema - The OpenAPI SchemaObject to process. Must have type "object".
 * @param indentation - The current indentation level for formatting the output.
 * @returns A Definition object containing the generated type body and its dependencies.
 */
export function handleObjectType(schema: SchemaObject, indentation: number): Definition {
  if (schema.type !== "object") throw new Error("Schema type must be 'object'");

  const dependencies: string[] = [];
  const propertyBodies = {} as Record<string, string>;
  const propertyDescriptions = {} as Record<string, string | undefined>;
  for (const [propertyName, property] of Object.entries(schema.properties ?? {})) {
    const propertyDefinition = generateTypeDefinition(property, indentation + 1);
    dependencies.push(...propertyDefinition.dependencies);
    propertyBodies[propertyName] = propertyDefinition.body;
    if (property.description) {
      propertyDescriptions[propertyName] = property.description;
    }
  }

  const properties = Object.keys(schema.properties ?? {}).map(propertyName => [
    "/**",
    ` * ${propertyDescriptions[propertyName] ?? "missing-description"}`,
    " */",
    `${propertyName}: ${propertyBodies[propertyName]},`,
  ].map(line => generateIndentation(indentation + 1) + line).join("\n"));

  return {
    dependencies,
    body: ["{", properties.join("\n"), "}"].join("\n"),
  };
}
