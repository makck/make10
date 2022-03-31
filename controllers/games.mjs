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

/**
 * Check if valid pair when player select
 * @param card1
 * @param card2
 * @returns boolean
 */
const checkValidPair = (card1, card2) => {
  if (card1.rank === card2.rank) {
    return true;
  }
  return false;
};

/**
 * Discards selected pair from player's hand, and add them in the discarded pile
 * @param card1
 * @param card2
 * @param playerHand
 * @param discardedPile
 * @returns Player hand and discarded pile
 */
const playerDiscard = (card1, card2, playerHand, discardedPile) => {
  const tempPlayerHand = [];
  tempPlayerHand.push(...playerHand);

  for (let i = 0; i < playerHand.length; i += 1) {
    if (playerHand[i].rank === card1.rank && playerHand[i].suit === card1.suit) {
      discardedPile.push(playerHand[i]);
      tempPlayerHand.splice(i, 1);
    }
    if (playerHand[i].rank === card2.rank && playerHand[i].suit === card2.suit) {
      discardedPile.push(playerHand[i]);
      tempPlayerHand.splice(i, 1);
    }
  }
  return { tempPlayerHand, discardedPile };
};

/**
 * Computer discard all pairs on hand
 * @param computerHand
 * @param discardedPile
 * @returns
 */
const computerDiscardPairs = (computerHand, discardedPile) => {
  computerHand.sort((a, b) => a.rank - b.rank);

  const tempComputerHand = [];
  tempComputerHand.push(...computerHand);

  for (let i = 0; i < computerHand.length; i += 1) {
    if (computerHand[i].rank === computerHand[i - 1].rank) {
      discardedPile.push(tempComputerHand[i]);
      discardedPile.push(tempComputerHand[i - 1]);
      tempComputerHand.splice(i, 1);
      tempComputerHand.splice(i - 1, 1);
    } else if (computerHand[i].rank === computerHand[i + 1].rank) {
      discardedPile.push(tempComputerHand[i]);
      discardedPile.push(tempComputerHand[i + 1]);
      tempComputerHand.splice(i, 1);
      tempComputerHand.splice(i + 1, 1);
    }
  }
  return tempComputerHand;
};

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
      player1Hand.push(cardDeck.pop());
      player2Hand.push(cardDeck.pop());
      player3Hand.push(cardDeck.pop());
    }
    return { player1Hand, player2Hand, player3Hand };
  } if (numberOfPlayers === 4) {
    while (cardDeck.length !== 0) {
      player1Hand.push(cardDeck.pop());
      player2Hand.push(cardDeck.pop());
      player3Hand.push(cardDeck.pop());
      player4Hand.push(cardDeck.pop());
    }
    return {
      player1Hand, player2Hand, player3Hand, player4Hand,
    };
  }
  while (cardDeck.length !== 0) {
    player1Hand.push(cardDeck.pop());
    player2Hand.push(cardDeck.pop());
  }
  return { player1Hand, player2Hand };
};

// Player to pick card from opponents hand
const pickCard = (playerHand, opponentHand, selectedCard) => {
  for (let i = 0; i < opponentHand.length; i += 1) {
    if (opponentHand.rank === selectedCard.rank && opponentHand.suit === selectedCard.suit) {
      opponentHand[i].splice(i, 1);
    }
  }
  playerHand.append(selectedCard);

  return { playerHand, opponentHand };
};

// =================================================================================
// ============================== Controller Function ==============================
// =================================================================================

export default function initGamesController(db) {
  // Render main games page
  const index = (req, res) => {
    res.render('login');
  };

  // create a new game and insert a new row in the DB.
  const createGame = async (req, res) => {
    // Create a deck of shuffled cards
    const cardDeck = shuffleCards(makeDeck());

    let overallPlayerHands = {};
    let player1Hand = [];
    let player2Hand = [];

    overallPlayerHands = dealStartingCards(2, cardDeck);
    player1Hand = overallPlayerHands.player1Hand;
    player2Hand = overallPlayerHands.player2Hand;

    console.log('player1hand', player1Hand);
    console.log('player2hand', player2Hand);
    // Create the discard pile
    const discardPile = [];

    const newGame = {
      game_state: {
        gameProgress: 'In Progress',
        cardDeck,
        player1Hand,
        player2Hand,
        discardPile,
      },
      created_at: new Date(),
      updated_at: new Date(),
    };

    try {
      // run the DB INSERT query
      const game = await db.Game.create(newGame);

      // send the new game back to the user.
      // dont include the deck so the user can't cheat
      res.send({
        id: game.id,
        player1Hand: game.game_state.player1Hand,
        player2Hand: game.game_state.player2Hand,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  };

  // // Player pick card from opponents hand
  // const pickCard = async (req, res) => {

  // };

  // // deal two new cards from the deck.
  // const deal = async (request, response) => {
  //   try {
  //     // get the game by the ID passed in the request
  //     const game = await db.Game.findByPk(request.params.id);

  //     // make changes to the object
  //     const playerHand = [game.gameState.cardDeck.pop(), game.gameState.cardDeck.pop()];

  //     // update the game with the new info
  //     await game.update({
  //       gameState: {
  //         cardDeck: game.gameState.cardDeck,
  //         playerHand,
  //       },

  //     });

  //     // send the updated game back to the user.
  //     // dont include the deck so the user can't cheat
  //     response.send({
  //       id: game.id,
  //       playerHand: game.gameState.playerHand,
  //     });
  //   } catch (error) {
  //     response.status(500).send(error);
  //   }
  // };

  return {
    index,
    createGame,
  };
}
