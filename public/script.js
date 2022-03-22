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

// =================================================================================
// ============================== Page Logic Functions ==============================
// =================================================================================

// When log in button is clicked
const userLogin = () => {
  axios
    .post('/login', {
      email: findElements('#emailInput').value,
      password: findElements('#passwordInput').value,
    });
};

// When log out button is clicked

// When signup button is clicked

// When faced down deck is clicked

// When discarded pile is clicked

// When turn done is clicked

// =================================================================================
// ============================== DOM Elements ==============================
// =================================================================================

// Main container that will store all other elements
const mainContainer = createDiv('mainContainer');

// Create items for login page
// Create divs for login overall, email, password
const loginDiv = createDiv('loginDiv');
const emailDiv = createDiv('emailDiv');
const passwordDiv = createDiv('passwordDiv');
// Email
const emailLabel = createLabel('emailLabel', 'Email');
const emailInput = createInput('emailInput', 'text');
// Password
const passwordLabel = createLabel('passwordLabel', 'Password');
const passwordInput = createInput('passwordInput', 'password');
// Button
const loginButton = createButton('loginButton', 'Log in');

// Create items for signup page
const registerDiv = createDiv('registerDiv');
// Name
const nameLabel = createLabel('nameLabel', 'Name');
const nameInput = createInput('nameInput', 'text');
// Button
const signUpButton = createButton('signUpButton', 'Sign up');

appendItems(emailDiv, [emailLabel, emailInput]);
appendItems(passwordDiv, [passwordLabel, passwordInput]);
appendItems(loginDiv, [emailDiv, passwordDiv, loginButton]);
appendItems(mainContainer, [loginDiv]);
appendItems(document.body, [mainContainer]);
