'use strict';
const electron = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const { WindowState, Difficulty } = require(path.join(__dirname, '/js/enums'))

const app = electron.app

let dir = app.getPath('userData') //the program's data folder on the user's profile
let config
if(fs.existsSync(path.join(dir, 'config.json'))) { 
	config = JSON.parse(fs.readFileSync(path.join(dir, 'config.json'))) //if the config exists, load it
} else { //if not, we create a new config object
	config = {
		difficulty: Difficulty.NORMAL,
		window: WindowState.FULLSCREEN_WINDOWED,
		delay: 5
	}
}

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// prevent window being garbage collected by providing a constant reference
let mainWindow
let game = null

function onClosed() {
	// dereference the window so it can be collected
	mainWindow = null
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 1, //this just needs to be provided so that the window will initialise
		height: 1,
		minWidth: 580, //this ensures that the grid still fits on the window at minimum size
		minHeight:620,
		titleBarStyle: 'hidden-inset' //on macOS this makes it look amazing
	})

	win.maximize(); //set the window to be maximum size
	win.setResizable(false) //fullscreen windowed mode

	win.loadURL(`file://${__dirname}/pages/index.html`) //load the main menu
	win.on('closed', onClosed) //when the window is closed, call the onclosed method

	return win
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') { //if it's macos then the program keeps running which is the default platform behaviour
		app.quit() //if it's any other OS the program closes
	}
})

app.on('activate', () => { //when the icon is clicked on mac but all windows are closed
	if (!mainWindow) { //if the window isn't open
		mainWindow = createMainWindow() //create a new window
		setWindowMode(config.window)
	}
});

app.on('ready', () => { //when the program has started
	mainWindow = createMainWindow() //create a new window
	setWindowMode(config.window)
	mainWindow.on('enter-full-screen', () => { //this is necessary for kiosk mode to work properly
		mainWindow.setResizable(true) //allow the window to be resized
		mainWindow.maximize() //make it as big as possible
		mainWindow.setResizable(false) //stop it from being resized
	})
})

ipcMain.on('close', (event, args) => {
	fs.writeFileSync(path.join(dir, 'config.json'), JSON.stringify(config)) //when the program is shut down, save the config
	app.quit() //close the program
})

ipcMain.on('changeWindow', (event, args) => {
//I need to save this state to restore it next time the menu is opened.
	config.window = args //set the window mode

	setWindowMode(args)
})

function setWindowMode(type) {
	switch(type) { //args will be an integer, represented in the case by an enum
		case WindowState.FULLSCREEN_WINDOWED:
			mainWindow.setKiosk(false) //to make sure we're not in kiosk mode (complete fullscreen)
			mainWindow.maximize()
			mainWindow.setResizable(false)
			break
		case WindowState.WINDOWED:
			mainWindow.setKiosk(false) //to make sure we're not in kiosk mode (complete fullscreen)
			mainWindow.setResizable(true)
			break
		case WindowState.FULLSCREEN:
			mainWindow.setKiosk(true) //set it to complete wholescreen
			break
	}
}

ipcMain.on('changeDifficulty', (event, args) => {
	config.difficulty = args //set the property of the difficulty in the config
})

ipcMain.on('changeDelay', (event, args) => {
	 config.delay = args //set the property of the delay in the config
})

ipcMain.on('getConfig', (event, args) => {
	event.returnValue = config //return the config
})