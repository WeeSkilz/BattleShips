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
		let player = this.Player
		let challenger = this.Challenger
		let x = this.X
		let y = this.Y
		
		let found = false

		let tile
		
		while(!found) {
			this.Stage++

			switch(this.Stage) {
				case 1: //up
					if((y-1) === -1 || challenger.opponentGrid[x][y-1] !== TileState.EMPTY) {
						break
					}

					
					tile = new Tile(x, y-1, player.grid[x][y-1])
					found = true

					break
				case 2: //right
					if((x+1) === 10 || challenger.opponentGrid[x+1][y] !== TileState.EMPTY) {
						break
					}

					tile = new Tile(x+1, y, player.grid[x+1][y])
					found = true

					break
				case 3: //down
					if((y+1) === 10 || challenger.opponentGrid[x][y+1] !== TileState.EMPTY) {
						break
					}

					tile = new Tile(x, y+1, player.grid[x][y+1])
					found = true

					break
				case 4: //left
					if((x-1) === -1 || challenger.opponentGrid[x-1][y] !== TileState.EMPTY) {
						break
					}

					tile = new Tile(x-1, y, player.grid[x-1][y])
					found = true

					break
				default:
					found = true
					this.Stage = 4
			}

		}

		return tile
	}
}

module.exports = RadialSearch