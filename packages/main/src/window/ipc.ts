import { successResponse } from '../shared/libs/response.js'
import { handle, on } from '../shared/libs/channelHandlers.js'

import { BrowserWindow } from 'electron'

export function init(browserWindow: BrowserWindow) {
  on('windowMinimize', () => {
    browserWindow.minimize()
  })

  on('windowToggleMaximize', async () => {
    const isMaximized = browserWindow.isMaximized()
    if (isMaximized) {
      browserWindow.unmaximize()
    } else {
      browserWindow.maximize()
    }
  })

  handle('windowGetIsMaximized', () => {
    return successResponse(browserWindow.isMaximized())
  })

  on('windowClose', async () => {
    browserWindow.close()
  })
}
