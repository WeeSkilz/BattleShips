const path = require('path')
const appRoot = require('app-root-path')
const { ipcRenderer } = require('electron')
const { WindowState, Difficulty } = require(path.join(appRoot.toString(), 'js/enums'))

$(document).ready(() => {
	let config = ipcRenderer.sendSync('getConfig') //fetch the config from the main process (this is part of the render process)

	switch(config.window) { //change the current value to the state of the window in the config
		case WindowState.WINDOWED: //the enum for windowed
			$("#window option[value=windowed]").prop('selected', true) //this sets the value to the contents of the [value=]
			break
		case WindowState.FULLSCREEN_WINDOWED:
			$("#window option[value=fswindowed]").prop('selected', true)
			break
		case WindowState.FULLSCREEN:
			$("#window option[value=fs]").prop('selected', true)
			break
	}

	switch(config.difficulty) { //change the current value to the state of the difficulty in the config
		case Difficulty.NORMAL: //the enum for normal
			$("#difficulty option[value=normal]").prop('selected', true) //this sets the value to the contents of the [value=]
			break
		case Difficulty.EASY:
			$("#difficulty option[value=easy]").prop('easy', true)
			break
	}

	$('#delay').val(config.delay) //change the current value to the value of the delay in the config
	$('#delay-label').text('Delay (' + config.delay + ')') //change the display label to reflect this


	$('#delay').change(() => { //if the slider for delay is changed
		$('#delay-label').text('Delay (' + $('#delay').val() + ')')
        ipcRenderer.send('changeDelay', Number($('#delay').val()))
    })

	$('#window').change((event) => {
		let selection = $('#window option:selected').val()

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

	$('#difficulty').change((event) => {
		let selection = $('#difficulty option:selected').val()

		switch(selection) {
			case 'normal':
				ipcRenderer.send('changeDifficulty', Difficulty.NORMAL)
				break
			case 'easy':
				ipcRenderer.send('changeDifficulty', Difficulty.EASY)
				break
		}
	})
})