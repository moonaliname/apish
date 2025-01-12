import { ipcMain } from 'electron'
import type {
  ChannelMap,
  IErrorResponse,
  ISuccessResponse,
} from '@apish/common'

function handle<K extends keyof ChannelMap>(
  channel: K,
  callback: ChannelMap[K] extends { sync: true }
    ? (
        _event: Electron.IpcMainInvokeEvent,
        message: ChannelMap[K]['request'],
      ) => ISuccessResponse<ChannelMap[K]['response']> | IErrorResponse
    : (
        _event: Electron.IpcMainInvokeEvent,
        message: ChannelMap[K]['request'],
      ) => Promise<
        ISuccessResponse<ChannelMap[K]['response']> | IErrorResponse
      >,
) {
  return ipcMain.handle(channel, callback)
}

function handleOnce<K extends keyof ChannelMap>(
  channel: K,
  callback: (
    _event: Electron.IpcMainInvokeEvent,
    message: ChannelMap[K]['request'],
  ) => Promise<ISuccessResponse<ChannelMap[K]['response']> | IErrorResponse>,
) {
  return ipcMain.handleOnce(channel, callback)
}

function on<K extends keyof ChannelMap>(
  channel: K,
  callback: (_event: Electron.IpcMainEvent) => void,
) {
  return ipcMain.on(channel, callback)
}

export { handle, handleOnce, on }
