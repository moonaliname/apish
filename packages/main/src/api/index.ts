import Fastify from 'fastify'
import { ResponseGenerator } from './generateResponse.js'
import replyFrom from '@fastify/reply-from'
import { getActiveSchema } from '../shared/services/schema.js'
import { getSearchPathByRequest } from '../shared/libs/searchPaths/getSearchPathByRequest.js'
import { DB } from '../shared/libs/database.js'
import { getResponseFromSearchPath } from '../shared/libs/searchPaths/getResponseFromSearchPath.js'
import { getSchemaFromResponse } from '../shared/libs/schema/getSchemaFromResponse.js'
import type { IEndpoint, IResponse } from '@apish/common'
import { getConfig } from '../shared/services/config.js'
import { handleOnce } from '../shared/libs/channelHandlers.js'
import { errorResponse, successResponse } from '../shared/libs/response.js'

export async function buildApi() {
  const db = DB.getInstance()

  const fastify = Fastify()

  fastify.addContentTypeParser(
    ['application/x-www-form-urlencoded', 'multipart/form-data'],
    (_req, payload, done) => {
      done(null, payload)
    },
  )

  const config = await getConfig(db)

  await fastify.register(replyFrom, {
    base: config.target_url ?? '',
  })

  fastify.all('*', {}, async (request, reply) => {
    const urlPath = request.raw.url
    if (!urlPath) {
      reply.status(400).send({ error: 'No url found' })
      return
    }

    const schema = await getActiveSchema(db)
    if (!schema) {
      return reply.from(request.raw.url)
    }

    const schemaPaths = JSON.parse(schema.paths)

    const method = request.method

    if (method === 'OPTIONS') {
      return reply.from(request.raw.url)
    }

    const searchPath = getSearchPathByRequest({
      paths: schemaPaths,
      request: { url: urlPath, method },
    })
    const responseSchema = getResponseFromSearchPath({ searchPath })

    const schemaObject = getSchemaFromResponse(responseSchema)

    if (responseSchema) {
      const endpoint = await db
        .table('endpoint')
        .where('method', '=', method.toLowerCase())
        .where('path', '=', searchPath?.schemaPath ?? '')
        .where('schema_id', '=', schema.id)
        .first<IEndpoint>()

      if (!endpoint.is_enabled_proxy) {
        return reply.from(request.raw.url)
      }

      const response = await db
        .table('response')
        .where('method', '=', method.toLowerCase())
        .where('path', '=', searchPath?.schemaPath ?? '')
        .where('code', '=', endpoint.enabled_code)
        .where('schema_id', '=', schema.id)
        .first<IResponse>()

      const template = response?.template ? JSON.parse(response.template) : {}

      const responseGenerator = new ResponseGenerator({
        doc: JSON.parse(schema.doc),
        template,
        mode: 'response',
      })

      const generatedResponse = responseGenerator.generate({
        schema: schemaObject,
        path: '',
      })

      return reply.status(200).send(generatedResponse)
    } else {
      reply
        .status(404)
        .send({ error: 'Path or method not found in Swagger schema' })
    }
  })

  fastify.listen({ port: 3002 }, (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`Server listening at ${address}`)
  })

  handleOnce('reloadServer', async () => {
    try {
      await fastify.close()
      await buildApi()
      return successResponse('Server is reloaded')
    } catch (e) {
      return errorResponse(e, 500)
    }
  })
}
