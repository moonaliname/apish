import { ipcMain } from 'electron'
import { DB } from '../database.js'
import { IPingRequest, IPC_PING_PATH, IPingResponse } from '@apish/common'

export function init() {
  const db = DB.getInstance()

  ipcMain.handle(
    IPC_PING_PATH,
    async (
      _event: Electron.IpcMainInvokeEvent,
      data: IPingRequest,
    ): Promise<IPingResponse> => {
      return {
        id: data.id,
        success: true,
      }
    },
  )
}
