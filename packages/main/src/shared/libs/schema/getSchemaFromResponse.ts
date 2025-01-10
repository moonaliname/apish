import type {
  OpenAPIReferenceObject,
  OpenAPIResponse,
  OpenAPISchemaObject,
} from '@apish/common'

export const getSchemaFromResponse = (
  response: OpenAPIResponse | undefined,
): OpenAPISchemaObject | OpenAPIReferenceObject | undefined => {
  if (!response) {
    return
  }

  if (!('content' in response)) {
    return
  }

  if (!response.content) {
    return
  }

  if (!('application/json' in response.content)) {
    return
  }

  if (!response.content['application/json']) {
    return
  }

  if (!response.content['application/json'].schema) {
    return
  }

  return response.content['application/json'].schema
}
