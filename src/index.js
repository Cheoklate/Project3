import axios from 'axios';
import './styles.scss';

const topContainerDiv = document.createElement('div');
topContainerDiv.classList.add('top-container');
document.body.appendChild(topContainerDiv);

const loginBtn = document.createElement('button');

// contents of login div
const loginDiv = document.createElement('div');
loginDiv.classList.add('login-div');
topContainerDiv.appendChild(loginDiv);

// user email input
const emailDiv = document.createElement('div');
emailDiv.classList.add('email');
loginDiv.appendChild(emailDiv);
const emailLabel = document.createElement('label');
emailLabel.setAttribute('for', 'email');
emailLabel.textContent = 'email: ';
emailDiv.appendChild(emailLabel);
const emailInput = document.createElement('input');
emailInput.setAttribute('id', 'email');
emailDiv.appendChild(emailInput);

// user password input
const passwordDiv = document.createElement('div');
passwordDiv.classList.add('password');
loginDiv.appendChild(passwordDiv);
const passwordLabel = document.createElement('label');
passwordLabel.setAttribute('for', 'password');
passwordLabel.textContent = 'password: ';
passwordDiv.appendChild(passwordLabel);
const passwordInput = document.createElement('input');
passwordInput.setAttribute('id', 'password');
passwordDiv.appendChild(passwordInput);

// submit login button
const loginBtnDiv = document.createElement('div');
loginBtnDiv.classList.add('login-btn');
loginDiv.appendChild(loginBtnDiv);
loginBtn.setAttribute('type', 'submit');
loginBtn.textContent = 'log in';
loginBtnDiv.appendChild(loginBtn);

// start game button
const startGameBtn = document.createElement('button');
startGameBtn.setAttribute('type', 'submit');
startGameBtn.classList.add('start-btn');
startGameBtn.textContent = 'START/ JOIN GAME';

// dashboard div which contains the buttons div and user details div
const dashboardDiv = document.createElement('div');
dashboardDiv.classList.add('dashboard');

// contains start button, to be replaced by game buttons when start button is clicked
const startGameButtonDiv = document.createElement('div');
startGameButtonDiv.classList.add('start-btn-div');

// container which holds player cards
const gameplayContainerDiv = document.createElement('div');
gameplayContainerDiv.classList.add('main-gameplay');

// contains logout button and user details
const userDiv = document.createElement('div');

// logout button
const logoutBtnDiv = document.createElement('div');
logoutBtnDiv.classList.add('logout-container');
userDiv.appendChild(logoutBtnDiv);

const logoutBtn = document.createElement('button');
logoutBtn.classList.add('logout-btn');
logoutBtn.textContent = 'Log out';
logoutBtnDiv.appendChild(logoutBtn);

// when the login button is clicked
loginBtn.addEventListener('click', () => {
  axios
    .post('/login', {
      email: document.querySelector('#email').value,
      password: document.querySelector('#password').value,
    })
    .then((response) => {
      console.log(response.data);

      // clear login elements
      loginDiv.remove();

      // replace them with dashboard elements
      topContainerDiv.appendChild(dashboardDiv);

      // contains logged in user's details

      dashboardDiv.appendChild(userDiv);
      userDiv.classList.add('user-details');
      const emailDiv = document.createElement('div');
      userDiv.appendChild(emailDiv);
      emailDiv.textContent = `user email: ${response.data.user.email}`;

      // append start game button container to dashboard div
      dashboardDiv.appendChild(startGameButtonDiv);

      // append start game button tp container in dashboard
      startGameButtonDiv.appendChild(startGameBtn);
    })
    .catch((error) => console.log(error));
});

logoutBtn.addEventListener('click', () => {
  axios
    .put(`/logout/${currentGame.id}`)
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => console.log(error));
});
// create deal and refresh buttons
const dealBtn = document.createElement('button');
dealBtn.innerText = 'DEAL';

const refreshBtn = document.createElement('button');
refreshBtn.textContent = 'REFRESH';

// set current game variable
let currentGame;

// player cards
const card1 = document.createElement('div');
card1.classList.add('card');

const card2 = document.createElement('div');
card2.classList.add('card');

// where results are displayed
const resultDiv = document.createElement('div');

// when start button is clicked
startGameBtn.addEventListener('click', () => {
  startGameBtn.remove();

  // append deal and refresh buttons to dashboard
  startGameButtonDiv.appendChild(dealBtn);
  startGameButtonDiv.appendChild(refreshBtn);

  // display gameplay container
  document.body.appendChild(gameplayContainerDiv);

  // if there already is a game in progress

  axios
    .get('/start')
    .then((response) => {
      console.log(response);

      currentGame = response.data;
      console.log('current game', currentGame);

      dealBtn.addEventListener('click', () => {
        card1.innerHTML = '';
        card2.innerHTML = '';
        resultDiv.innerHTML = '';

        axios
          .put(`./deal/${currentGame.id}`)
          .then((response1) => {
            console.log(response1);
            currentGame = response1.data;
            // change content of scorecard
            resultDiv.innerHTML = `${response1.data.result}<br>player 1: ${response1.data.score.player1}<br>player 2: ${response1.data.score.player2}`;

            // change content of cards
            card1.innerHTML = `${response1.data.player1Card.name} of ${response1.data.player1Card.suit}`;
            card2.innerHTML = `${response1.data.player2Card.name} of ${response1.data.player2Card.suit}`;
          })
          .catch((error) => console.log(error));
      });

      // div that holds player's scores
      const scoreCardDiv = document.createElement('div');
      scoreCardDiv.classList.add('scorecard');
      gameplayContainerDiv.appendChild(scoreCardDiv);

      // displays result of current game

      resultDiv.innerHTML = `${response.data.result}<br>player 1: ${response.data.score.player1}<br>player 2: ${response.data.score.player2}`;
      scoreCardDiv.appendChild(resultDiv);

      // container that holds both players' cards
      const playerCardsDiv = document.createElement('div');
      playerCardsDiv.classList.add('cards-container');
      gameplayContainerDiv.appendChild(playerCardsDiv);

      // player cards
      card1.textContent = `${response.data.player1Card.name} of ${response.data.player1Card.suit}`;
      playerCardsDiv.appendChild(card1);

      card2.textContent = `${response.data.player2Card.name} of ${response.data.player2Card.suit}`;
      playerCardsDiv.appendChild(card2);
    })
    .catch((error) => console.log(error));
});

// displays the latest game to the user
refreshBtn.addEventListener('click', () => {
  axios
    .post('/refresh', {
      id: currentGame.id,
    })
    .then((response) => {
      console.log(response);

      // clear contents of cards
      card1.innerHTML = '';
      card2.innerHTML = '';
      resultDiv.innerHTML = '';

      // change content of scorecard
      resultDiv.innerHTML = `${response.data.result}<br>player 1: ${response.data.score.player1}<br>player 2: ${response.data.score.player2}`;
      // change content of cards
      card1.innerHTML = `${response.data.player1Card.name} of ${response.data.player1Card.suit}`;
      card2.innerHTML = `${response.data.player2Card.name} of ${response.data.player2Card.suit}`;
    })
    .catch((error) => console.log(error));
});
