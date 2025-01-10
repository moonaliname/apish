import { type ITemplate } from './types.js'

export const getValueFromTemplate = (
  template: ITemplate,
  path: string,
): ITemplate => {
  if (template) {
    if (Array.isArray(template)) {
      return template
    } else if (typeof template === 'object') {
      if (path in template) {
        return template[path as keyof ITemplate]
      } else {
        return undefined
      }
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
