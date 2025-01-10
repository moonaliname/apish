import type { OpenAPI } from 'openapi-types'
import {
  getNonRefSchema,
  SCHEMA_ITEMS_COUNT,
  SCHEMA_ITEMS_COUNT_PATH,
  SCHEMA_PAGE_SIZE,
  SCHEMA_PAGE_SIZE_PATH,
} from '@apish/common'
import type { OpenAPIReferenceObject, OpenAPISchemaObject } from '@apish/common'
import { getValueFromTemplate } from '@apish/common'
import { faker } from '@faker-js/faker'

type IPrimitiveField = string | number | boolean | Date | null
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

  constructor({
    doc,
    template,
  }: {
    doc: OpenAPI.Document
    template: ITemplate
  }) {
    this.doc = doc
    this.template = template
  }

  generate({
    schema: initialSchema,
    path,
  }: {
    schema?: OpenAPISchemaObject | OpenAPIReferenceObject
    path: string
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
      const pageSize = this.getPageSizeFromTemplate(path)

      const items: Array<ITemplate> = []
      for (let i = 0; i < pageSize; i++) {
        items.push(
          this.generate({
            schema: schema.items,
            path: `${path}[${i}]`,
          }),
        )
      }
      return items
    } else if (schema.type === 'object') {
      const obj: ITemplate = {}

      if ('additionalProperties' in schema) {
        if (typeof schema.additionalProperties == 'boolean') {
          return {}
        }
        const templateValue = this.getValueFromTemplate(path)

        const key = faker.lorem.word()
        obj[key] =
          templateValue !== undefined
            ? templateValue
            : this.generate({
                schema: schema.additionalProperties,
                path: path,
              })
      } else {
        const isPageSchema = this.getIsPageSchema(schema.properties)

        for (let key in schema.properties) {
          const propertyPath = path ? `${path}.${key}` : key
          const templateValue = this.getValueFromTemplate(propertyPath)

          if (isPageSchema) {
            const totalItems = this.getTotalItemsCountFromTemplate(path)
            const pageSize = this.getPageSizeFromTemplate(path)

            obj['total'] = totalItems
            obj['page'] = 1
            obj['size'] = pageSize
            obj['pages'] = Math.round(totalItems / pageSize)

            if (!['total', 'page', 'size', 'pages'].includes(key)) {
              obj[key] =
                templateValue !== undefined
                  ? templateValue
                  : this.generate({
                      schema: schema.properties[key],
                      path: propertyPath,
                    })
            }
          } else {
            obj[key] =
              templateValue !== undefined
                ? templateValue
                : this.generate({
                    schema: schema.properties[key],
                    path: propertyPath,
                  })
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
    const fullPath = `${path}.${key}.selected`
    const selected = this.getValueFromTemplate(path)

    if (selected) {
      const option = schema.find((option) => {
        const { data: optionSchema } = getNonRefSchema(this.doc, option)

        if (!optionSchema) {
          return undefined
        }

        return optionSchema.title === selected
      })
      if (option) {
        return this.generate({
          schema: option,
          path: fullPath,
        })
      }
    }

    return this.generate({
      schema: faker.helpers.arrayElement(schema),
      path: fullPath,
    })
  }

  private getIsPageSchema(schema?: OpenAPISchemaObject): boolean {
    if (!schema) return false

    const requiredKeys = ['total', 'page', 'size', 'pages', 'items']

    let isPageSchema = true

    for (let requiredKey in requiredKeys) {
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
          return faker.date.past()
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
    return (
      Number(this.getValueFromTemplate(`${path}${SCHEMA_PAGE_SIZE_PATH}`)) ||
      SCHEMA_PAGE_SIZE
    )
  }

  private getTotalItemsCountFromTemplate(path: string): number {
    return (
      Number(this.getValueFromTemplate(`${path}${SCHEMA_ITEMS_COUNT_PATH}`)) ||
      SCHEMA_ITEMS_COUNT
    )
  }
}
