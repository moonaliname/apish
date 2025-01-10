import type { OpenAPI } from 'openapi-types'

import type {
  OpenAPIMediaTypeObject,
  OpenAPIResponse,
  OpenAPISchemaObject,
} from './types.js'
import { getNonRefSchema } from './getNonRefSchema.js'
import {
  errorOperationResult,
  successOperationResult,
} from './operationResult.js'

import type {
  IErrorOperationResult,
  ISuccessOperationResult,
} from './operationResult.js'

export function getSchemaFromResponse(
  doc: OpenAPI.Document,
  responseSchema: OpenAPIResponse,
): ISuccessOperationResult<OpenAPISchemaObject> | IErrorOperationResult {
  if (!responseSchema) {
    return errorOperationResult(
      `No schema provided, make sure to upload valid Open API schema`,
    )
  }

  if (!('content' in responseSchema) || !responseSchema.content) {
    return successOperationResult<OpenAPISchemaObject>(
      { type: 'string', title: 'Response' },
      `Can't get content of Response Object, response will be simple string`,
    )
  }

  if (
    !('application/json' in responseSchema.content) ||
    !responseSchema.content['application/json']
  ) {
    return successOperationResult<OpenAPISchemaObject>(
      { type: 'string', title: 'Response' },
      `Can't get json of Response Object content, response will be simple string`,
    )
  }

  const contentJSON = responseSchema.content[
    'application/json'
  ] as OpenAPIMediaTypeObject

  if (!contentJSON.schema) {
    return successOperationResult<OpenAPISchemaObject>(
      { type: 'string', title: 'Response' },
      `Can't get json schema of Response Object content, response will be simple string`,
    )
  }

  if (Object.keys(contentJSON.schema).length === 0) {
    return successOperationResult<OpenAPISchemaObject>(
      { type: 'string', title: 'Response' },
      `Can't get json of Response Object content, response will be simple string`,
    )
  }

  return getNonRefSchema(doc, contentJSON.schema)
}
