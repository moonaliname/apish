import SwaggerParser from '@apidevtools/swagger-parser'
import { nanoid } from 'nanoid'

import { handle } from '../shared/libs/handle.js'

import { DB } from '../shared/libs/database.js'
import { errorResponse, successResponse } from '../shared/libs/response.js'
import { type ISchema } from '@apish/common'
import { preparePaths } from '../shared/libs/preparePaths.js'

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
}
