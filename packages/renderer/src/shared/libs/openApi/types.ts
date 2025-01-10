import { OpenAPIV2, OpenAPIV3, OpenAPIV3_1 } from "openapi-types";

export type OpenAPIResponse =
  | OpenAPIV2.ResponseObject
  | OpenAPIV3.ResponseObject
  | OpenAPIV3_1.ResponseObject
  | undefined;

export type OpenAPIMediaTypeObject =
  | OpenAPIV3.MediaTypeObject
  | OpenAPIV3_1.MediaTypeObject;

export type OpenAPISchemaObject =
  | OpenAPIV3.SchemaObject
  | OpenAPIV3_1.SchemaObject;
