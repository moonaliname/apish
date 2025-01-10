import { ISearchPath } from './types.js'

export const convertSearchPathToSchemaPath = (
  searchPathSegments?: ISearchPath['segments'],
): string => {
  if (!searchPathSegments) return ''
  let schemaPath = ''
  for (let segment of searchPathSegments) {
    schemaPath += `/${segment}`
  }
  return schemaPath
}
