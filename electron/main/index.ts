import { app, BrowserWindow, shell, ipcMain, dialog } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { getSvnEditPath, splitRecord } from '../utils/core'
import { copyFile } from '../utils/file'
import { convertObjToArray } from '../utils/transform'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

process.env.DIST = join(__dirname, '../..')
process.env.PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public')

let win: BrowserWindow | null = null
let basePath = ''
let globalRecordFileMap = {}
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.platform === 'darwin') {
    console.log('__dirname', __dirname)
    app.dock.setIcon(join(process.env.PUBLIC, 'icon.png'));
  }

  if (app.isPackaged) {
    win.loadFile(indexHtml)
    win.webContents.openDevTools()
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}/#${arg}`)
  }
})

ipcMain.on('open-file', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
    console.log(result.filePaths)
    const filePath = basePath = result.filePaths[0]
    event.reply('open-file-reply', [])
    getSvnEditPath(filePath, (recordList) => {
      event.reply('open-file-reply', recordList)
    })
  })
})

ipcMain.on('split-record', (event, arg) => {
  const { fileStr, recordFileMap } = splitRecord(JSON.parse(arg.list), arg.projectName, basePath, arg.svnPath)
  globalRecordFileMap = recordFileMap
  event.reply('split-record-reply', fileStr)
})

ipcMain.on('gen-fold', (event, arg) => {
  dialog.showOpenDialog({ properties: ['openDirectory'] }).then(result => {
    const filePath = result.filePaths[0]
    copyFile(convertObjToArray(globalRecordFileMap), basePath, filePath, "./new/", arg.projectName, arg.svnPath, (err, item, dest) => {
      event.reply('gen-fold-err', {
        err,
        item,
        dest
      })
    })
    event.reply('gen-fold-reply', { success: true })
  })
})
