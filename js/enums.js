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

module.exports.GameMode = GameMode

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

module.exports.GameState = GameState

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

module.exports.PlaceDirection = PlaceDirection

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

module.exports.TileState = TileState

/**
* Enum for the current window state
* @readonly
* @enum {number}
* @property {number} FULLSCREEN_WINDOWED - The window is maximum size without being fullscreen, not resizable
* @property {number} WINDOWED - The window is resizable
* @property {number} FULLSCREEN - The window is completely full screen and must be exited through the main menu
*/
const WindowState = Object.freeze({
	FULLSCREEN_WINDOWED: 0,
	WINDOWED: 1,
	FULLSCREEN: 2
})

module.exports.WindowState = WindowState
