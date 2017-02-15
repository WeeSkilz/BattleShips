var electron = require('electron')
var dateformat = require('dateformat')

class Game {
	//TODO: Need to think of a good way to allow players to place ships using the keyboard.

	constructor(player, challenger, gamemode) {
		this.Player = player
		this.Challenger = challenger ? challenger : { name: 'Challenger Bot' }
		this.GameMode = gamemode
		this.GameState = GameState.SETUP //set to PLAYER_PLAY to test (for now)
		this.PlaceDirection = PlaceDirection.VERTICAL
		this.ShipsToPlace = 3
		this.createAndPopulateGrid(this.Player)
		this.createAndPopulateGrid(this.Challenger)
		this.constructGrid('#pGrid')
		this.constructGrid('#oGrid')
	}

	constructGrid(id) {
		for (var i = 0; i < 10; i++) {
			let outer = $(id).find('tbody:last').append($('<tr id="r' + i + '">'))
			for (var j = 0; j < 10; j++) {
				$(id).find('tr:last').append($('<td id="c' + j + '">'))
			}
		}
	}

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

	placeShip(x, y) {


		if(this.ShipsToPlace === 0) {
			this.GameState = GameState.PLAYER_PLAY
			$('#pGrid').addClass('turn')
		}
	}

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
			//update the gamestate to allow the other player to play
		}
	}

	computerMove() {
		setTimeout(() => {
			let found = false
			let x, y
			let tile, localTile //localTile represents the position on the Challenger's opponentGrid
			let oGrid = this.Challenger.opponentGrid
			let pGrid = this.Player.grid

			while (!found) {
				x = Math.floor(Math.random() * 10)
				y = Math.floor(Math.random() * 10)

				if(this.Challenger.opponentGrid[x][y] === TileState.EMPTY) {
					let aOccupied = 0

					for (var i = -1; i >= 1; i + 2) {
						if(x + i >= 0 && x + i <= 9) {
							aOccupied += oGrid[x + i][y] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
						if(y + i >= 0 && y + i <= 9) {
							aOccupied += oGrid[x][y + i] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
					}
					if(aOccupied <= 3) {
						tile = pGrid[x][y]
						localTile = oGrid[x][y]
						found = true
					}
				}

			}

			let targetCell = $('#oGrid #r' + y + ' #c' + x)

			switch (tile) {
				case TileState.SHIP:
					pGrid[x][y] = oGrid[x][y] = TileState.HIT //this will dereference the cell [x, y] in the opponentGrid but it should have no effect as they hold the same value

					targetCell.addClass('hit')

					//TODO possibly increment score if I am implementing scoring
					break;
				case TileState.EMPTY:
					pGrid[x][y] = oGrid[x][y] = TileState.MISS

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