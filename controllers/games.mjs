const emptyBoard = {
	board: [
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
	],
};
const boardState = emptyBoard;

const saveJSON = () => {
	var data = {
		board: [],
	};

	for (let i = 0; i < allCells.length; i++) {
		const [rowIndex, colIndex] = getCellLocation(allCells[i]);
		const colour = getColorOfCell(allCells[i]);

		var cellEntry = {
			row: rowIndex,
			col: colIndex,
			type: 'all',
			colour: colour,
		};

		data.board.push(cellEntry);
	}

	for (let i = 0; i < topCells.length; i++) {
		const [rowIndex, colIndex] = getCellLocation(topCells[i]);
		const colour = getColorOfCell(topCells[i]);

		var cellEntry = {
			row: rowIndex,
			col: colIndex,
			type: 'top',
			colour: colour,
		};

		data.board.push(cellEntry);
	}

	var dataJSON = JSON.stringify(data);
	console.log(data)
	return data
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
						boardState
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
		// boardState = saveJSON()
		try {
			const currentGame = await db.Game.findByPk(req.params.id);
			const updatedGame = await currentGame.update({
				gameState: {
					status: 'active',
					boardState: currentGame.gameState.boardState,
				},
			});
			console.log('this is the gamestate')
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
				boardState: currentGame.gameState.boardState
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
