/**
* Enum for the current place direction
* @readonly
* @enum {number}
* @property {number} VERTICAL - Ships will be placed in a vertical direction with a constant x-value (0)
* @property {number} HORIZONTAL - Ships will be placed in a horizontal direction with a constant y-value (1)
*/
const PlaceDirection = Object.freeze({ //see readme.md for the significance of this
	VERTICAL: 0,
	HORIZONTAL: 1
})

module.exports = PlaceDirection
