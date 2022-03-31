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
 * Create DOM element with card visual
 * @param {object} cardInfo Object containing card details such as suit and rank etc
 * @returns DOM element of each card
 */
const createCard = (cardInfo, cardImageSource) => {
  const card = document.createElement('img');
  card.setAttribute('src', cardImageSource);
  card.classList.add('card');

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

  return card;
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
    })
    .catch((error) => {
      console.log(error);
    });
};

// When discarded pile is clicked

// When turn done is clicked

// =================================================================================
// ============================== DOM Elements ==============================
// =================================================================================

// Main container that will store all other elements
const mainContainer = createDiv('mainContainer');

// Create gameplay dashboard
const mainGameDashboard = createDiv('mainGameDashboard');
const opponentDashboard = createDiv('opponentDashboard');
const playerDashboard = createDiv('playerDashboard');
const playerOptions = createDiv('playerOptions');

const startGameButton = createButton('startGameButton', 'Start Game');
startGameButton.setAttribute('class', 'btn btn-secondary btn-lg px-4 gap-3');
startGameButton.addEventListener('click', startGame);

findElements('#loginButton').addEventListener('click', userLogin);

// appendItems(emailDiv, [emailLabel, emailInput]);
// appendItems(passwordDiv, [passwordLabel, passwordInput]);
// appendItems(loginDiv, [emailDiv, passwordDiv, loginButton]);
// appendItems(mainContainer, [loginDiv]);
// appendItems(document.body, [mainContainer]);
