const debug = false

const reR = /r([0-9])$/
const reC = /c([0-9])$/

let game


$(document).ready(() => {
	game = new Game({ name: 'Player' }, null, GameMode.AI); //this is defined within the jQuery scope so it cannot be altered from the commandline

	game.Challenger.grid[0][0] = TileState.SHIP

	$('#mmenu').click(function() {
		window.history.back()
	})

	$('.container').mouseover((event) => {
		if(game.GameState !== GameState.SETUP) //the cursor placement detection is only for ship placement
			return
		
		if(event.target !== this)
			return

		$('#oGrid .ship').removeClass('ship')
	})

	$('td').mouseover((event) => {
		if(game.GameState !== GameState.SETUP) //the cursor placement detection is only for ship placement
			return

		$('#oGrid .ship').removeClass('ship')

		let target = event.target
		let x = Number(reC.exec(target.id)[1])
		let y = Number(reR.exec(target.parentElement.id)[1])

		if(debug)
			console.log('hover detected at x: ' + x + ', y: ' + y)

		let table = target.closest('table')

		let cells = []

		if(table.id == 'oGrid') {
			if(debug)
				console.log('hovering over oGrid at x: ' + x + ', y: ' + y)

			//$('#oGrid #r' + y + ' #c' + x).addClass('ship')
			
			for (let i = (game.ShipsToPlace); i >= 0; i--) {
				var xmod = (game.PlaceDirection === PlaceDirection.VERTICAL ? 0 : i)
				var ymod = (game.PlaceDirection === PlaceDirection.HORIZONTAL ? 0 : i)

				let tempy, tempx

				if(y + ymod <= 9) {
					tempy = y + ymod
				} else {
					tempy = y - ((y + ymod) - 9)
				}

				if(x + xmod <= 9) {
					tempx = x + xmod
				} else {
					tempx = x - ((x + xmod) - 9)
				}

				$('#oGrid #r' + tempy + ' #c' + tempx).addClass('ship')
			}
		}
	})

	

	$('td').click((event) => {
		let target = event.target
		let x = reC.exec(target.id)[1]
		let y = reR.exec(target.parentElement.id)[1]

		if(debug)
			console.log('click detected at x: ' + x + ', y: ' + y)

		let table = target.closest('table')

		if(table.id === 'pGrid') {
			game.playerMove(x, y)
		}

		if(table.id === 'oGrid') {
			game.placeShip(x, y)
		}
	})
})