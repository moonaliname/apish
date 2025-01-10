import SwaggerParser from '@apidevtools/swagger-parser'
import { nanoid } from 'nanoid'

import { handle } from '../shared/libs/handle.js'

import { DB } from '../shared/libs/database.js'
import { errorResponse, successResponse } from '../shared/libs/response.js'
import { type ISchema } from '@apish/common'
import { preparePaths } from '../shared/libs/preparePaths.js'
import { getConfig } from '../shared/services/config.js'

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
      const paths = preparePaths(swaggerDoc.paths)

      const [id] = await db.into('schema').insert({
        name,
        doc: swaggerFileContent,
        paths: JSON.stringify(paths),
      })

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

      return successResponse(schema)
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

      let endpointId
      if (endpoint) {
        endpointId = endpoint.id
      } else {
        const [id] = await db('endpoint').insert({
          method: method,
          path: path,
          is_enabled_proxy: true,
          schema_id: config.current_schema_id,
          updated_at: db.fn.now(),
        })
        endpointId = id
      }

      const newEndpoint = await db('endpoint')
        .where('id', '=', endpointId)
        .first()

      return successResponse(newEndpoint)
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

        let updatedEndpointId
        if (endpoint) {
          await db('endpoint')
            .where('id', '=', endpoint.id)
            .update({
              ...editEndpoint,
              updated_at: db.fn.now(),
            })

          updatedEndpointId = endpoint.id
        } else {
          const [id] = await db('endpoint').insert({
            ...editEndpoint,
            schema_id: config.current_schema_id,
            updated_at: db.fn.now(),
          })

          updatedEndpointId = id
        }

        const updatedEndpoint = await db('endpoint')
          .where('id', '=', updatedEndpointId)
          .first()
        return successResponse(updatedEndpoint)
      } catch (e) {
        return errorResponse(e, 500)
      }
    },
  )
}
