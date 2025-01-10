import knex from 'knex'
import path from 'node:path'
import { app } from 'electron'

export class DB {
  private static instance: knex.Knex

  private constructor() {}

  public static getInstance(): knex.Knex {
    if (!DB.instance) {
      DB.instance = knex({
        client: 'sqlite3',
        connection: {
          filename: path.join(app.getPath('userData'), 'apish_data.db'),
        },
        useNullAsDefault: true,
      })
    }
    return DB.instance
  }
}

export const createDBTables = async () => {
  const db = DB.getInstance()
  await db.raw('PRAGMA foreign_keys = ON')

  db.schema
    .hasTable('schema')
    .then(function (exists) {
      if (!exists) {
        return db.schema.createTable('schema', (table) => {
          table.increments('id').primary()
          table.string('name')
          table.binary('doc')
          table.binary('paths')
          table.timestamp('created_at').defaultTo(db.fn.now())
          table.timestamp('updated_at').defaultTo(db.fn.now())
        })
      }
    })
    .then(() => {
      db.schema.hasTable('endpoint').then(function (exists) {
        if (!exists) {
          return db.schema.createTable('endpoint', (table) => {
            table.increments('id').primary()
            table.string('path')
            table.string('method')
            table.boolean('is_enabled_proxy').defaultTo(true)
            table.string('enabled_code')
            table.timestamp('created_at').defaultTo(db.fn.now())
            table.timestamp('updated_at').defaultTo(db.fn.now())

            table.integer('schema_id').unsigned().notNullable()
            table
              .foreign('schema_id')
              .references('schema.id')
              .onDelete('CASCADE')
          })
        }
      })

      db.schema.hasTable('response').then(function (exists) {
        if (!exists) {
          return db.schema.createTable('response', (table) => {
            table.increments('id').primary()
            table.string('path')
            table.string('method')
            table.string('code')
            table.binary('template').defaultTo(JSON.stringify({}))
            table.timestamp('created_at').defaultTo(db.fn.now())
            table.timestamp('updated_at').defaultTo(db.fn.now())

            table.integer('schema_id').unsigned().notNullable()
            table
              .foreign('schema_id')
              .references('schema.id')
              .onDelete('CASCADE')
          })
        }
      })

      db.schema.hasTable('config').then(async function (exists) {
        if (!exists) {
          await db.schema.createTable('config', (table) => {
            table.increments('id').primary()

            table.integer('current_schema_id').unsigned().nullable()
            table
              .foreign('current_schema_id')
              .references('schema.id')
              .onDelete('SET NULL')
          })

          db.table('config').insert({ current_schema_id: null })
        }
      })
    })

  return db
}
