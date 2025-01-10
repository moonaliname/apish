import type { OpenAPISchemaObject } from "@apish/common";

export function isPrimitive(schema: OpenAPISchemaObject) {
  return schema.type !== "object" && schema.type !== "array";
}
