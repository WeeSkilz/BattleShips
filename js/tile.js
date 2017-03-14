class Tile {
	constructor(x, y, tilestate = TileState.EMPTY) {
		this.X = x
		this.Y = y
		this.TileState = tilestate
	}

	get x() {
		return this.X //this allows use of tile.x as well as tile.X
	}

	get y() {
		return this.Y //this allows use of tile.y as well as tile.Y
	}

	get tilestate() { //this allows use of tile.tilestate as well as tile.TileState
		return this.TileState
	}
}

module.exports = Tile