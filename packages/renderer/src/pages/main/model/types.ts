import type { ITemplate, OpenAPISchemaObject } from "@apish/common";
import { type OpenAPI } from "openapi-types";

export interface FieldProps {
  doc: OpenAPI.Document;
  schema: OpenAPISchemaObject;
  field: string;
  title: string;
  template: ITemplate;
}
