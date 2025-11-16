// --- Game state ---
const boardEl = document.getElementById('board');
const cells = Array.from(document.querySelectorAll('.cell'));
const statusMsg = document.getElementById('statusMsg');
const turnLabel = document.getElementById('turnLabel');
const resetBtn = document.getElementById('resetBtn');

let board = Array(9).fill(null); // values: 'X', 'O', or null
let current = 'X';               // current player
let gameOver = false;

// All winning triplets (indices)
const wins = [
  [0,1,2], [3,4,5], [6,7,8],    // rows
  [0,3,6], [1,4,7], [2,5,8],    // cols
  [0,4,8], [2,4,6]              // diagonals
];

// --- Helpers ---
function setMessage(text) { statusMsg.textContent = text; }
function setTurnLabel() { turnLabel.textContent = current; }

function markCell(cell, symbol) {
  cell.textContent = symbol;
  cell.classList.add(symbol.toLowerCase());
  cell.classList.add('disabled');
}

function checkWinner() {
  for (const [a,b,c] of wins) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      highlightWin([a,b,c]);
      return board[a]; // 'X' or 'O'
    }
  }
  return null;
}

function highlightWin(indices) {
  indices.forEach(i => cells[i].classList.add('win'));
}

function isDraw() {
  return board.every(v => v !== null);
}

function lockBoard() {
  gameOver = true;
  cells.forEach(cell => cell.classList.add('disabled'));
}

function unlockBoard() {
  gameOver = false;
  cells.forEach(cell => cell.classList.remove('disabled', 'win', 'x', 'o'));
}

function resetGame() {
  board = Array(9).fill(null);
  current = 'X';
  unlockBoard();
  cells.forEach(cell => cell.textContent = '');
  setTurnLabel();
  setMessage('Make a move');
}

// --- Main click handler ---
function handleCellClick(e) {
  const cell = e.target;
  const idx = Number(cell.dataset.index);

  if (gameOver || board[idx] !== null) return;

  // place current symbol
  board[idx] = current;
  markCell(cell, current);

  // check win/draw
  const winner = checkWinner();
  if (winner) {
    setMessage(`${winner} wins!`);
    lockBoard();
    return;
  }
  if (isDraw()) {
    setMessage('It\'s a draw!');
    lockBoard();
    return;
  }

  // switch turn
  current = current === 'X' ? 'O' : 'X';
  setTurnLabel();
  setMessage(`Turn: ${current}`);
}

// --- Init ---
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
setTurnLabel();
setMessage('Make a move');
