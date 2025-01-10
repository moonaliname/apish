import knex from 'knex'

export const getConfig = async (db: knex.Knex) => {
  let appState = await db.table('config').first()

  if (!appState) {
    await db.table('config').insert({ current_schema_id: null })
    return db.table('config').first()
  } else {
    return appState
  }
}
