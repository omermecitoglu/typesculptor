import type { Definition } from "~/types/definition";
import { generateIndentation } from "~/utils/generateIndentation";
import { generateTypeDefinition } from "./generateTypeDefinition";
import type { SchemaObject } from "@omer-x/json-schema-types";

/**
 * Handles the generation of a TypeScript object type definition from a given JSON Schema.
 *
 * @param schema - The OpenAPI SchemaObject to process. Must have type "object".
 * @param indentation - The current indentation level for formatting the output.
 * @returns A Definition object containing the generated type body and its dependencies.
 */
export function handleObjectType(schema: SchemaObject, indentation: number): Definition {
  if (schema.type !== "object") throw new Error("Schema type must be 'object'");

  if (schema.propertyNames) {
    if (schema.additionalProperties === false) {
      return { dependencies: [], body: "{}" };
    }
    if (schema.additionalProperties === true || schema.additionalProperties === undefined) {
      return { dependencies: [], body: "Record<string, unknown>" };
    }
    const { dependencies, body } = generateTypeDefinition(schema.additionalProperties);
    return {
      dependencies,
      body: `Record<string, ${body}>`,
    };
  }

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

  const isRequired = (propertyName: string) => (schema.required ?? []).includes(propertyName);

  const properties = Object.keys(schema.properties ?? {}).map(propertyName => [
    "/**",
    ` * ${propertyDescriptions[propertyName] ?? "missing-description"}`,
    " */",
    `${propertyName}${isRequired(propertyName) ? "" : "?"}: ${propertyBodies[propertyName]},`,
  ].map(line => generateIndentation(indentation + 1) + line).join("\n"));

  return {
    dependencies,
    body: ["{", properties.join("\n"), "}"].join("\n"),
  };
}
