const path = require('path')
const appRoot = require('app-root-path')
const { GameState, GameMode, PlaceDirection } = require(path.join(appRoot.toString(), 'js/enums'))
const Game = require(path.join(appRoot.toString(), 'js/Game'))
const { ipcRenderer } = require('electron')

const reR = /r([0-9])$/
const reC = /c([0-9])$/

let game


$(document).ready(() => {
	game = new Game({ name: 'Player' }, null, GameMode.AI) //this is defined within the jQuery scope so it cannot be altered from the commandline

	$('#mmenu').click(function() { //when the back buttons is clicked
		window.history.back() //go back
	})

	$('html').mouseover((event) => { //when something that isn't the tables is moused over, remove the mocks
		if(game.GameState !== GameState.SETUP) //the cursor detection is only for ship placement
			return //if it's not ship placement time, do nothing

		$('#oGrid .ship').removeClass('ship')  //remove all ships
		game.renderPlaced() //re-render the placed ones
	})

	$('table').mouseover((event) => { //when either of the grids are moused over
		event.stopPropagation() //this stops the listener before this always removing all of the ship pieces
	})

	$('td').mouseover((event) => { //when any of the cells are moused over
		if(game.GameState !== GameState.SETUP) //the cursor placement detection is only for ship placement
			return //if it's not ship placement time, do nothing

		let target = event.target //the cell that is being hovered over

		let x = Number(reC.exec(target.id)[1]) //the x coordinate of the column
		let y = Number(reR.exec(target.parentElement.id)[1]) //the y coordinate of the column

		let table = target.closest('table') //the grid that the cell is in

		if(table.id == 'oGrid') { //if it's the grid where players can place ships
			game.mockShip(x, y) //mock a ship there
		}
	})

	

	$('td').click((event) => { //when a cell is clicked
		let target = event.target //the cell that was clicked
		let x = Number(reC.exec(target.id)[1]) //the x coordinate of the cell
		let y = Number(reR.exec(target.parentElement.id)[1]) //the y coordinate of the cell

		let table = target.closest('table') //the grid that the click was in

		if(table.id === 'pGrid') { //if it's the grid where the player targets ships
			game.playerMove(x, y) //fire a shot (make a move) there
		}

		if(table.id === 'oGrid') { //if it's the grid where you place ships
			game.placeShip(x, y) //try to place a ship
		}
	})

	$('td').mousedown((event) => { //this event detects right clicks
		let target = event.target //the cell the click was in
		let x = Number(reC.exec(target.id)[1]) //the x coordinate of the cell
		let y = Number(reR.exec(target.parentElement.id)[1]) //the y coordinate of the cell

		if(event.which === 3) { //if it's a right click
			game.PlaceDirection = (game.PlaceDirection === PlaceDirection.VERTICAL ? PlaceDirection.HORIZONTAL : PlaceDirection.VERTICAL) //toggle the placedirection
			$('#oGrid .ship').removeClass('ship') //get rid of all the ships
			game.mockShip(x, y) //try to mock the new ship, which will re-render the ones already placed
		}
	})
})
