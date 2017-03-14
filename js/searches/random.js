const { TileState } = require(path.join(appRoot.toString(), '/js/enums'))
const Tile = require(path.join(appRoot.toString(), '/js/tile'))

class RandomSearch {
	constructor(player, challenger) {
		this.Player = player
		this.Challenger = challenger
	}

	findNext() {
		let found, trapped = false //whether the algorithm has found a space to play in
		let x, y //the x,y coordinates of the tile found
		let tile //the tile returned
		let challenger = this.Challenger
		let player = this.Player

		let startTime = Date.now() //the time the loop was entered, used to detect if the computer can't play (5s timeout)
		while (!found && !trapped) {
			let aOccupied = 0 //the number of adjacent occupied squares

			x = Math.floor(Math.random() * 10) //generate a random x between 0 and 9
			y = Math.floor(Math.random() * 10) //generate a random y between 0 and 9

			if(challenger.opponentGrid[x][y] === TileState.EMPTY) { //if the computer hasn't played here before
				for (var i = -1; i <= 1; i += 2) { //this loop provides the numbers -1, 1 in turn allowing testing of above and left then below and right
					if(x + i >= 0 && x + i <= 9) { //if this is within the x bounds (not at the left or right edge)
						if(challenger.opponentGrid[x + i][y] !== TileState.EMPTY && challenger.opponentGrid[x + i][y] !== TileState.HIT) { //if the square has been played in 
							aOccupied++ //then it is occupied so the number of occupied squares is incremented
						}
					} else { //if it is at the edge
						aOccupied++ //then it is occupied so the number of occupied squares is incremented
					}
					if(y + i >= 0 && y + i <= 9) { //if this is within the y bounds (not at the top or bottom edge)
						if(challenger.opponentGrid[x][y + i] !== TileState.EMPTY && challenger.opponentGrid[x][y + i] !== TileState.HIT) { //if the square has been played in
							aOccupied++ //then it is occupied so the number of occupied squares is incremented
						}
					} else { //if it is at the edge
						aOccupied++ //then it is occupied so the number of occupied squares is incremented
					}
				}
				if(aOccupied !== 4) { //if this square is not a 1x1 square (because there are no 1x1 ships)
					tile = player.grid[x][y] //fetch the tile state
					found = true //a tile has been found
				}
			}

			if((Date.now() - startTime) > 5000) { //if more than 5 seconds of searching has occurred
				trapped = true //this should never ever happen but if it does then a new randomsearch will be instantiated
			}

		}

		return new Tile(x, y, tile) //return the tile found
	}
}

module.exports = RandomSearch