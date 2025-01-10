import type { OpenAPI } from 'openapi-types'
import {
  getNonRefSchema,
  getSchemaVariantPath,
  SCHEMA_ITEMS_COUNT,
  SCHEMA_ITEMS_COUNT_PATH,
  SCHEMA_PAGE_SIZE,
  SCHEMA_PAGE_SIZE_PATH,
} from '@apish/common'
import type { OpenAPIReferenceObject, OpenAPISchemaObject } from '@apish/common'
import { getValueFromTemplate } from '@apish/common'
import { faker } from '@faker-js/faker'

type IPrimitiveField = string | number | boolean | null
type ITemplate =
  | {
      [key: string]: ITemplate | Array<ITemplate> | IPrimitiveField
    }
  | Array<ITemplate>
  | Array<IPrimitiveField>
  | IPrimitiveField
  | undefined

export class ResponseGenerator {
  doc: OpenAPI.Document
  template: ITemplate
  mode: 'response' | 'template'

  constructor({
    doc,
    template,
    mode = 'template',
  }: {
    doc: OpenAPI.Document
    template: ITemplate
    mode?: 'response' | 'template'
  }) {
    this.doc = doc
    this.template = template
    this.mode = mode
  }

  generate({
    schema: initialSchema,
    path,
    pagination,
  }: {
    schema?: OpenAPISchemaObject | OpenAPIReferenceObject
    path: string
    pagination?: { totalItems: number; pageSize: number }
  }): ITemplate {
    const { data: schema } = getNonRefSchema(this.doc, initialSchema)

    if (!schema) {
      return {}
    }

    if (schema.anyOf) {
      return this.processOfArraySchema({
        key: 'anyOf',
        schema: schema.anyOf,
        path,
      })
    } else if (schema.oneOf) {
      return this.processOfArraySchema({
        key: 'oneOf',
        schema: schema.oneOf,
        path,
      })
    } else if (schema.type === 'array') {
      const pageSize =
        pagination?.pageSize ?? this.getPageSizeFromTemplate(path)

      const items: Array<ITemplate> = []
      for (let i = 0; i < pageSize; i++) {
        items.push(
          this.generate({
            schema: schema.items,
            path: `${path}[${i}]`,
          }),
        )
      }
      return {
        apish_items: items,
        apish_items_settings: {
          [SCHEMA_ITEMS_COUNT_PATH]: this.getTotalItemsCountFromTemplate(path),
          [SCHEMA_PAGE_SIZE_PATH]: pageSize,
        },
      }
    } else if (schema.type === 'object') {
      const obj: ITemplate = {}

      if ('additionalProperties' in schema) {
        const templateValue = this.getValueFromTemplate(path)

        if (typeof schema.additionalProperties == 'boolean') {
          return templateValue ?? {}
        }

        let key = templateValue
          ? Object.keys(templateValue)[0]
          : faker.lorem.word()

        const newValue = this.generate({
          schema: schema.additionalProperties,
          path: `${path}.${key}`,
        })

        if (
          newValue &&
          typeof newValue == 'object' &&
          'apish_items' in newValue
        ) {
          obj[key] = newValue['apish_items']

          if (this.mode === 'template') {
            obj[`${key}_apish_items_settings`] =
              newValue['apish_items_settings']
          }
        } else {
          obj[key] = newValue
        }
      } else {
        const isPageSchema = this.getIsPageSchema(schema.properties)

        for (let key in schema.properties) {
          const propertyPath = this.getFullKeyPath(path, key)

          if (isPageSchema) {
            const itemsKeyPath = this.getFullKeyPath(path, 'items')
            const totalItems = this.getTotalItemsCountFromTemplate(itemsKeyPath)
            const pageSize = this.getPageSizeFromTemplate(itemsKeyPath)

            if (['total', 'page', 'size', 'pages'].includes(key)) {
              obj['total'] = totalItems
              obj['page'] = 1
              obj['size'] = pageSize
              obj['pages'] = Math.round(totalItems / pageSize)
            }
          }

          let pagination
          if (isPageSchema && key === 'items') {
            const itemsKeyPath = this.getFullKeyPath(path, 'items')

            pagination = {
              totalItems: this.getTotalItemsCountFromTemplate(itemsKeyPath),
              pageSize: this.getPageSizeFromTemplate(itemsKeyPath),
            }
          }

          const newValue = this.generate({
            schema: schema.properties[key],
            path: propertyPath,
            pagination,
          })
          if (
            newValue &&
            typeof newValue == 'object' &&
            'apish_items' in newValue
          ) {
            obj[key] = newValue['apish_items']

            if (this.mode === 'template') {
              obj[`${key}_apish_items_settings`] =
                newValue['apish_items_settings']
            }
          } else {
            obj[key] = newValue
          }
        }
      }

      return obj
    } else {
      const templateValue = this.getValueFromTemplate(path)
      return templateValue !== undefined
        ? templateValue
        : this.generatePrimitiveValue(schema)
    }
  }

  private processOfArraySchema<T extends 'oneOf' | 'anyOf'>({
    key,
    schema,
    path,
  }: {
    key: T
    schema: Exclude<OpenAPISchemaObject[T], undefined>
    path: string
  }): ITemplate {
    const fullPath = `${path}.${key}`
    const selected = this.getValueFromTemplate(`${fullPath}.selected`)

    const result: Record<string, { selected?: string } & Record<string, any>> =
      {
        [key]: {
          selected: undefined,
        },
      }

    for (let schemaIndex = 0; schemaIndex < schema.length; schemaIndex++) {
      const { data: optionSchema } = getNonRefSchema(
        this.doc,
        schema[schemaIndex],
      )

      if (!optionSchema) {
        continue
      }

      const variantPath = getSchemaVariantPath({ schema: optionSchema })

      if (schemaIndex === 0) {
        result[key].selected = variantPath
      }

      if (variantPath === selected) {
        result[key].selected = selected
      }

      const variantValue = this.generate({
        schema: optionSchema,
        path: `${fullPath}.${variantPath}`,
      })
      result[key][variantPath] = variantValue
    }

    if (this.mode === 'response') {
      const selected = result[key].selected

      if (selected === 'undefined' || selected === undefined) {
        return undefined
      }

      if (selected === 'null' || selected === null) {
        return null
      }

      return result[key][selected]
    }

    return result
  }

  private getIsPageSchema(schema?: OpenAPISchemaObject): boolean {
    if (!schema) return false

    const requiredKeys = ['total', 'page', 'size', 'pages', 'items']

    let isPageSchema = true

    for (let requiredKey of requiredKeys) {
      isPageSchema = requiredKey in schema
      if (!isPageSchema) break
    }

    return isPageSchema
  }

  private getValueFromTemplate(path: string): ITemplate {
    return getValueFromTemplate(this.template, path)
  }

  private generatePrimitiveValue(schema: OpenAPISchemaObject): IPrimitiveField {
    if (!schema) return null

    if (schema.enum) return faker.helpers.arrayElement(schema.enum)

    switch (schema.type) {
      case 'string':
        if (schema.format === 'date-time') {
          return faker.date.past().toISOString().split('T')[0]
        }
        return faker.lorem.sentence()
      case 'integer':
        const { minimum = 0, maximum = 100, multipleOf } = schema
        let generatedNumber = faker.number.int({ min: minimum, max: maximum })

        if (multipleOf) {
          generatedNumber =
            Math.floor(generatedNumber / multipleOf) * multipleOf
        }

        return generatedNumber
      case 'boolean':
        return faker.datatype.boolean()
      default:
        return null
    }
  }

  private getPageSizeFromTemplate(path: string): number {
    return Number(
      this.getValueFromTemplate(
        `${path}_apish_items_settings.${SCHEMA_PAGE_SIZE_PATH}`,
      ) ?? SCHEMA_PAGE_SIZE,
    )
  }

  private getTotalItemsCountFromTemplate(path: string): number {
    return Number(
      this.getValueFromTemplate(
        `${path}_apish_items_settings.${SCHEMA_ITEMS_COUNT_PATH}`,
      ) ?? SCHEMA_ITEMS_COUNT,
    )
  }

  private getFullKeyPath(path: string, key: string): string {
    return path ? `${path}.${key}` : key
  }
}
