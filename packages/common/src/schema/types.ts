import type { OpenAPIV3_1 } from 'openapi-types'

export type OpenAPIResponse = OpenAPIV3_1.ResponseObject | undefined

export type OpenAPIMediaTypeObject = OpenAPIV3_1.MediaTypeObject

export type OpenAPISchemaObject = OpenAPIV3_1.SchemaObject

export type OpenAPIReferenceObject = OpenAPIV3_1.ReferenceObject

export type IPrimitiveField = string | number | boolean | null
export type ITemplate =
  | ITemplateObject
  | Array<ITemplate>
  | Array<IPrimitiveField>
  | IPrimitiveField
  | undefined

export type ITemplateObject = {
  [key: string]: ITemplate | Array<ITemplate> | IPrimitiveField
}
