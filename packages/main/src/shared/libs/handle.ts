import { ipcMain } from 'electron'
import type {
  ChannelMap,
  IErrorResponse,
  ISuccessResponse,
} from '@apish/common'

function handle<K extends keyof ChannelMap>(
  channel: K,
  callback: (
    _event: Electron.IpcMainInvokeEvent,
    message: ChannelMap[K]['request'],
  ) => Promise<ISuccessResponse<ChannelMap[K]['response']> | IErrorResponse>,
) {
  return ipcMain.handle(channel, callback)
}

export { handle }
