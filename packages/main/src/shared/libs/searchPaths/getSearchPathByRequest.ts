import type { ISearchPath, ISearchPaths } from './types.js'

interface Props {
  paths: ISearchPaths
  request: {
    url: string
    method: string
  }
}
export function getSearchPathByRequest({
  paths,
  request,
}: Props): ISearchPath | undefined {
  try {
    const lowercasedMethod = request.method.toLowerCase()
    const methodPaths = paths[lowercasedMethod]
    if (!methodPaths || methodPaths.length === 0) return

    const cleanPath = request.url.split('?')[0]

    const urlSegments = cleanPath.split('/').filter(Boolean)

    for (const methodPath of methodPaths) {
      const { segments, paramTypes, methodSchema } = methodPath

      if (segments.length !== urlSegments.length) continue
      let isMatch = true
      for (let i = 0; i < segments.length; i++) {
        const pathSegment = segments[i]
        const urlSegment = urlSegments[i]

        if (pathSegment.startsWith('{') && pathSegment.endsWith('}')) {
          const paramType = paramTypes[i]
          if (paramType === 'integer' && !/^\d+$/.test(urlSegment)) {
            isMatch = false
            break
          }
        } else if (pathSegment !== urlSegment) {
          isMatch = false
          break
        }
      }

      if (isMatch) {
        return methodPath
      }
    }

    return
  } catch (e) {}
}
