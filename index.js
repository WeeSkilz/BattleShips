'use strict';
const electron = require('electron');

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1,
		height: 1,
		titleBarStyle: 'hidden-inset'
	});

	win.maximize();
	win.setResizable(false)

	win.loadURL(`file://${__dirname}/pages/index.html`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
	mainWindow.on('enter-full-screen', () => {
		mainWindow.setResizable(true)
		mainWindow.maximize();
		mainWindow.setResizable(false)
	})
});