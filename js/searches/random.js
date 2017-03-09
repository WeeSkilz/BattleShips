const { TileState } = require(path.join(appRoot.toString(), '/js/enums'))
const Tile = require(path.join(appRoot.toString(), '/js/tile'))

class RandomSearch {
	constructor(player, challenger) {
		this.Player = player
		this.Challenger = challenger
	}

	findNext() {
		let found, trapped = false //whether the algorithm has found a space to play in
		let x, y
		let tile, localTile //localTile represents the position on the Challenger's opponentGrid
		let challenger = this.Challenger
		let player = this.Player

		let startTime = Date.now() //the time the loop was entered, used to detect if the computer can't play (5s timeout)
		while (!found && !trapped) {
			let aOccupied = 0

			x = Math.floor(Math.random() * 10)
			y = Math.floor(Math.random() * 10)

			if(challenger.opponentGrid[x][y] === TileState.EMPTY) {
				//this way to check for the edge cases occasionally doesn't work and I will need to look into it
				for (var i = -1; i <= 1; i += 2) { 
					if(x + i >= 0 && x + i <= 9) {
						if(challenger.opponentGrid[x + i][y] !== TileState.EMPTY && challenger.opponentGrid[x + i][y] !== TileState.HIT) {
							aOccupied += 1
							console.log('x tile: ' + challenger.opponentGrid[x + i][y])
						}
					} else {
						aOccupied++
					}
					if(y + i >= 0 && y + i <= 9) {
						if(challenger.opponentGrid[x][y + i] !== TileState.EMPTY && challenger.opponentGrid[x][y + i] !== TileState.HIT) {
							aOccupied += 1
							console.log('x tile: ' + challenger.opponentGrid[x][y + i])
						}
					} else {
						aOccupied++
					}
				}

				console.log('Occupied: ' + aOccupied)
				if(aOccupied !== 4) {
					tile = player.grid[x][y]
					found = true
				}
			}

			if((Date.now() - startTime) > 1000) {
				trapped = true
			}

		}

		return new Tile(x, y, tile)
	}
}

module.exports = RandomSearch