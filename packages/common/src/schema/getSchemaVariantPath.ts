import { OpenAPISchemaObject } from './types.js'

interface Props {
  schema: OpenAPISchemaObject
}
export const getSchemaVariantPath = ({ schema }: Props): string => {
  if (
    schema.type !== 'object' &&
    schema.type !== 'array' &&
    typeof schema.type === 'string'
  ) {
    return schema.type
  } else {
    return schema.title ?? ''
  }
}
