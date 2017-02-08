var electron = require('electron')

class Game {
	//TODO: Need to think of a good way to allow players to place ships using the keyboard.

	constructor(player, challenger, gamemode) {
		this.Player = player
		this.Challenger = challenger ? challenger : { name: 'Challenger Bot' }
		this.GameMode = gamemode
		this.gamestate = GameState.PLAYER_PLAY //set to PLAYER_PLAY to test (for now)
		this.createAndPopulateGrid(this.Player)
		this.createAndPopulateGrid(this.Challenger)
		this.constructGrid('#pGrid')
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
		console.log(Date.now() + ' ' + player.name + ' grids initialised')
		for (var i = 0; i < 10; i++) { //this is a loop to populate the player's grid as empty
			player.grid[i] = []
			player.opponentGrid[i] = []
			for (var j = 0; j < 10; j++) {
				player.grid[i][j] = 0
				player.opponentGrid[i][j] = 0
			}
		}
		console.log(Date.now() + ' ' + player.name + ' grids populated')
	}

	mockShip(x, y) {

	}

	playerMove(x, y) {
		let player = this.Player
		let challenger = this.Challenger

		if(this.gamestate !== GameState.PLAYER_PLAY) //todo change to check if setup
			return

		let targetTile = player.opponentGrid[x][y]
		let targetCell = $('#r' + y + ' #c' + x)

		if(targetTile !== TileState.MISS && targetTile !== TileState.HIT) {
			let opponentTile = challenger.grid[x][y]

			if(opponentTile === TileState.SHIP) {
				challenger.grid[x][y] = player.opponentGrid[x][y] = TileState.HIT

				targetCell.addClass('hit')

				console.log(Date.now() + ' hit recorded. x:' + x + ' y:' + y)
			} else {
				player.opponentGrid[x][y] = TileState.MISS

				targetCell.addClass('miss')

				console.log(Date.now() + ' miss recorded. x:' + x + ' y:' + y)
			}
		} else {
			console.log(Date.now() + ' tile selected already. x:' + x + ' y:' + y)
			return
		}


		if(this.GameMode === GameMode.AI) { //player vs computer
			this.gamestate = GameState.OPPONENT_PLAY
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

			while (!found) {
				x = Math.floor(Math.random() * 10)
				y = Math.floor(Math.random() * 10)

				if(this.Challenger.opponentGrid[x][y] === TileState.EMPTY) {
					let aOccupied = 0
					
					for (var i = -1; i >= 1; i + 2) {
						if(x + i >= 0) {
							aOccupied += this.Challenger.opponentGrid[x + i][y] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
						if(y + i >= 0) {
							aOccupied += this.Challenger.opponentGrid[x][y + i] === TileState.EMPTY ? 0 : 1
						} else {
							aOccupied++
						}
					}
					tile = this.Player.grid[x][y]
					localTile = this.Challenger.opponentGrid[x][y]
					found = true
				}

			}

			switch (tile) {
				case TileState.SHIP:
					tile = localTile = TileState.HIT //this will dereference the cell [x, y] in the opponentGrid but it should have no effect as they hold the same value
					//localTile = TileState.HIT
					//TODO possibly increment score if I am implementing scoring
					break;
				case TileState.EMPTY:
					tile = localTile = TileState.MISS
					//localTile = TileState.MISS
					break;
			}

			this.GameState = GameState.PLAYER_PLAY
			
		},
		Math.random() * 5000)
	}
}