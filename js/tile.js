class Tile {
	constructor(x, y, tilestate) {
		this.X = x
		this.Y = y
		this.TileState = tilestate
	}

	get x() {
		return this.X
	}

	get y() {
		return this.Y
	}

	get tilestate() {
		return this.TileState
	}
}