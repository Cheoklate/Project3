import axios from 'axios';
import './styles.scss';

/*
// DOM Elements
const allCells = document.querySelectorAll('.cell:not(.row-top)');
const topCells = document.querySelectorAll('.cell.row-top');
const resetButton = document.querySelector('.reset');
const statusSpan = document.querySelector('.status');

// columns
const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
const columns = [column0, column1, column2, column3, column4, column5, column6];


// rows
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];


// variables
let gameIsLive = true;
let yellowIsNext = true;


// Functions
const getClassListArray = (cell) => {
  const classList = cell.classList;
  return [...classList];
};

const getCellLocation = (cell) => {
  const classList = getClassListArray(cell);

  const rowClass = classList.find(className => className.includes('row'));
  const colClass = classList.find(className => className.includes('col'));
  const rowIndex = rowClass[4];
  const colIndex = colClass[4];
  const rowNumber = parseInt(rowIndex, 10);
  const colNumber = parseInt(colIndex, 10);

  return [rowNumber, colNumber];
};

const getFirstOpenCellForColumn = (colIndex) => {
  const column = columns[colIndex];
  const columnWithoutTop = column.slice(0, 6);

  for (const cell of columnWithoutTop) {
    const classList = getClassListArray(cell);
    if (!classList.includes('yellow') && !classList.includes('red')) {
      return cell;
    }
  }

  return null;
};

const clearColorFromTop = (colIndex) => {
  const topCell = topCells[colIndex];
  topCell.classList.remove('yellow');
  topCell.classList.remove('red');
};

const getColorOfCell = (cell) => {
  const classList = getClassListArray(cell);
  if (classList.includes('yellow')) return 'yellow';
  if (classList.includes('red')) return 'red';
  return null;
};

const checkWinningCells = (cells) => {
  if (cells.length < 4) return false;

  gameIsLive = false;
  for (const cell of cells) {
    cell.classList.add('win');
  }
  statusSpan.textContent = `${yellowIsNext ? 'Yellow' : 'Red'} has won!`
  return true;
};

const checkStatusOfGame = (cell) => {
  const color = getColorOfCell(cell);
  if (!color) return;
  const [rowIndex, colIndex] = getCellLocation(cell);

  // Check horizontally
  let winningCells = [cell];
  let rowToCheck = rowIndex;
  let colToCheck = colIndex - 1;
  while (colToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      colToCheck--;
    } else {
      break;
    }
  }
  colToCheck = colIndex + 1;
  while (colToCheck <= 6) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      colToCheck++;
    } else {
      break;
    }
  }
  let isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // Check vertically
  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex;
  while (rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex + 1;
  while (rowToCheck <= 5) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // Check diagonally /
  winningCells = [cell];
  rowToCheck = rowIndex + 1;
  colToCheck = colIndex - 1;
  while (colToCheck >= 0 && rowToCheck <= 5) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
      colToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex + 1;
  while (colToCheck <= 6 && rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
      colToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;


  // Check diagonally \
  winningCells = [cell];
  rowToCheck = rowIndex - 1;
  colToCheck = colIndex - 1;
  while (colToCheck >= 0 && rowToCheck >= 0) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck--;
      colToCheck--;
    } else {
      break;
    }
  }
  rowToCheck = rowIndex + 1;
  colToCheck = colIndex + 1;
  while (colToCheck <= 6 && rowToCheck <= 5) {
    const cellToCheck = rows[rowToCheck][colToCheck];
    if (getColorOfCell(cellToCheck) === color) {
      winningCells.push(cellToCheck);
      rowToCheck++;
      colToCheck++;
    } else {
      break;
    }
  }
  isWinningCombo = checkWinningCells(winningCells);
  if (isWinningCombo) return;

  // Check to see if we have a tie
  const rowsWithoutTop = rows.slice(0, 6);
  for (const row of rowsWithoutTop) {
    for (const cell of row) {
      const classList = getClassListArray(cell);
      if (!classList.includes('yellow') && !classList.includes('red')) {
        return;
      }
    }
  }

  gameIsLive = false;
  statusSpan.textContent = "Game is a tie!";
};



// Event Handlers
const handleCellMouseOver = (e) => {
  if (!gameIsLive) return;
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const topCell = topCells[colIndex];
  topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
};

const handleCellMouseOut = (e) => {
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);
  clearColorFromTop(colIndex);
};

const handleCellClick = (e) => {
  if (!gameIsLive) return;
  const cell = e.target;
  const [rowIndex, colIndex] = getCellLocation(cell);

  const openCell = getFirstOpenCellForColumn(colIndex);

  if (!openCell) return;

  openCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  checkStatusOfGame(openCell);

  yellowIsNext = !yellowIsNext;
  clearColorFromTop(colIndex);
  if (gameIsLive) {
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowIsNext ? 'yellow' : 'red');
  }
};




// Adding Event Listeners
for (const row of rows) {
  for (const cell of row) {
    cell.addEventListener('mouseover', handleCellMouseOver);
    cell.addEventListener('mouseout', handleCellMouseOut);
    cell.addEventListener('click', handleCellClick);
  }
}

resetButton.addEventListener('click', () => {
  for (const row of rows) {
    for (const cell of row) {
      cell.classList.remove('red');
      cell.classList.remove('yellow');
      cell.classList.remove('win');
    }
  }
  gameIsLive = true;
  yellowIsNext = true;
  statusSpan.textContent = '';
});

*/

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
