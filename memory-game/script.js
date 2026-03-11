const words = ['мама', 'тата', 'мики', 'јаки']; // 4 pairs = 8 cards
const loner = 'таки'; // The 9th card
let cardValues = [...words, ...words, loner];
let flippedCards = [];
let matchedCount = 0;

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
    if (matchedCount === 8) alert('Bravo! You found all pairs!');
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.textContent = '?';
    card2.textContent = '?';
  }
  flippedCards = [];
}

function resetGame() {
  matchedCount = 0;
  createBoard();
}

createBoard();