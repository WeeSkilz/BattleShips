const path = require('path')
const appRoot = require('app-root-path')
const { ipcRenderer } = require('electron')
const { WindowState } = require(path.join(appRoot.toString(), 'js/enums'))

$(document).ready(() => {
	$('#window').change((event) => {
		console.log('this')
		let selection = $('#window option:selected').val()

		console.log(selection)

		switch(selection) {
			case 'windowed':
				ipcRenderer.send('changeWindow', WindowState.WINDOWED)
				break
			case 'fswindowed':
				ipcRenderer.send('changeWindow', WindowState.FULLSCREEN_WINDOWED)
				break
			case 'fs':
				ipcRenderer.send('changeWindow', WindowState.FULLSCREEN)
				break
		}
	})
	
})