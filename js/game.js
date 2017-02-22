const electron = require('electron')
const dateformat = require('dateformat')
const { TileState } = require(path.join(appRoot.toString(), '/js/enums'))

class Game {
	//TODO: Need to think of a good way to allow players to place ships using the keyboard.

	/**
	* Game object
	* @constructor
	* @param {object} player - The player object to be passed in
	* @param {object} challenger - The challenger object to be passed in
	* @param {object} gamemode - The GameMode
	*/
	constructor(player, challenger, gamemode) {
		this.Player = player
		this.Challenger = challenger ? challenger : { name: 'Challenger Bot' } //this is the basic introduction to the multiplayer mechanic
		this.GameMode = gamemode //another feature for multiplayer
		this.GameState = GameState.SETUP //set to PLAYER_PLAY to test (for now)
		this.PlaceDirection = PlaceDirection.VERTICAL //the default place direction is vertical
		this.ShipsToPlace = 4 //4 ships will be placed (5 units, 4 units, 3 units, 2 units)
		this.createAndPopulateGrid(this.Player)
		this.createAndPopulateGrid(this.Challenger)
		this.constructGrid('#pGrid')
		this.constructGrid('#oGrid')
	}

	/**
	* Populates an HTML table with the grid form for the game
	* @func
	* @param {string} id - The id of the table tag in html
	*/
	constructGrid(id) {
		for (var i = 0; i < 10; i++) {
			let outer = $(id).find('tbody:last').append($('<tr id="r' + i + '">'))
			for (var j = 0; j < 10; j++) {
				$(id).find('tr:last').append($('<td id="c' + j + '">'))
			}
		}
	}

	/**
	* Creates and populates two, two dimensional arrays that represent the player's boards in memory
	* @func
	* @param {object} player - The player object for which the arrays are to be created
	*/
	createAndPopulateGrid(player) {
		player.grid = []
		player.opponentGrid = []
		console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' ' + player.name + ' grids initialised')
		for (var i = 0; i < 10; i++) { //this is a loop to populate the player's grid as empty
			player.grid[i] = []
			player.opponentGrid[i] = []
			for (var j = 0; j < 10; j++) {
				player.grid[i][j] = 0
				player.opponentGrid[i][j] = 0
			}
		}
		console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' ' + player.name + ' grids populated')
	}

	/**
	* Adds the classes back for the ships that have already been placed, called when another method clears all ships
	* @func
	*/
	renderPlaced() {
		for (var i = 0; i < 10; i++) {
			for (var j = 0; j < 10; j++) {
				if(this.Player.grid[i][j] == TileState.SHIP)
					$('#oGrid #r' + j + ' #c' + i).addClass('ship')
			}
		}
	}

	/**
	* Mocks the position of a ship on the player's placement grid
	* @func
	* @param {number} x - The x-coordinate of the cell where the cursor is
	* @param {number} y - The y-coordinate of the cell where the cursor is
	*/
	mockShip(x, y) {
		$('#oGrid .ship').removeClass('ship')
		this.renderPlaced()

		console.log('should be mocking at x: ' + x + ', y: ' + y)
		for (let i = (game.ShipsToPlace); i >= 0; i--) {
			const xmod = (game.PlaceDirection === PlaceDirection.VERTICAL ? 0 : i)
			const ymod = (game.PlaceDirection === PlaceDirection.HORIZONTAL ? 0 : i)

			let tempy, tempx

			console.log('xmod: ' + xmod + ', ymod: ' + ymod)

			if(y + ymod <= 9) {
				tempy = y + ymod
			} else {
				tempy = y - ((y + ymod) - 9)
			}

			if(x + xmod <= 9) {
				tempx = x + xmod
			} else {
				tempx = x - ((x + xmod) - 9)
			}

			console.log('mocking at x: ' + tempx + ', y: ' + tempy)

			$('#oGrid #r' + tempy + ' #c' + tempx).addClass('ship')
		}
	}

	/**
	* Finalises the position of a ship on the player's placement grid, and stores it to the array
	* @func
	* @param {number} x - The x-coordinate of the cell where the cursor is
	* @param {number} y - The y-coordinate of the cell where the cursor is
	*/
	placeShip(x, y) {
		if(this.ShipsToPlace === 0)
			return

		for (let i = game.ShipsToPlace; i >= 0; i--) {
			const xmod = (game.PlaceDirection === PlaceDirection.VERTICAL ? 0 : i)
			const ymod = (game.PlaceDirection === PlaceDirection.HORIZONTAL ? 0 : i)

			let tempy, tempx

			console.log('xmod: ' + xmod + ', ymod: ' + ymod)

			if(y + ymod <= 9) {
				tempy = y + ymod
			} else {
				tempy = y - ((y + ymod) - 9)
			}

			if(x + xmod <= 9) {
				tempx = x + xmod
			} else {
				tempx = x - ((x + xmod) - 9)
			}

			console.log('placing at x: ' + tempx + ', y: ' + tempy)

			$('#oGrid #r' + tempy + ' #c' + tempx).addClass('ship')
			this.Player.grid[tempx][tempy] = TileState.SHIP
		}

		if(this.ShipsToPlace === 1) {
			this.placeComputerShips()
			this.GameState = GameState.PLAYER_PLAY
			$('#pGrid>tbody').addClass('turn')
		}

		this.ShipsToPlace--
	}

	/**
	* Plays the player's move on their target grid
	* @func
	* @param {number} x - The x-coordinate of the cell where the cursor is
	* @param {number} y - The y-coordinate of the cell where the cursor is
	*/
	playerMove(x, y) {
		let player = this.Player
		let challenger = this.Challenger

		if(this.GameState !== GameState.PLAYER_PLAY) {
			console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' Player attempted to move, but the GameState was not PLAYER_PLAY:1, GameState is ' + this.GameState)
			return
		}
			

		let targetTile = player.opponentGrid[x][y]
		let targetCell = $('#pGrid #r' + y + ' #c' + x)

		if(targetTile !== TileState.MISS && targetTile !== TileState.HIT) {
			let opponentTile = challenger.grid[x][y]

			if(opponentTile === TileState.SHIP) {
				challenger.grid[x][y] = player.opponentGrid[x][y] = TileState.HIT

				targetCell.addClass('hit')

				console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' hit recorded. x:' + x + ' y:' + y)
			} else {
				player.opponentGrid[x][y] = TileState.MISS

				targetCell.addClass('miss')

				console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' miss recorded. x:' + x + ' y:' + y)
			}
		} else {
			console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' tile selected already. x:' + x + ' y:' + y)
			return
		}


		if(this.GameMode === GameMode.AI) { //player vs computer
			$('#pGrid>tbody').removeClass('turn')
			$('#oGrid>tbody').addClass('turn')
			this.GameState = GameState.OPPONENT_PLAY
			this.computerMove() //make the computer move against the player
		} else if(this.GameMode = GameMode.PVP) {
			//update the gamestate to allow the other player to play (multiplayer)
		}
	}

	/**
	* Places the computer's ships on its grid.
	* @func
	*/
	placeComputerShips() {
		let x,y
		let direction

		for (let i = 5; i > 1; i--) { //if we place the biggest ships first then we will have a higher chance of picking empty squares with the small ships maybe?
			let found = false //assume true unless one tile changes it, guarantees that it will be false if not rather than true if not

			while(!found) {
				let isClear = true
				x = Math.floor(Math.random() * 10)
				y = Math.floor(Math.random() * 10)

				if(Math.random() >= 0.5) {
					direction = PlaceDirection.VERTICAL
				} else {
					direction = PlaceDirection.HORIZONTAL
				}

				for(let j = 0; j < Number(i); j++) {
					const xmod = (direction === PlaceDirection.VERTICAL ? 0 : j)
					const ymod = (direction === PlaceDirection.HORIZONTAL ? 0 : j)

					let tempy, tempx

					if(y + ymod <= 9) {
						tempy = y + ymod
					} else {
						tempy = y - ((y + ymod) - 9)
					}

					if(x + xmod <= 9) {
						tempx = x + xmod
					} else {
						tempx = x - ((x + xmod) - 9)
					}

					if(this.Challenger.grid[tempx][tempy] === TileState.SHIP){
						isClear = false
					}
					
				}
				if(isClear) {
					found = true
				}
			}

			for(let k = 0; k < Number(i); k++) {
				const xmod = (direction === PlaceDirection.VERTICAL ? 0 : k)
				const ymod = (direction === PlaceDirection.HORIZONTAL ? 0 : k)

				let tempy, tempx

				if(y + ymod <= 9) {
					tempy = y + ymod
				} else {
					tempy = y - ((y + ymod) - 9)
				}

				if(x + xmod <= 9) {
					tempx = x + xmod
				} else {
					tempx = x - ((x + xmod) - 9)
				}

				this.Challenger.grid[tempx][tempy] = TileState.SHIP
				//$('#pGrid #r' + tempy + ' #c' + tempx).addClass('ship') //for testing
			}
		}
	}

	/**
	* Plays the computer opponent's move against the player
	* @func
	*/
	computerMove() {
		setTimeout(() => {
			let found = false //whether the algorithm has found a space to play in
			let x, y
			let tile, localTile //localTile represents the position on the Challenger's opponentGrid
			let challenger = this.Challenger
			let player = this.Player

			while (!found) {
				x = Math.floor(Math.random() * 10)
				y = Math.floor(Math.random() * 10)

				if(challenger.opponentGrid[x][y] === TileState.EMPTY) {
					let aOccupied = 0

					//this way to check for the edge cases occasionally doesn't work and I will need to look into it
					for (var i = -1; i >= 1; i + 2) {
						if(x + i >= 0 && x + i <= 9) {
							aOccupied += challenger.opponentGrid[x + i][y] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
						if(y + i >= 0 && y + i <= 9) {
							aOccupied += challenger.opponentGrid[x][y + i] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
					}
					if(aOccupied <= 3) {
						tile = player.grid[x][y]
						localTile = challenger.opponentGrid[x][y]
						found = true
					}
				}

			}

			let targetCell = $('#oGrid #r' + y + ' #c' + x)

			switch (tile) {
				case TileState.SHIP:
					player.grid[x][y] = challenger.opponentGrid[x][y] = TileState.HIT //this will dereference the cell [x, y] in the opponentGrid but it should have no effect as they hold the same value

					targetCell.addClass('hit')

					break;
				case TileState.EMPTY:
					player.grid[x][y] = challenger.opponentGrid[x][y] = TileState.MISS

					targetCell.addClass('miss')

					break;
			}

			this.GameState = GameState.PLAYER_PLAY

			$('#pGrid>tbody').addClass('turn')
			$('#oGrid>tbody').removeClass('turn')

			console.log(dateformat(Date.now(), "HH:MM:ss:l") + ' Changed GameState to PLAYER_PLAY:' + this.GameState)
			
		},
		Math.random() * 5000)
	}
}

module.exports = Game
