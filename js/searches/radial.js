const { TileState } = require(path.join(appRoot.toString(), '/js/enums'))
const Tile = require(path.join(appRoot.toString(), '/js/tile'))

class RadialSearch {
	constructor(player, challenger, x, y) {
		this.Player = player
		this.Challenger = challenger
		this.X = x
		this.Y = y
		this.Stage = 0
	}

	findNext() {
		let player = this.Player //the first 4 lines just shorten the variables to new names
		let challenger = this.Challenger
		let x = this.X
		let y = this.Y
		
		let found = false //a suitable tile has not been found

		let tile //the variable to hold the tile we find
		
		while(!found) { //if a tile has not been found
			this.Stage++ //the stage of the search increases

			switch(this.Stage) {
				case 1: //up
					if((y-1) === -1 || challenger.opponentGrid[x][y-1] !== TileState.EMPTY) { //if the ship is at the top of the grid, or the computer has already played in that square, break
						break
					}

					
					tile = new Tile(x, y-1, player.grid[x][y-1]) //return the tile above the base (x,y)
					found = true //change to recognise a tile has been found

					break
				case 2: //right
					if((x+1) === 10 || challenger.opponentGrid[x+1][y] !== TileState.EMPTY) { //if the ship is at the right of the grid, or the computer has already played in that square, break
						break
					}

					tile = new Tile(x+1, y, player.grid[x+1][y]) //return the tile right of the base (x,y)
					found = true //change to recognise a tile has been found

					break
				case 3: //down
					if((y+1) === 10 || challenger.opponentGrid[x][y+1] !== TileState.EMPTY) { //if the ship is at the bottom of the grid, or the computer has already played in that square, break
						break
					}

					tile = new Tile(x, y+1, player.grid[x][y+1]) //return the tile below the base (x,y)
					found = true //change to recognise a tile has been found

					break
				case 4: //left
					if((x-1) === -1 || challenger.opponentGrid[x-1][y] !== TileState.EMPTY) { //if the ship is at the left of the grid, or the computer has already played in that square, break
						break
					}

					tile = new Tile(x-1, y, player.grid[x-1][y]) //return the tile left of the base (x,y)
					found = true //change to recognise a tile has been found

					break
				default: //if there is unexpected behaviour with the stage
					found = true
					this.Stage = 4 //ensure that the final stage is set so that a new random search will be instantiated to fix the behaviour
			}

		}

		return tile
	}
}

module.exports = RadialSearch