const NUM_ROWS = 6;
const NUM_COL = 7;

const createRows = () => {
	return new Array(NUM_ROWS).fill(0);
};
const allCells = new Array(NUM_COL).fill(0).map(createRows);
const topCells = new Array(NUM_COL).fill(0);

let board = [
	{ row: 0, col: 0, type: 'all', colour: null },
	{ row: 0, col: 1, type: 'all', colour: null },
	{ row: 0, col: 2, type: 'all', colour: null },
	{ row: 0, col: 3, type: 'all', colour: null },
	{ row: 0, col: 4, type: 'all', colour: null },
	{ row: 0, col: 5, type: 'all', colour: null },
	{ row: 0, col: 6, type: 'all', colour: null },
	{ row: 1, col: 0, type: 'all', colour: null },
	{ row: 1, col: 1, type: 'all', colour: null },
	{ row: 1, col: 2, type: 'all', colour: null },
	{ row: 1, col: 3, type: 'all', colour: null },
	{ row: 1, col: 4, type: 'all', colour: null },
	{ row: 1, col: 5, type: 'all', colour: null },
	{ row: 1, col: 6, type: 'all', colour: null },
	{ row: 2, col: 0, type: 'all', colour: null },
	{ row: 2, col: 1, type: 'all', colour: null },
	{ row: 2, col: 2, type: 'all', colour: null },
	{ row: 2, col: 3, type: 'all', colour: null },
	{ row: 2, col: 4, type: 'all', colour: null },
	{ row: 2, col: 5, type: 'all', colour: null },
	{ row: 2, col: 6, type: 'all', colour: null },
	{ row: 3, col: 0, type: 'all', colour: null },
	{ row: 3, col: 1, type: 'all', colour: null },
	{ row: 3, col: 2, type: 'all', colour: null },
	{ row: 3, col: 3, type: 'all', colour: null },
	{ row: 3, col: 4, type: 'all', colour: null },
	{ row: 3, col: 5, type: 'all', colour: null },
	{ row: 3, col: 6, type: 'all', colour: null },
	{ row: 4, col: 0, type: 'all', colour: null },
	{ row: 4, col: 1, type: 'all', colour: null },
	{ row: 4, col: 2, type: 'all', colour: null },
	{ row: 4, col: 3, type: 'all', colour: null },
	{ row: 4, col: 4, type: 'all', colour: null },
	{ row: 4, col: 5, type: 'all', colour: null },
	{ row: 4, col: 6, type: 'all', colour: null },
	{ row: 5, col: 0, type: 'all', colour: null },
	{ row: 5, col: 1, type: 'all', colour: null },
	{ row: 5, col: 2, type: 'all', colour: null },
	{ row: 5, col: 3, type: 'all', colour: null },
	{ row: 5, col: 4, type: 'all', colour: null },
	{ row: 5, col: 5, type: 'all', colour: null },
	{ row: 5, col: 6, type: 'all', colour: null },
	{ row: null, col: 0, type: 'top', colour: null },
	{ row: null, col: 1, type: 'top', colour: null },
	{ row: null, col: 2, type: 'top', colour: null },
	{ row: null, col: 3, type: 'top', colour: null },
	{ row: null, col: 4, type: 'top', colour: null },
	{ row: null, col: 5, type: 'top', colour: null },
	{ row: null, col: 6, type: 'top', colour: null },
];

let boardState = board;

const column0 = [
	allCells[35],
	allCells[28],
	allCells[21],
	allCells[14],
	allCells[7],
	allCells[0],
	topCells[0],
];
const column1 = [
	allCells[36],
	allCells[29],
	allCells[22],
	allCells[15],
	allCells[8],
	allCells[1],
	topCells[1],
];
const column2 = [
	allCells[37],
	allCells[30],
	allCells[23],
	allCells[16],
	allCells[9],
	allCells[2],
	topCells[2],
];
const column3 = [
	allCells[38],
	allCells[31],
	allCells[24],
	allCells[17],
	allCells[10],
	allCells[3],
	topCells[3],
];
const column4 = [
	allCells[39],
	allCells[32],
	allCells[25],
	allCells[18],
	allCells[11],
	allCells[4],
	topCells[4],
];
const column5 = [
	allCells[40],
	allCells[33],
	allCells[26],
	allCells[19],
	allCells[12],
	allCells[5],
	topCells[5],
];
const column6 = [
	allCells[41],
	allCells[34],
	allCells[27],
	allCells[20],
	allCells[13],
	allCells[6],
	topCells[6],
];
const columns = [column0, column1, column2, column3, column4, column5, column6];

// rows
const topRow = [
	topCells[0],
	topCells[1],
	topCells[2],
	topCells[3],
	topCells[4],
	topCells[5],
	topCells[6],
];
const row0 = [
	allCells[0],
	allCells[1],
	allCells[2],
	allCells[3],
	allCells[4],
	allCells[5],
	allCells[6],
];
const row1 = [
	allCells[7],
	allCells[8],
	allCells[9],
	allCells[10],
	allCells[11],
	allCells[12],
	allCells[13],
];
const row2 = [
	allCells[14],
	allCells[15],
	allCells[16],
	allCells[17],
	allCells[18],
	allCells[19],
	allCells[20],
];
const row3 = [
	allCells[21],
	allCells[22],
	allCells[23],
	allCells[24],
	allCells[25],
	allCells[26],
	allCells[27],
];
const row4 = [
	allCells[28],
	allCells[29],
	allCells[30],
	allCells[31],
	allCells[32],
	allCells[33],
	allCells[34],
];
const row5 = [
	allCells[35],
	allCells[36],
	allCells[37],
	allCells[38],
	allCells[39],
	allCells[40],
	allCells[41],
];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

// variables
let gameIsLive = true;
let yellowIsNext = true;

// Functions
const getClassListArray = (cell) => {
	const classList = cell.classList;
	return [...classList];
};

const getCellLocation = (cell) => {
	const classList = getClassListArray(cell);

	const rowClass = classList.find((className) => className.includes('row'));
	const colClass = classList.find((className) => className.includes('col'));
	const rowIndex = rowClass[4];
	const colIndex = colClass[4];
	const rowNumber = parseInt(rowIndex, 10);
	const colNumber = parseInt(colIndex, 10);
	return [rowNumber, colNumber];
};

const getFirstOpenCellForColumn = (colIndex) => {
	const column = columns[colIndex];
	const columnWithoutTop = column.slice(0, 6);

	for (const cell of columnWithoutTop) {
		const classList = getClassListArray(cell);
		if (!classList.includes('yellow') && !classList.includes('red')) {
			return cell;
		}
	}

	return null;
};

const clearColorFromTop = (colIndex) => {
	const topCell = topCells[colIndex];
	topCell.classList.remove('yellow');
	topCell.classList.remove('red');
};

const getColorOfCell = (cell) => {
	const classList = getClassListArray(cell);
	if (classList.includes('yellow')) return 'yellow';
	if (classList.includes('red')) return 'red';
	return null;
};

const checkWinningCells = (cells) => {
	if (cells.length < 4) return false;

	gameIsLive = false;
	for (const cell of cells) {
		cell.classList.add('win');
	}
	statusSpan.textContent = `${yellowIsNext ? 'Yellow' : 'Red'} has won!`;
	return true;
};

const checkStatusOfGame = (cell) => {
	const color = getColorOfCell(cell);
	if (!color) return;
	const [rowIndex, colIndex] = getCellLocation(cell);

	// Check horizontally
	let winningCells = [cell];
	let rowToCheck = rowIndex;
	let colToCheck = colIndex - 1;
	while (colToCheck >= 0) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			colToCheck--;
		} else {
			break;
		}
	}
	colToCheck = colIndex + 1;
	while (colToCheck <= 6) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			colToCheck++;
		} else {
			break;
		}
	}
	let isWinningCombo = checkWinningCells(winningCells);
	if (isWinningCombo) return;

	// Check vertically
	winningCells = [cell];
	rowToCheck = rowIndex - 1;
	colToCheck = colIndex;
	while (rowToCheck >= 0) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck--;
		} else {
			break;
		}
	}
	rowToCheck = rowIndex + 1;
	while (rowToCheck <= 5) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck++;
		} else {
			break;
		}
	}
	isWinningCombo = checkWinningCells(winningCells);
	if (isWinningCombo) return;

	// Check diagonally /
	winningCells = [cell];
	rowToCheck = rowIndex + 1;
	colToCheck = colIndex - 1;
	while (colToCheck >= 0 && rowToCheck <= 5) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck++;
			colToCheck--;
		} else {
			break;
		}
	}
	rowToCheck = rowIndex - 1;
	colToCheck = colIndex + 1;
	while (colToCheck <= 6 && rowToCheck >= 0) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck--;
			colToCheck++;
		} else {
			break;
		}
	}
	isWinningCombo = checkWinningCells(winningCells);
	if (isWinningCombo) return;

	// Check diagonally \
	winningCells = [cell];
	rowToCheck = rowIndex - 1;
	colToCheck = colIndex - 1;
	while (colToCheck >= 0 && rowToCheck >= 0) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck--;
			colToCheck--;
		} else {
			break;
		}
	}
	rowToCheck = rowIndex + 1;
	colToCheck = colIndex + 1;
	while (colToCheck <= 6 && rowToCheck <= 5) {
		const cellToCheck = rows[rowToCheck][colToCheck];
		if (getColorOfCell(cellToCheck) === color) {
			winningCells.push(cellToCheck);
			rowToCheck++;
			colToCheck++;
		} else {
			break;
		}
	}
	isWinningCombo = checkWinningCells(winningCells);
	if (isWinningCombo) return;

	// Check to see if we have a tie
	const rowsWithoutTop = rows.slice(0, 6);
	for (const row of rowsWithoutTop) {
		for (const cell of row) {
			const classList = getClassListArray(cell);
			if (!classList.includes('yellow') && !classList.includes('red')) {
				return;
			}
		}
	}

	gameIsLive = false;
	statusSpan.textContent = 'Game is a tie!';
};

// Event Handlers
const handleCellMouseOver = (e) => {
	if (!gameIsLive) return;
	const cell = e.target;
	const [rowIndex, colIndex] = getCellLocation(cell);
	const topCell = topCells[colIndex];
	topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
};

const handleCellMouseOut = (e) => {
	const cell = e.target;
	const [rowIndex, colIndex] = getCellLocation(cell);
	clearColorFromTop(colIndex);
};

const handleCellClick = (e) => {
	if (!gameIsLive) return;
	const cell = e.target;
	const [rowIndex, colIndex] = getCellLocation(cell);

	const openCell = getFirstOpenCellForColumn(colIndex);

	if (!openCell) return;

	openCell.classList.add(yellowIsNext ? 'yellow' : 'red');
	checkStatusOfGame(openCell);

	yellowIsNext = !yellowIsNext;
	clearColorFromTop(colIndex);
	if (gameIsLive) {
		const topCell = topCells[colIndex];
		topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
	}
};

const saveJSON = () => {
	for (let i = 0; i < board.length; i++) {
		const [rowIndex, colIndex] = getCellLocation(board[i]);
		const colour = getColorOfCell(board[i]);

		var cellEntry = {
			row: rowIndex,
			col: colIndex,
			type: 'all',
			colour: colour,
		};

		board.push(cellEntry);
	}
	return board
};

export default function initGamesController(db) {
	const create = async (req, res) => {
		try {
			// find game in progress or create new game
			const [currentGame, created] = await db.Game.findOrCreate({
				where: {
					gameState: { status: 'active' },
				},
				defaults: {
					gameState: {
						status: 'active',
						boardState,
					},
				},
			});

			if (created) {
				// add 2 entries to join table game_users

				let player2Id;
				if (Number(req.cookies.userId) === 1) {
					player2Id = 2;
				} else if (Number(req.cookies.userId) === 2) {
					player2Id = 1;
				}

				const player1 = await db.User.findOne({
					where: {
						id: req.cookies.userId,
					},
				});

				const player2 = await db.User.findOne({
					where: {
						id: player2Id,
					},
				});

				const joinTableEntry = await currentGame.addUser(player1);

				const joinTableEntry2 = await currentGame.addUser(player2);
			}

			res.send({
				id: currentGame.id,
			});
		} catch (error) {}
	};

	// gets another 2 cards from the current card deck
	const move = async (req, res) => {
		boardState = saveJSON();
		console.log(board);
		try {
			const currentGame = await db.Game.findByPk(req.params.id);
			const updatedGame = await currentGame.update({
				gameState: {
					status: 'active',
					boardState: boardState,
				},
			});
			res.send({
				id: updatedGame.id,
			});
		} catch (error) {}
	};

	// gets the latest entry with the user in it
	const update = async (req, res) => {
		try {
			const updatedGame = await db.Game.findOne({
				where: {
					id: req.body.id,
				},
			});

			res.send({
				id: updatedGame.id,
				boardState: currentGame.gameState.boardState,
			});
		} catch (error) {}
	};

	const logout = async (req, res) => {
		try {
			const currentGame = await db.Game.findByPk(req.params.id);

			const updateStatus = await currentGame.update({
				gameState: {
					status: 'completed',
				},
			});

			res.send({ status: updateStatus.gameState.status });
		} catch (error) {}
	};
	return {
		create,
		update,
		move,
		logout,
	};
}
