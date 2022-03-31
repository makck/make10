// =================================================================================
// ============================== Helper Functions ==============================
// =================================================================================

/**
 * Function to create new divs
 * @param {*} divID
 * @returns Div element
 */
const createDiv = (divId) => {
  const newDiv = document.createElement('div');
  newDiv.id = divId;
  return newDiv;
};

/**
 * Create label elements
 * @param {*} labelId
 * @param {*} labelText
 * @returns
 */
const createLabel = (labelId, labelText) => {
  const newLabel = document.createElement('label');
  newLabel.setAttribute('id', labelId);
  newLabel.innerText = `${labelText}:`;
  return newLabel;
};

/**
 * Create button elements
 * @param {*} buttonId
 * @param {*} buttonText
 * @returns
 */
const createButton = (buttonId, buttonText) => {
  const newButton = document.createElement('button');
  newButton.setAttribute('id', buttonId);
  newButton.innerText = buttonText;
  return newButton;
};

/**
 * Craete input elements
 * @param {*} inputId
 * @param {*} inputType
 * @returns
 */
const createInput = (inputId, inputType) => {
  const newInput = document.createElement('input');
  newInput.setAttribute('id', inputId);
  newInput.setAttribute('type', inputType);
  return newInput;
};

/**
 * Appends elements to containers
 * @param {*} container
 * @param {*} inputArray - Array of elements to append
 */
const appendItems = (container, inputArray) => {
  inputArray.forEach((element) => {
    container.appendChild(element);
  });
};

const findElements = (searchKey) => document.querySelector(searchKey);

/**
 * Remove all contents in divs
 * @param {*} inputElements
 */
const resetElements = (inputElements) => {
  inputElements.forEach((element) => {
    element.innerHTML = '';
  });
};

/**
 * Function to toggle hold or remove for the card
 * @param {object} inputCard Single card details
 */
const toggleDiscard = (inputCard) => {
  if (inputCard.discardStatus === 'hold') {
    inputCard.discardStatus = 'discard';
  } else if (inputCard.discardStatus === 'discard') {
    inputCard.discardStatus = 'hold';
  }
};

/**
 * Create DOM element with card visual
 * @param {object} cardInfo Object containing card details such as suit and rank etc
 * @returns DOM element of each card
 */
const createCard = (cardInfo) => {
  const card = createDiv('card');
  card.setAttribute('class', 'card');

  // const cardImage = document.createElement('img');
  // cardImage.setAttribute('src', cardImageSource);

  const suit = document.createElement('div');
  suit.classList.add('suit');
  suit.innerText = cardInfo.suit;

  const name = document.createElement('div');
  // name.classList.add('name');
  name.innerText = cardInfo.name;

  card.addEventListener('click', () => {
    toggleDiscard(cardInfo);
    if (cardInfo.discardStatus === 'discard') {
      card.classList.add('discard-card');
      card.classList.remove('card');
    } else if (cardInfo.holdStatus === 'hold') {
      card.classList.add('card');
      card.classList.remove('discard-card');
    }
  });

  appendItems(card, [name, suit]);

  return card;
};

/**
 * Refresh the card display on frontend
 * @param {*} inputGame
 */
const refreshHand = (inputGame) => {
  resetElements([mainContainer, opponentDashboard, playerDashboard, opponentCardDisplay, playerCardDisplay, playerOptions]);

  for (let i = 0; i < inputGame.player2Hand.length; i += 1) {
    appendItems(opponentCardDisplay, [createCard(inputGame.player2Hand[i])]);
  }

  for (let i = 0; i < inputGame.player1Hand.length; i += 1) {
    appendItems(playerCardDisplay, [createCard(inputGame.player1Hand[i])]);
  }

  opponentDashboard.setAttribute('class', 'card-display');
  opponentDashboard.innerText = "Opponent's Cards";
  opponentCardDisplay.setAttribute('class', 'card-display');

  playerDashboard.setAttribute('class', 'card-display');
  playerDashboard.innerText = 'Your Cards';
  playerCardDisplay.setAttribute('class', 'card-display');

  appendItems(opponentDashboard, [opponentCardDisplay]);
  appendItems(playerDashboard, [playerCardDisplay]);
  appendItems(playerOptions, [discardButton, doneRoundButton]);
  appendItems(mainGameDashboard, [opponentDashboard, playerDashboard, playerOptions]);
  appendItems(mainContainer, [mainGameDashboard]);
  appendItems(document.body, [mainContainer]);
};

const checkWin = () => {
  if (currentGame.player1Hand.length === 1) {
    resetElements([mainContainer, opponentDashboard, playerDashboard, opponentCardDisplay, playerCardDisplay, playerOptions]);

    mainContainer.innerText = 'You lose';
    return true;
  } if (currentGame.player1Hand.length === 0) {
    resetElements([mainContainer, opponentDashboard, playerDashboard, opponentCardDisplay, playerCardDisplay, playerOptions]);

    mainContainer.innerText = 'You lose';
    return true;
  }
};

// =================================================================================
// ============================== Page Logic Functions ==============================
// =================================================================================

// When log in button is clicked
const userLogin = () => {
  axios
    .post('/login', {
      email: findElements('#emailInput').value,
      password: findElements('#passwordInput').value,
    })
    .then((res) => {
      console.log(res.data);

      findElements('#mainContainer').remove();
      mainContainer.setAttribute('class', 'px-4 py-5 my-5 text-center');

      opponentDashboard.setAttribute('class', 'display-5 fw-bold');
      opponentDashboard.innerText = 'Old Maid';

      playerDashboard.setAttribute('class', 'col-lg-6 mx-auto');
      playerDashboard.innerText = 'The goal is to form and discard pairs of cards, and not to be left with the odd card (a queen) at the end. Have fun!';

      appendItems(playerOptions, [startGameButton]);
      appendItems(mainGameDashboard, [opponentDashboard, playerDashboard, playerOptions]);
      appendItems(mainContainer, [mainGameDashboard]);
      appendItems(document.body, [mainContainer]);
    })
    .catch((error) => console.log(error));
};

// Start game button click
let currentGame = null;
const startGame = () => {
  axios
    .post('/game')
    .then((res) => {
      currentGame = res.data;
      console.log('CurrentGame', currentGame);

      refreshHand(currentGame);
    })
    .catch((error) => {
      console.log(error);
    });
};

// When discard button is clicked, check if selected pair is valid
const discardCards = () => {
  const discardedCards = [];
  const updatedHand = [];
  for (let i = 0; i < currentGame.player1Hand.length; i += 1) {
    if (currentGame.player1Hand[i].discardStatus === 'discard') {
      discardedCards.push(currentGame.player1Hand[i]);
    } else {
      updatedHand.push(currentGame.player1Hand[i]);
    }
  }
  try {
    axios
      .put(`/game/${currentGame.id}/discard`, {
        discardHand: discardedCards,
        newHand: updatedHand,
      })
      .then((res) => {
        currentGame = res.data;
        console.log('after discard', currentGame);
        refreshHand(currentGame);
      });
  } catch (error) {
    console.log(error);
  }
};

// When turn done is clicked
const turnDone = () => {
  if (checkWin()) {
    console.log('game end');
  } else {
    try {
      axios
        .put(`/game/${currentGame.id}/ai-play`)
        .then((res) => {
          currentGame = res.data;
          refreshHand(currentGame);
        });
    } catch (error) { console.log(error); }
  }
};

// =================================================================================
// ============================== DOM Elements ==============================
// =================================================================================

findElements('#loginButton').addEventListener('click', userLogin);

// Main container that will store all other elements
const mainContainer = createDiv('mainContainer');

// Create gameplay dashboard
const mainGameDashboard = createDiv('mainGameDashboard');
const opponentDashboard = createDiv('opponentDashboard');
const opponentCardDisplay = createDiv('opponentCardDisplay');
const playerDashboard = createDiv('playerDashboard');
const playerCardDisplay = createDiv('playerCardDisplay');
const playerOptions = createDiv('playerOptions');

const startGameButton = createButton('startGameButton', 'Start Game');
startGameButton.setAttribute('class', 'btn btn-secondary btn-lg px-4 gap-3');
startGameButton.addEventListener('click', startGame);

const discardButton = createButton('discardButton', 'Discard');
discardButton.addEventListener('click', discardCards);

const doneRoundButton = createButton('doneRoundButton', 'Done');
doneRoundButton.addEventListener('click', turnDone);
