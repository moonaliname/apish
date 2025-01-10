import type { OpenAPI } from 'openapi-types'

export interface ISearchPath {
  schemaPath: string
  segments: string[]
  methodSchema: OpenAPI.Operation
  paramTypes: Record<number, string>
}
export type ISearchPaths = Record<string, ISearchPath[]>
