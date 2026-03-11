// Pool of possible words to use for pairs.
// Add up to 30 (or more) different options here.
const allWords = [
  'мама',
  'тата',
  'мики',
  'јаки',
  'баба',
  'деда',
  'супермен',
  'пас',
  'мачка',
  'плеј стејшн',
  'хранче',
  'сунце',
  'месец',
  'море',
  'планина',
  'трава',
  'наочаре',
  'школа',
  'андријана',
  'чича',
  'бетмен',
  'пита',
  'доручак',
  'оловка',
  'петица',
  'нос',
  'хлеб',
  'вода',
  'чарапа',
  'крушка',
];

// How many pairs to show on the board each game.
// With 4 pairs there will be 8 matching cards + 1 loner = 9 cards total.
const NUM_PAIRS = 4;

let cardValues = [];
let flippedCards = [];
let matchedCount = 0;
let mistakes = 0;
let score = 0;

function updateHUD() {
  const scoreEl = document.getElementById('score');
  const mistakesEl = document.getElementById('mistakes');
  if (scoreEl) scoreEl.textContent = score;
  if (mistakesEl) mistakesEl.textContent = mistakes;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  const board = document.getElementById('game-board');
  board.innerHTML = '';
  shuffle(cardValues).forEach((val) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = val;
    card.textContent = '?';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

function flipCard() {
  if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
    this.classList.add('flipped');
    this.textContent = this.dataset.value;
    flippedCards.push(this);

    if (flippedCards.length === 2) {
      setTimeout(checkMatch, 700);
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.value === card2.dataset.value) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCount += 2;
    if (matchedCount === NUM_PAIRS * 2) {
      score += 1;
      alert('Bravo! You found all pairs!');
      setupGame();
    }
  } else {
    mistakes += 1;
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '?';
    card2.textContent = '?';

    if (mistakes >= 10) {
      score = 0;
      alert('Too many mistakes! Score reset.');
      setupGame();
    }
  }
  flippedCards = [];
  updateHUD();
}

function resetGame() {
  matchedCount = 0;
  mistakes = 0;
  setupGame();
}

function setupGame() {
  // Pick random words from the big pool for this run.
  const shuffled = shuffle([...allWords]);
  const selectedForPairs = shuffled.slice(0, NUM_PAIRS);

  // Choose a loner card that is NOT one of the pair words if possible.
  const remaining = shuffled.slice(NUM_PAIRS);
  const loner =
    remaining.find((word) => !selectedForPairs.includes(word)) ??
    selectedForPairs[0];

  cardValues = [...selectedForPairs, ...selectedForPairs, loner];
  matchedCount = 0;
  mistakes = 0;
  createBoard();
  updateHUD();
}

setupGame();