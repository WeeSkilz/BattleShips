const debug = true

const path = require('path')
const appRoot = require('app-root-path')
const GameState = require(path.join(appRoot.toString(), 'js/enums/game_state'))
const GameMode = require(path.join(appRoot.toString(), 'js/enums/game_mode'))
const PlaceDirection = require(path.join(appRoot.toString(), 'js/enums/place_direction'))
const Game = require(path.join(appRoot.toString(), 'js/Game'))


const reR = /r([0-9])$/
const reC = /c([0-9])$/

let game


$(document).ready(() => {
	game = new Game({ name: 'Player' }, null, GameMode.AI); //this is defined within the jQuery scope so it cannot be altered from the commandline

	$('#mmenu').click(function() {
		window.history.back()
	})

	$('html').mouseover((event) => {
		$('#oGrid .ship').removeClass('ship')
		game.renderPlaced()
	})

	$('table').mouseover((event) => {
		event.stopPropagation() //this stops the listener after this removing all of the ship pieces
	})

	$('td').mouseover((event) => {
		if(game.GameState !== GameState.SETUP) //the cursor placement detection is only for ship placement
			return

		let target = event.target

		let x = Number(reC.exec(target.id)[1])
		let y = Number(reR.exec(target.parentElement.id)[1])

		if(debug)
			console.log('hover detected at x: ' + x + ', y: ' + y)

		let table = target.closest('table')

		if(table.id == 'oGrid') {
			if(debug)
				console.log('hovering over oGrid at x: ' + x + ', y: ' + y)

			game.mockShip(x, y)
		}
	})

	

	$('td').click((event) => {
		let target = event.target
		let x = Number(reC.exec(target.id)[1])
		let y = Number(reR.exec(target.parentElement.id)[1])

		if(debug)
			console.log('click detected at x: ' + x + ', y: ' + y)

		let table = target.closest('table')

		if(table.id === 'pGrid') {
			game.playerMove(x, y)
		}

		if(table.id === 'oGrid') {
			game.placeShip(x, y)
		}
	})

	$('td').mousedown((event) => {
		let target = event.target
		let x = Number(reC.exec(target.id)[1])
		let y = Number(reR.exec(target.parentElement.id)[1])

		if(debug)
			console.log('right click at x: ' + x + ', y: ' + y)

		if(event.which === 3) {
			game.PlaceDirection = (game.PlaceDirection === PlaceDirection.VERTICAL ? PlaceDirection.HORIZONTAL : PlaceDirection.VERTICAL)
			$('#oGrid .ship').removeClass('ship')
			game.mockShip(x, y)
		}
	})
})
