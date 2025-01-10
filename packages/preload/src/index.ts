import { sha256sum } from './nodeCrypto.js'
import { versions } from './versions.js'
import { ipcRenderer } from 'electron'
import type { ChannelMap } from '@apish/common'

function send<K extends keyof ChannelMap>(
  channel: K,
  message?: ChannelMap[K]['request'] extends undefined
    ? never
    : ChannelMap[K]['request'],
): Promise<ChannelMap[K]['response']> {
  return ipcRenderer.invoke(channel, message)
}

export { sha256sum, versions, send }
