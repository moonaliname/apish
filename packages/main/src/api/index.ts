import Fastify from 'fastify'
import { ResponseGenerator } from './generateResponse.js'
import replyFrom from '@fastify/reply-from'
import { getActiveSchema } from '../shared/services/schema.js'
import { getSearchPathByRequest } from '../shared/libs/searchPaths/getSearchPathByRequest.js'

import { DB } from '../shared/libs/database.js'
import { getResponseFromSearchPath } from '../shared/libs/searchPaths/getResponseFromSearchPath.js'
import { getSchemaFromResponse } from '../shared/libs/schema/getSchemaFromResponse.js'

const TARGET = 'http://127.0.0.1:3002'

export async function buildApi() {
  const db = DB.getInstance()

  const fastify = Fastify()

  fastify.addContentTypeParser(
    ['application/x-www-form-urlencoded', 'multipart/form-data'],
    (_req, payload, done) => {
      done(null, payload)
    },
  )

  await fastify.register(replyFrom, {
    base: TARGET,
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
      const responseGenerator = new ResponseGenerator({
        doc: JSON.parse(schema.doc),
        template: {},
      })
      const response = responseGenerator.generate({
        schema: schemaObject,
        path: '',
      })

      return reply.status(200).send(response)
      return reply.from(request.raw.url)
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
}
