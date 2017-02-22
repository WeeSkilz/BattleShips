class RandomSearch {
	constructor(player, challenger) {
		this.Player = player
		this.Challenger = challenger
	}

	findNext() {
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
				if(aOccupied !== 4) {
					tile = player.grid[x][y]
					localTile = challenger.opponentGrid[x][y]
					found = true
				}
			}

		}
	}
}

module.exports = RandomSearch