import type { ElectronApplication, JSHandle } from 'playwright'
import { _electron as electron } from 'playwright'
import { expect, test as base } from '@playwright/test'
import type { BrowserWindow } from 'electron'
import { globSync } from 'glob'
import { platform } from 'node:process'
import { createHash } from 'node:crypto'
import { join, dirname } from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Declare the types of your fixtures.
type TestFixtures = {
  electronApp: ElectronApplication
  electronVersions: NodeJS.ProcessVersions
}

const test = base.extend<TestFixtures>({
  electronApp: [
    async ({}, use) => {
      let executablePattern = 'dist/*/apish{,.*}'
      if (platform === 'darwin') {
        executablePattern += '/Contents/*/apish'
      }

      const [executablePath] = globSync(executablePattern)
      if (!executablePath) {
        throw new Error('App Executable path not found')
      }

      const electronApp = await electron.launch({
        executablePath: executablePath,
      })

      await use(electronApp)

      // This code runs after all the tests in the worker process.
      // await electronApp.close()
    },
    { scope: 'worker', auto: true } as any,
  ],

  page: async ({ electronApp }, use) => {
    const page = await electronApp.firstWindow()
    // capture errors
    page.on('pageerror', (error) => {
      console.error(error)
    })
    // capture console messages
    page.on('console', (msg) => {
      console.log(msg.text())
    })

    await page.waitForLoadState('load')
    await use(page)
  },

  electronVersions: async ({ electronApp }, use) => {
    await use(await electronApp.evaluate(() => process.versions))
  },
})

test('Main window state', async ({ electronApp, page }) => {
  const window: JSHandle<BrowserWindow> = await electronApp.browserWindow(page)
  const windowState = await window.evaluate(
    (
      mainWindow,
    ): Promise<{
      isVisible: boolean
      isDevToolsOpened: boolean
      isCrashed: boolean
    }> => {
      const getState = () => ({
        isVisible: mainWindow.isVisible(),
        isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
        isCrashed: mainWindow.webContents.isCrashed(),
      })

      return new Promise((resolve) => {
        /**
         * The main window is created hidden, and is shown only when it is ready.
         * See {@link ../packages/main/src/mainWindow.ts} function
         */
        if (mainWindow.isVisible()) {
          resolve(getState())
        } else {
          mainWindow.once('ready-to-show', () => resolve(getState()))
        }
      })
    },
  )

  expect(windowState.isCrashed, 'The app has crashed').toEqual(false)
  expect(windowState.isVisible, 'The main window was not visible').toEqual(true)
  expect(windowState.isDevToolsOpened, 'The DevTools panel was open').toEqual(
    false,
  )
})

test.describe('Main window web content', async () => {
  test('The main window has upload new swagger button', async ({ page }) => {
    const uploadNewButton = page.getByRole('button', {
      name: 'Upload new',
    })
    await expect(uploadNewButton).toBeVisible()
  })

  test('The main window has schemas button', async ({ page }) => {
    const schemasButton = page.getByRole('button', {
      name: 'Schemas',
    })
    await expect(schemasButton).toBeVisible()
  })

  test('The main window has not schema selected text', async ({ page }) => {
    await expect(page.getByText(`Schema isn't selected`)).toBeVisible()
  })

  test('Should show empty list in schemas modal', async ({ page }) => {
    const schemasButton = page.getByRole('button', {
      name: 'Schemas',
    })

    await schemasButton.click()

    await expect(page.getByText('No schemas uploaded')).toBeVisible()

    await page.keyboard.press('Escape')
  })

  test('Should upload schema', async ({ page }) => {
    const uploadNewButton = page.getByRole('button', {
      name: 'Upload new',
    })

    await uploadNewButton.click()

    await expect(page.getByText('Swagger.json *')).toBeVisible()

    const fileChooserPromise = page.waitForEvent('filechooser')
    await page.getByText('Select swagger.json file').click()
    const fileChooser = await fileChooserPromise
    await fileChooser.setFiles(join(__dirname, 'openapi.json'))

    await page.getByPlaceholder('Schema name').fill('Todos API schema')

    const submitButton = page.getByRole('button', {
      name: 'Upload',
      exact: true,
    })
    await submitButton.click()

    const schemasButton = page.getByRole('button', {
      name: 'Schemas',
    })

    await schemasButton.click()

    const schemaButton = page.getByRole('button', {
      name: 'Todos API schema',
    })
    await schemaButton.click()

    await page.keyboard.press('Escape')

    await expect(page.getByText(`Schema isn't selected`)).not.toBeVisible()
  })

  test('Proxy get request', async ({ page, request }) => {
    const res = await request.get('http://localhost:3002/todos')
    expect(res.status()).toBe(200)
  })

  test('Proxy post request', async ({ request }) => {
    const res = await request.post('http://localhost:3002/todos', {
      data: { data: 'todo' },
    })
    expect(res.status()).toBe(200)
  })

  test('Proxy delete request', async ({ request }) => {
    const res = await request.delete('http://localhost:3002/todos/1')
    expect(res.status()).toBe(200)
  })

  test('Proxy put request', async ({ request }) => {
    const res = await request.put('http://localhost:3002/todos/1', {
      data: { data: 'new todo' },
    })
    expect(res.status()).toBe(200)
  })
})

test.describe('Preload context should be exposed', async () => {
  test.describe(`versions should be exposed`, async () => {
    test('with same type`', async ({ page }) => {
      const type = await page.evaluate(
        () => typeof globalThis[btoa('versions')],
      )
      expect(type).toEqual('object')
    })

    test('with same value', async ({ page, electronVersions }) => {
      const value = await page.evaluate(() => globalThis[btoa('versions')])
      expect(value).toEqual(electronVersions)
    })
  })

  test.describe(`sha256sum should be exposed`, async () => {
    test('with same type`', async ({ page }) => {
      const type = await page.evaluate(
        () => typeof globalThis[btoa('sha256sum')],
      )
      expect(type).toEqual('function')
    })

    test('with same behavior', async ({ page }) => {
      const testString = btoa(`${Date.now() * Math.random()}`)
      const expectedValue = createHash('sha256')
        .update(testString)
        .digest('hex')
      const value = await page.evaluate(
        (str) => globalThis[btoa('sha256sum')](str),
        testString,
      )
      expect(value).toEqual(expectedValue)
    })
  })

  test.describe(`invoke should be exposed`, async () => {
    test('with same type`', async ({ page }) => {
      const type = await page.evaluate(() => typeof globalThis[btoa('invoke')])
      expect(type).toEqual('function')
    })

    test('with same behavior', async ({ page, electronApp }) => {
      await electronApp.evaluate(async ({ ipcMain }) => {
        ipcMain.handle('test', (event, message) => btoa(message))
      })

      const testString = btoa(`${Date.now() * Math.random()}`)
      const expectedValue = btoa(testString)
      const value = await page.evaluate(
        async (str) => await globalThis[btoa('invoke')]('test', str),
        testString,
      )
      expect(value).toEqual(expectedValue)
    })
  })
})
