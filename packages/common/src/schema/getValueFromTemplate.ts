import type { ITemplate } from './types.js'

export const getValueFromTemplate = (
  template: ITemplate,
  path: string,
): ITemplate => {
  if (template) {
    if (Array.isArray(template)) {
      return template
    } else if (typeof template === 'object') {
      let result: ITemplate = template
      const segments = path.replace(/\[(\d+)]/g, '.$1').split('.')
      for (let key of segments) {
        if (typeof result === 'object' && result !== null && key in result) {
          result = result[key as keyof ITemplate]
        } else {
          return undefined
        }
      }
      return result
    } else {
      return template
    }
  } else {
    return undefined
  }
}

export const getTypedValueFromTemplate = <T>(
  template: ITemplate,
  field: string,
  types: string[],
): T | undefined => {
  const value = getValueFromTemplate(template, field)

  for (let type of types) {
    if (typeof value === type) {
      return value as T
    }
  }
}
