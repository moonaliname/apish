import { type OpenAPI } from 'openapi-types'

interface IPreparedPath {
  segments: string[]
  methodSchema: OpenAPI.Operation
  paramTypes: Record<number, string>
}

type IPreparedPaths = Record<string, IPreparedPath[]>

export function preparePaths(paths: OpenAPI.Document['paths']): IPreparedPaths {
  try {
    if (!paths) return {}

    const result: IPreparedPaths = {}

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
