import SwaggerParser from '@apidevtools/swagger-parser'
import { nanoid } from 'nanoid'

import { handle } from '../shared/libs/channelHandlers.js'

import { DB } from '../shared/libs/database.js'
import { errorResponse, successResponse } from '../shared/libs/response.js'
import { getSchemaFromResponse, type ISchema } from '@apish/common'
import { getConfig } from '../shared/services/config.js'
import { getSearchPaths } from '../shared/libs/searchPaths/getSearchPaths.js'
import { ResponseGenerator } from '../api/generateResponse.js'

export function init() {
  const db = DB.getInstance()

  handle('schemaUpload', async (_event, data) => {
    try {
      const swaggerFileContent = Buffer.from(data.file).toString('utf-8')
      const swaggerDoc: SwaggerParser['api'] = JSON.parse(swaggerFileContent)

      try {
        await SwaggerParser.validate(swaggerDoc)
      } catch (e) {
        return errorResponse(e, 400)
      }

      let name = data.name || swaggerDoc.info.title || 'Unnamed'

      const existingSchema = await db
        .table<ISchema['name']>('schema')
        .first('name')
        .where('name', '=', name)

      if (existingSchema) {
        name = `${name}_${nanoid()}`
      }
      const paths = getSearchPaths(swaggerDoc.paths)

      const [id] = await db.into('schema').insert({
        name,
        doc: swaggerFileContent,
        paths: JSON.stringify(paths),
      })

      const pathsArr = Object.entries(paths)

      const responseGenerator = new ResponseGenerator({
        doc: swaggerDoc,
        template: {},
      })

      for (let [method, searchPaths] of pathsArr) {
        for (let searchPath of searchPaths) {
          const [endpointId] = await db.into('endpoint').insert({
            path: searchPath.schemaPath,
            method,
            schema_id: id,
          })
          if (!searchPath.methodSchema.responses) {
            continue
          }

          const responsesSchemas = Object.entries(
            searchPath.methodSchema.responses,
          )

          let updatedEndpoint = false
          for (let [code, responseSchema] of responsesSchemas) {
            if (!updatedEndpoint) {
              await db
                .table('endpoint')
                .where('id', '=', endpointId)
                .update({ enabled_code: code })
              updatedEndpoint = true
            }

            const { data: schemaObject, error: schemaObjectError } =
              getSchemaFromResponse(swaggerDoc, responseSchema)

            if (!schemaObject) {
              continue
            }
            const response = responseGenerator.generate({
              schema: schemaObject,
              path: '',
            })

            await db.into('response').insert({
              path: searchPath.schemaPath,
              method,
              code,
              template: JSON.stringify(response),
              schema_id: id,
            })
          }
        }
      }

      const schema = await db
        .table<ISchema>('schema')
        .first('*')
        .where('id', '=', id)

      return successResponse(schema, 200)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('getSchemaList', async () => {
    try {
      const schemas = await db.table('schema').select('*')

      return successResponse(schemas)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('getSchema', async (_event, { id }) => {
    try {
      const schema = await db.table('schema').where('id', '=', id).first()

      if (!schema) {
        return errorResponse(`Schema with id ${id} wasn't found`, 404)
      }

      return successResponse(schema)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('deleteSchema', async (_event, { id }) => {
    try {
      const schema = await db.table('schema').where('id', '=', id).first()

      if (!schema) {
        return errorResponse(`Schema with id ${id} wasn't found`, 404)
      }

      await db.table('schema').where('id', '=', id).delete()

      return successResponse(`Schema was successfully deleted`)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('getConfig', async () => {
    try {
      const config = await getConfig(db)

      return successResponse(config)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('updateConfig', async (_event, editConfig) => {
    try {
      const config = await getConfig(db)
      await db.table('config').where('id', '=', config.id).update(editConfig)
      const updatedConfig = await getConfig(db)

      return successResponse(updatedConfig)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle('getEndpoint', async (_event, { method, path }) => {
    try {
      const config = await getConfig(db)

      if (!config.current_schema_id) {
        return errorResponse("Current schema isn't selected", 400)
      }

      const endpoint = await db
        .table('endpoint')
        .where('method', '=', method)
        .where('path', '=', path)
        .where('schema_id', '=', config.current_schema_id)
        .first()

      if (!endpoint) {
        return errorResponse(
          `Endpoint with path ${path} and method ${method} wasn't found`,
          404,
        )
      }

      return successResponse(endpoint)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle(
    'updateEndpoint',
    async (_event, { path, method, ...editEndpoint }) => {
      try {
        const config = await getConfig(db)

        if (!config.current_schema_id) {
          return errorResponse("Current schema isn't selected", 400)
        }

        const endpoint = await db
          .table('endpoint')
          .where('method', '=', method)
          .where('path', '=', path)
          .where('schema_id', '=', config.current_schema_id)
          .first()

        if (!endpoint) {
          return errorResponse(
            `Endpoint with path ${path} and method ${method} wasn't found`,
            404,
          )
        }

        await db('endpoint')
          .where('id', '=', endpoint.id)
          .update({
            ...editEndpoint,
            updated_at: db.fn.now(),
          })

        const updatedEndpoint = await db('endpoint')
          .where('id', '=', endpoint.id)
          .first()
        return successResponse(updatedEndpoint)
      } catch (e) {
        return errorResponse(e, 500)
      }
    },
  )

  handle('getResponse', async (_event, { method, path, code }) => {
    try {
      const config = await getConfig(db)

      if (!config.current_schema_id) {
        return errorResponse("Current schema isn't selected", 400)
      }

      const response = await db
        .table('response')
        .where('method', '=', method)
        .where('path', '=', path)
        .where('code', '=', code)
        .where('schema_id', '=', config.current_schema_id)
        .first()

      if (!response) {
        return errorResponse(
          `Response with path ${path} and method ${method} and code ${code} wasn't found`,
          404,
        )
      }

      return successResponse(response)
    } catch (e) {
      return errorResponse(e, 500)
    }
  })

  handle(
    'updateResponse',
    async (_event, { path, method, code, ...editResponse }) => {
      try {
        const config = await getConfig(db)

        if (!config.current_schema_id) {
          return errorResponse("Current schema isn't selected", 400)
        }

        const response = await db
          .table('response')
          .where('method', '=', method)
          .where('path', '=', path)
          .where('code', '=', code)
          .where('schema_id', '=', config.current_schema_id)
          .first()

        if (!response) {
          return errorResponse(
            `Response with path ${path} and method ${method} and code ${code} wasn't found`,
            404,
          )
        }

        await db('response')
          .where('id', '=', response.id)
          .update({
            ...editResponse,
            updated_at: db.fn.now(),
          })

        const updatedResponse = await db('response')
          .where('id', '=', response.id)
          .first()
        return successResponse(updatedResponse)
      } catch (e) {
        return errorResponse(e, 500)
      }
    },
  )
}
