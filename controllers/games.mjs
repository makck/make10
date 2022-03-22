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
 * Function to create the deck of cards
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

      deck.push(card);

      rankCounter += 1;
    }
    suitIndex += 1;
  }

  return deck;
};

// =================================================================================
// ============================== Controller Function ==============================
// =================================================================================

export default function initGamesController(db) {
  // Render main games page
  const index = (req, res) => {
    res.render('index');
  };

  // Render page to view avaialble games to join
  const viewLobby = async (req, res) => {
    try {
      const availableGames = await db.Game.findAll()

      res.render('gameLobby')
    } catch (error) {
      response.status(500).send(error);
  } 

  // create a new game and insert a new row in the DB.
  const create = async (req, res) => {
    // Create a deck of shuffled cards
    const cardDeck = shuffleCards(makeDeck());

    // Create objects representing 2 players

    // Deal 6 cards for each player
    const playerHand = [cardDeck.pop(), cardDeck.pop()];

    const newGame = {
      gameState: {
        cardDeck,
        playerHand,
      },
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      response.send({
        id: game.id,
        playerHand: game.gameState.playerHand,
      });
    } catch (error) {
      response.status(500).send(error);
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
    create
  };
}