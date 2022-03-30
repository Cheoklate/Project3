import db from './models/index.mjs';

import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);
  // main page
  app.get('/', UsersController.root);
  app.post('/login', UsersController.login);
  app.get('/start', GamesController.create);
  app.put('/deal/:id', GamesController.deal);
  app.post('/refresh', GamesController.update);
  // app.post('/join', GamesController.join);
  app.put('/logout/:id', GamesController.logout);
}
