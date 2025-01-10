import { initApp } from '@apish/main'
import { fileURLToPath } from 'node:url'

/**
 * We resolve '@apish/renderer' and '@apish/preload'
 * here and not in '@apish/main'
 * to observe good practices of modular design.
 * This allows fewer dependencies and better separation of concerns in '@apish/main'.
 * Thus,
 * the main module remains simplistic and efficient
 * as it receives initialization instructions rather than direct module imports.
 */
initApp({
  renderer:
    process.env.MODE === 'development' && !!process.env.VITE_DEV_SERVER_URL
      ? new URL(process.env.VITE_DEV_SERVER_URL)
      : {
          path: fileURLToPath(import.meta.resolve('@apish/renderer')),
        },

  preload: {
    path: fileURLToPath(import.meta.resolve('@apish/preload/exposed.mjs')),
  },
})
