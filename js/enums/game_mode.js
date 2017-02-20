/**
* Enum for the current game mode
* @readonly
* @enum {number}
* @property {number} AI - Game against computer opponent (0)
* @property {number} PVP - Game against another player (1) [NOT YET IMPLEMENTED]
*/
const GameMode = Object.freeze({ //see readme.md for the significance of this
	AI: 0, //Game against the computer
	PVP: 1 //Game against another player (for multiplayer)
})

module.exports = GameMode