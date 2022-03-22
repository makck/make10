import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  // const UserController = initUsersController(db);

  // Main index page for game
  app.get('/', GamesController.index);

  // Create a new game
  app.post('/game', GamesController.createGame);

  // View available games in lobby
  app.get('/lobby', GamesController.viewLobby);

  // Join a game created in the lobby
  app.put('/game/:id/join', GamesController.joinGame);

  // Update when player draws from deck
  app.put('/game/:id/drawDeck', GamesController.drawDeck);

  // Update when player draws from discarded pile
  app.put('/game/:id/drawDiscard', GamesController.drawDiscard);

  // Update when player discards single card from hand
  app.put('/game/:id/discard', GamesController.discardCard);

  // User sign up
  app.get('/signup', SignupController.index);
  app.post('/signup', SignupController.create);

  // user login
  app.get('/user', UserController.dashboard);
  app.post('/login', UserController.login);
}
