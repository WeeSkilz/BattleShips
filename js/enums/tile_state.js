/**
* Enum for the current tile state
* @readonly
* @enum {number}
* @property {number} EMPTY - No ship (0)
* @property {number} HIT - Ship, hit (1)
* @property {number} MISS - No ship, and miss (2)
* @property {number} SHIP - Ship, no hit (3)
*/
const TileState = Object.freeze({ //see readme.md for the significance of this
	EMPTY: 0, //or unknown in the case of opponentGrid
	HIT: 1,
	MISS: 2,
	SHIP: 3	
})

module.exports = TileState
