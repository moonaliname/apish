import { sha256sum } from './nodeCrypto.js'
import { versions } from './versions.js'
import { ipcRenderer } from 'electron'

function send<T = string, R = string>(channel: string, message: T): Promise<R> {
  return ipcRenderer.invoke(channel, message)
}

export { sha256sum, versions, send }
