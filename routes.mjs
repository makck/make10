import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UserController = initUsersController(db);

  // Main index page for game
  app.get('/', GamesController.index);

  // Create a new game
  app.post('/game', GamesController.createGame);

  // // Update when player draws from deck
  // app.put('/game/:id/drawDeck', GamesController.drawDeck);

  // // Update when player draws from discarded pile
  // app.put('/game/:id/drawDiscard', GamesController.drawDiscard);

  // // Update when player discards single card from hand
  // app.put('/game/:id/discard', GamesController.discardCard);

  // user login
  // app.get('/user', UserController.dashboard);
  app.post('/login', UserController.login);
}
