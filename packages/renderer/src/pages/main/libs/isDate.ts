import type { OpenAPISchemaObject } from "@apish/common";

export function isDate(schema: OpenAPISchemaObject) {
  return schema.type === "string" && schema.format === "date-time";
}
