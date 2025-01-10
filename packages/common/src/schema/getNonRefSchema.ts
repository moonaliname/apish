import type { OpenAPI } from 'openapi-types'

import type { OpenAPIReferenceObject, OpenAPISchemaObject } from './types.js'
import {
  errorOperationResult,
  IErrorOperationResult,
  ISuccessOperationResult,
  successOperationResult,
} from './operationResult.js'

export const getNonRefSchema = (
  doc: OpenAPI.Document,
  schema?: OpenAPISchemaObject | OpenAPIReferenceObject,
): ISuccessOperationResult<OpenAPISchemaObject> | IErrorOperationResult => {
  if (!schema) {
    return errorOperationResult(
      `No schema provided, make sure to upload valid Open API schema`,
    )
  }

  if ('$ref' in schema) {
    const pathComponents = schema['$ref'].split('/').filter(Boolean)

    let current: object = doc
    let isComponentsPath = false

    for (
      let componentIndex = 0;
      componentIndex < pathComponents.length;
      componentIndex++
    ) {
      const component = pathComponents[componentIndex]
      if (componentIndex == 0) {
        continue
      }

      if (component == 'components' && componentIndex === 1) {
        isComponentsPath = true
      }

      if (getPathInObject(current, component)) {
        current = current[component]
      } else {
        return errorOperationResult(`Path not found: ${schema['$ref']}`)
      }
    }

    if (!isComponentsPath) {
      return errorOperationResult(
        `Given path is not path for components schema`,
      )
    }

    return successOperationResult<OpenAPISchemaObject>(current)
  } else {
    return successOperationResult<OpenAPISchemaObject>(schema)
  }
}

function getPathInObject(
  doc: object,
  path: string,
): doc is { [key: string]: object } {
  return path in doc
}
