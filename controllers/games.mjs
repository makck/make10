// =================================================================================
// ============================== Card Deck Functions ==============================
// =================================================================================

/**
 * Produces a random number within a specified number
 * @param size Maximum integer
 * @returns Number
 */
const getRandomIndex = (size) => Math.floor(Math.random() * size);

/**
 * Function that shuffles a deck of cards
 * @param cards
 * @returns Array of shuffed cards
 */
const shuffleCards = (cards) => {
  let currentIndex = 0;

  while (currentIndex < cards.length) {
    const randomIndex = getRandomIndex(cards.length);

    const currentItem = cards[currentIndex];

    const randomItem = cards[randomIndex];

    cards[currentIndex] = randomItem;
    cards[randomIndex] = currentItem;

    currentIndex += 1;
  }
  return cards;
};

/**
 * Function to create the deck of cards, less the queen of spades
 * @returns Array of object which forms the deck of cards
 */
const makeDeck = () => {
  const deck = [];

  const suits = ['hearts', 'diamonds', 'clubs', 'spades'];

  let suitIndex = 0;
  while (suitIndex < suits.length) {
    const currentSuit = suits[suitIndex];

    let rankCounter = 1;
    while (rankCounter <= 13) {
      let cardName = rankCounter;

      if (cardName === 1) {
        cardName = 'ace';
      } else if (cardName === 11) {
        cardName = 'jack';
      } else if (cardName === 12) {
        cardName = 'queen';
      } else if (cardName === 13) {
        cardName = 'king';
      }

      let cardImage;

      cardImage = `/public/card-images/${cardName}_of_${currentSuit}.png`;

      const card = {
        name: cardName,
        suit: currentSuit,
        rank: rankCounter,
        image: cardImage,
      };

      if (!(card.rank === 12 && card.suit === 'spades')) {
        deck.push(card);
      }

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

// Check if valid pair when player select

// Player discard selected pairs

// Computer discard all pairs on hand

/**
 * Deal starting hand to players
 * @param numberOfPlayers
 * @param cardDeck
 * @returns Player hand array of card objects
 */
const dealStartingCards = (numberOfPlayers, cardDeck) => {
  const player1Hand = [];
  const player2Hand = [];
  const player3Hand = [];
  const player4Hand = [];

  if (numberOfPlayers === 3) {
    while (cardDeck.length !== 0) {
      player1Hand.append(cardDeck.pop());
      player2Hand.append(cardDeck.pop());
      player3Hand.append(cardDeck.pop());
    }
    return { player1Hand, player2Hand, player3Hand };
  } if (numberOfPlayers === 4) {
    while (cardDeck.length !== 0) {
      player1Hand.append(cardDeck.pop());
      player2Hand.append(cardDeck.pop());
      player3Hand.append(cardDeck.pop());
      player4Hand.append(cardDeck.pop());
    }
    return {
      player1Hand, player2Hand, player3Hand, player4Hand,
    };
  }
  while (cardDeck.length !== 0) {
    player1Hand.append(cardDeck.pop());
    player2Hand.append(cardDeck.pop());
  }
  return { player1Hand, player2Hand };
};

// =================================================================================
// ============================== Controller Function ==============================
// =================================================================================

export default function initGamesController(db) {
  // Render main games page
  const index = (req, res) => {
    res.render('index');
  };

  // create a new game and insert a new row in the DB.
  const create = async (req, res) => {
    // Create a deck of shuffled cards
    const cardDeck = shuffleCards(makeDeck());

    // Create objects representing 2 players
    // Deal 5 cards for each player
    const player1Hand = [];
    const player2Hand = [];

    for (let i = 0; i < 4; i += 1) {
      player1Hand.append(cardDeck.pop());
      player2Hand.append(cardDeck.pop());
    }

    // Create the discard pile
    const discardPile = [];

    // Initialise player scores
    const player1Score = 0;
    const player2Score = 0;

    const newGame = {
      gameState: {
        gameProgress: 'In Progress',
        cardDeck,
        player1Hand,
        player2Hand,
        discardPile,
      },
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      res.send({
        id: game.id,
        playerHand: game.gameState.playerHand,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // deal two new cards from the deck.
  const deal = async (request, response) => {
    try {
      // get the game by the ID passed in the request
      const game = await db.Game.findByPk(request.params.id);

      // make changes to the object
      const playerHand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];

      // update the game with the new info
      await game.update({
        gameState: {
          cardDeck: game.gameState.cardDeck,
          playerHand,
        },

      });

      // send the updated game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        playerHand: game.gameState.playerHand,
      });
    } catch (error) {
      response.status(500).send(error);
    }
  };

  return {
    index,
    viewLobby,
    create,
  };
}
