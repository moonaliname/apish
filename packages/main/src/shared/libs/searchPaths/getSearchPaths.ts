import type { OpenAPI } from 'openapi-types'
import type { ISearchPaths } from './types.js'
import { convertSearchPathToSchemaPath } from './convertSearchPathToSchemaPath.js'

export function getSearchPaths(paths: OpenAPI.Document['paths']): ISearchPaths {
  try {
    if (!paths) return {}

    const result: ISearchPaths = {}

    Object.entries(paths).forEach(([path, methods]) => {
      const segments = path.split('/').filter(Boolean)
      const paramTypes: Record<number, string> = {}

      for (const methodKey of Object.keys(methods)) {
        if (!result[methodKey]) {
          result[methodKey] = []
        }

        const methodSchema = methods[methodKey] as OpenAPI.Operation

        if (methodSchema.parameters) {
          for (let parameter of methodSchema.parameters) {
            if ('name' in parameter) {
              const parameterPosition = segments.indexOf(parameter.name)

              if (parameterPosition !== -1) {
                segments[parameterPosition] = `{${segments[parameterPosition]}}`

                paramTypes[parameterPosition] = parameter.schema.type
              }
            }
          }
        }

        result[methodKey].push({
          schemaPath: convertSearchPathToSchemaPath(segments),
          segments,
          methodSchema: methodSchema,
          paramTypes,
        })
      }
    })
    return result
  } catch (e) {
    return {}
  }
}
