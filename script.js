
let gameBoard;

// let mark = document.querySelector('form');

// const humanPlayer = 'O';
// const computerPlayer = 'X';
// const humanPlayer;
// const computerPlayer;

///////
// var msg = document.querySelector('.message');
// var chooser = document.querySelector('form');
// var mark;
//////

const winningSet = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

///////
// function setPlayer() {
//   mark = this.value;
//   msg.textContent = mark + ', click on a square to make your move!';
//   chooser.classList.add('game-on');
//   this.checked = false;
//   buildGrid();
// }
///////


const cells = document.querySelectorAll('.cell');
startGame();


// function setPlayer() {
// 	mark = this.value;
// 	if (mark == 'X') {
// 		let humanPlayer = 'X';
// 		let computerPlayer = 'O';
// 	} else {
// 		let humanPlayer = 'O';
// 		let computerPlayer = 'X';
// 	}
// }

// function setPlayer(id) {
// 	if (id === 'x') {
// 		humanPlayer = 'X';
// 		computerPlayer = 'O';
// 	} else if (id === 'o') {
// 		humanPlayer = 'O';
// 		computerPlayer = 'X';
// 	}
// 	startGame();
// }

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	gameBoard = Array.from(Array(9).keys());
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	if (typeof gameBoard[square.target.id] == 'number') {
		turn(square.target.id, humanPlayer)
		if (!checkWin(gameBoard, humanPlayer) && !checkTie()) turn(bestSpot(), computerPlayer);
	}
}

function turn(squareId, player) {
	gameBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(gameBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winningSet.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

function gameOver(gameWon) {
	for (let index of winningSet[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == humanPlayer ? "blue" : "red";
	}
	for (let i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == humanPlayer ? "Wygrałeś!" : "Przegrałeś.");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return gameBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(gameBoard, computerPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (let i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Remis!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	let availSpots = emptySquares();

	if (checkWin(newBoard, humanPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, computerPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	let moves = [];
	for (let i = 0; i < availSpots.length; i++) {
		let move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == computerPlayer) {
			let result = minimax(newBoard, humanPlayer);
			move.score = result.score;
		} else {
			let result = minimax(newBoard, computerPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	let bestMove;
	if(player === computerPlayer) {
		let bestScore = -10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		let bestScore = 10000;
		for(let i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

let players = Array.prototype.slice.call(document.querySelectorAll('input[name=player-choice]'));
players.forEach(function(choice){
  choice.addEventListener('click', setPlayer, false);
});