import { resolve } from 'path';
import db from './models/index.mjs';
import initGamesController from './controllers/games.mjs';
import initUsersController from './controllers/users.mjs';
import initHackyController from './src/index.js'

export default function bindRoutes(app) {
  const GamesController = initGamesController(db);
  const UsersController = initUsersController(db);
  const HackyController = initHackyController(db);
  // main page
  app.get('/', (request, response) => {
    response.sendFile(resolve('dist', 'main.html'));
  });
  app.post('/login', UsersController.login);
  app.get('/start', GamesController.create);
  app.put('/move/:id', HackyController.move);
  app.post('/refresh', GamesController.update); 
  // app.post('/join', GamesController.join);
  app.put('/logout/:id', GamesController.logout); 
}
