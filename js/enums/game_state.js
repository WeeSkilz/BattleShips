/**
* Enum for the current game state
* @readonly
* @enum {number}
* @property {number} SETUP - Ships are still being placed (0)
* @property {number} PLAYER_PLAY - Client's turn (1)
* @property {number} OPPONENT_PLAY - Opponent's turn (2)
*/
const GameState = Object.freeze({ //see readme.md for the significance of this
	SETUP: 0,
	PLAYER_PLAY: 1,
	OPPONENT_PLAY: 2
})

module.exports = GameState
