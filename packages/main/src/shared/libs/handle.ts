import type { ChannelMap } from '@apish/common'
import { ipcMain } from 'electron'

function handle<K extends keyof ChannelMap>(
  channel: K,
  callback: (
    _event: Electron.IpcMainInvokeEvent,
    message: ChannelMap[K]['request'],
  ) => Promise<ChannelMap[K]['response']>,
) {
  return ipcMain.handle(channel, callback)
}

export { handle }
