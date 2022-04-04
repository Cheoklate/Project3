/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *
 *                  Card Deck Functions
 *
 * ========================================================
 * ========================================================
 * ========================================================
 */

// get a random index from an array given it's size
const getRandomIndex = function (size) {
	return Math.floor(Math.random() * size);
};

// cards is an array of card objects
const shuffleCards = function (cards) {
	let currentIndex = 0;

	// loop over the entire cards array
	while (currentIndex < cards.length) {
		// select a random position from the deck
		const randomIndex = getRandomIndex(cards.length);

		// get the current card in the loop
		const currentItem = cards[currentIndex];

		// get the random card
		const randomItem = cards[randomIndex];

		// swap the current card and the random card
		cards[currentIndex] = randomItem;
		cards[randomIndex] = currentItem;

		currentIndex += 1;
	}

	// give back the shuffled deck
	return cards;
};

const makeDeck = function () {
	// create the empty deck at the beginning
	const deck = [];

	const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

	let suitIndex = 0;
	while (suitIndex < suits.length) {
		// make a variable of the current suit
		const currentSuit = suits[suitIndex];

		// loop to create all cards in this suit
		// rank 1-13
		let rankCounter = 1;
		while (rankCounter <= 13) {
			let cardName = rankCounter;

			// 1, 11, 12 ,13
			if (cardName === 1) {
				cardName = 'ace';
			} else if (cardName === 11) {
				cardName = 'jack';
			} else if (cardName === 12) {
				cardName = 'queen';
			} else if (cardName === 13) {
				cardName = 'king';
			}

			// make a single card object variable
			const card = {
				name: cardName,
				suit: currentSuit,
				rank: rankCounter,
			};

			// add the card to the deck
			deck.push(card);

			rankCounter += 1;
		}
		suitIndex += 1;
	}

	return deck;
};

/*
 * ========================================================
 * ========================================================
 * ========================================================
 * ========================================================
 *  */

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
