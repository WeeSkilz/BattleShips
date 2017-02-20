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

module.exports = WindowState