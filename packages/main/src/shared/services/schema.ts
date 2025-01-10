import knex from 'knex'
import { getConfig } from './config.js'
import type { ISchema } from '@apish/common'

export const getActiveSchema = async (
  db: knex.Knex,
): Promise<ISchema | undefined> => {
  const config = await getConfig(db)

  if (!config.current_schema_id) {
    return
  }

  return db
    .table<ISchema>('schema')
    .first()
    .where('id', '=', config.current_schema_id)
}
