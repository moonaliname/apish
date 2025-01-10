import { handle } from '../shared/libs/handle.js'

import { DB } from '../shared/libs/database.js'

export function init() {
  const db = DB.getInstance()

  handle('ping', async (_event, data) => {
    return {
      id: data.id,
      success: true,
    }
  })
}
