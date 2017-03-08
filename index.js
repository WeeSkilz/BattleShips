'use strict';
const electron = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
const { WindowState } = require(path.join(__dirname, '/js/enums'))

const app = electron.app

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1,
		height: 1,
		minWidth: 580,
		minHeight:620,
		titleBarStyle: 'hidden-inset' //on macOS this makes it look amazing
	})

	win.maximize();
	win.setResizable(false)

	win.loadURL(`file://${__dirname}/pages/index.html`)
	win.on('closed', onClosed)

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow()
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow()
	mainWindow.on('enter-full-screen', () => {
		mainWindow.setResizable(true)
		mainWindow.maximize();
		mainWindow.setResizable(false)
	})
})

ipcMain.on('close', (event, args) => {
	app.quit()
})

ipcMain.on('changeWindow', (event, args) => {
//I need to save this state to restore it next time the menu is opened.

	switch(args) {
		case WindowState.FULLSCREEN_WINDOWED:
			mainWindow.setKiosk(false)
			mainWindow.maximize()
			mainWindow.setResizable(false)
			break
		case WindowState.WINDOWED:
			mainWindow.setKiosk(false)
			mainWindow.setResizable(true)
			break
		case WindowState.FULLSCREEN:
			mainWindow.setKiosk(true)
			break
	}
})