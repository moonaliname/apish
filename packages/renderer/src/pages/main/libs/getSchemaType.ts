import type { OpenAPISchemaObject } from "@apish/common";

export function getSchemaType(schema: OpenAPISchemaObject) {
  return "type" in schema && schema.type ? schema.type : undefined;
}
