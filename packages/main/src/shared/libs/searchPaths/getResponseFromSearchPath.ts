import type { OpenAPIResponse } from '@apish/common'
import type { ISearchPath } from './types.js'

interface Props {
  searchPath?: ISearchPath
}
export const getResponseFromSearchPath = ({
  searchPath,
}: Props): OpenAPIResponse | undefined => {
  if (!searchPath) {
    return
  }

  if (!searchPath.methodSchema.responses) {
    return
  }

  const firstResponse = Object.values(searchPath.methodSchema.responses)[0]

  if (!firstResponse) {
    return
  }

  if ('$ref' in firstResponse) {
    return
  }

  return firstResponse
}
