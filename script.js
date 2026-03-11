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

// Base difficulty: 3x3 grid (4 pairs + 1 loner = 9 cards).
// After score reaches 3, game switches to a 3x4 grid (6 pairs = 12 cards, no loner).
const BASE_NUM_PAIRS = 4;
const ADVANCED_NUM_PAIRS = 6;

let cardValues = [];
let flippedCards = [];
let matchedCount = 0;
let mistakes = 0;
let score = 0;
let currentTargetMatches = BASE_NUM_PAIRS * 2;

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

  // Adjust grid layout based on current score.
  // Score < 3 → 3x3 (3 columns), Score >= 3 → 3x4 (4 columns).
  if (board) {
    if (score >= 3) {
      board.style.gridTemplateColumns = 'repeat(4, 100px)';
    } else {
      board.style.gridTemplateColumns = 'repeat(3, 100px)';
    }
  }

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
    if (matchedCount === currentTargetMatches) {
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
  const isAdvanced = score >= 3;
  const numPairsThisGame = isAdvanced ? ADVANCED_NUM_PAIRS : BASE_NUM_PAIRS;

  // Pick random words from the big pool for this run.
  const shuffled = shuffle([...allWords]);
  const selectedForPairs = shuffled.slice(0, numPairsThisGame);

  if (isAdvanced) {
    // 3x4 grid: 6 pairs = 12 cards, no loner.
    cardValues = [...selectedForPairs, ...selectedForPairs];
  } else {
    // 3x3 grid: 4 pairs + 1 loner = 9 cards.
    // Choose a loner card that is NOT one of the pair words if possible.
    const remaining = shuffled.slice(numPairsThisGame);
    const loner =
      remaining.find((word) => !selectedForPairs.includes(word)) ??
      selectedForPairs[0];

    cardValues = [...selectedForPairs, ...selectedForPairs, loner];
  }

  currentTargetMatches = numPairsThisGame * 2;
  matchedCount = 0;
  mistakes = 0;
  createBoard();
  updateHUD();
}

setupGame();