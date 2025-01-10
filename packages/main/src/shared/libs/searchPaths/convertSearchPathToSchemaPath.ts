import { ISearchPath } from './types.js'

export const convertSearchPathToSchemaPath = (
  searchPathSegments?: ISearchPath['segments'],
): string => {
  if (!searchPathSegments) return ''
  let schemaPath = ''
  for (let segment of searchPathSegments) {
    if (segment.startsWith('{')) {
      schemaPath += `/${segment.slice(1, -1)}`
    } else {
      schemaPath += `/${segment}`
    }
  }
  return schemaPath
}
