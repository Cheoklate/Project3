export default function initGamesController(db) {
	const create = async (req, res) => {
		const cardDeck = shuffleCards(makeDeck());
		const player1Card = cardDeck.pop();
		const player2Card = cardDeck.pop();
		let player1Score = 0;
		let player2Score = 0;

		// determine winner
		let result;

		if (player1Card.rank > player2Card.rank) {
			result = 'Player 1 wins!!'; 
			player1Score += 1;
		} else if (player1Card.rank < player2Card.rank) {
			result = 'Player 2 wins!!';
			player2Score += 1;
		} else {
			result = 'Draw';
		}

		try {
			// find game in progress or create new game
			const [currentGame, created] = await db.Game.findOrCreate({
				where: {
					gameState: { status: 'active' },
				},
				defaults: {
					gameState: {
						status: 'active',
						cardDeck,
						player1Card,
						player2Card,
						result,
						score: {
							player1: player1Score,
							player2: player2Score,
						},
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
				player1Card: currentGame.gameState.player1Card,
				player2Card: currentGame.gameState.player2Card,
				result: currentGame.gameState.result,
				score: currentGame.gameState.score,
				status: currentGame.gameState.status,
			});
		} catch (error) {}
	};

	// gets another 2 cards from the current card deck
	const deal = async (req, res) => {
		try {
			const currentGame = await db.Game.findByPk(req.params.id);

			const player1Card = currentGame.gameState.cardDeck.pop();
			const player2Card = currentGame.gameState.cardDeck.pop();

			let result;

			if (player1Card.rank > player2Card.rank) {
				result = 'Player 1 wins!!';
				currentGame.gameState.score.player1 += 1;
			} else if (player1Card.rank < player2Card.rank) {
				result = 'Player 2 wins!!';
				currentGame.gameState.score.player2 += 1;
			} else {
				result = 'Draw';
			}

			const updatedGame = await currentGame.update({
				gameState: {
					status: 'active',
					cardDeck: currentGame.gameState.cardDeck,
					player1Card,
					player2Card,
					result,
					score: {
						player1: currentGame.gameState.score.player1,
						player2: currentGame.gameState.score.player2,
					},
				},
			});

			res.send({
				id: updatedGame.id,
				player1Card: updatedGame.gameState.player1Card,
				player2Card: updatedGame.gameState.player2Card,
				result: updatedGame.gameState.result,
				score: updatedGame.gameState.score,
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
				player1Card: updatedGame.gameState.player1Card,
				player2Card: updatedGame.gameState.player2Card,
				result: updatedGame.gameState.result,
				score: updatedGame.gameState.score,
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
		deal,
		logout,
	};
}
