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

  // // Update when player discards card from hand
  app.put('/game/:id/discard', GamesController.discardCard);

  // user login
  // app.get('/user', UserController.dashboard);
  app.post('/login', UserController.login);
}
