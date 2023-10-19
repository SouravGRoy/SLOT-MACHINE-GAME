
const slotSymbols = [
  ['👑', '💋', '🏆', '👑', '👑', '👙', '💎', '💸', '☕️', '👙', '💎', '☕️'],
  ['🗽', '🎲', '🚨', '🚨', '🚨', '✝️', '✝️', '👙', '🏆', '💸', '💎', '💳'],
  ['🗽', '☕️', '🏆', '💸', '✝️', '🪙', '🎲', '💳', '🪙', '🪙', '🎲', '💳']
];

function createSymbolElement(symbol) {
  const div = document.createElement('div');
  div.classList.add('symbol');
  div.textContent = symbol;
  return div;
}

let currentBalance = 0;
let betAmount = 0;

function deposit() {
  const depositAmount = parseFloat(prompt('Enter the deposit amount:'));
  if (!isNaN(depositAmount) && depositAmount > 0) {
    currentBalance += depositAmount;
    updateBalanceDisplay();
    document.getElementById('betButton').disabled = false;
  } else {
    alert('Invalid deposit amount. Please enter a valid number.');
  }
}

function placeBet() {
  betAmount = parseFloat(prompt('Enter the bet amount:'));
  if (!isNaN(betAmount) && betAmount > 0 && currentBalance >= betAmount) {
    currentBalance -= betAmount;
    updateBalanceDisplay();
    document.getElementById('spinButton').disabled = false;
  } else {
    alert('Invalid bet amount. Please enter a valid number or make sure you have sufficient balance.');
  }
}

function spin() {
  const slots = document.querySelectorAll('.slot');
  let completedSlots = 0;

  slots.forEach((slot, index) => {
    const symbols = slot.querySelector('.symbols');
    const symbolHeight = symbols.querySelector('.symbol')?.clientHeight;
    const symbolCount = symbols.childElementCount;

    symbols.innerHTML = '';

    symbols.appendChild(createSymbolElement('❓'));

    for (let i = 0; i < 3; i++) {
      slotSymbols[index].forEach(symbol => {
        symbols.appendChild(createSymbolElement(symbol));
      });
    }

    const totalDistance = symbolCount * symbolHeight;
    const randomOffset = -Math.floor(Math.random() * (symbolCount - 1) + 1) * symbolHeight;
    symbols.style.top = `${randomOffset}px`;

    symbols.addEventListener('transitionend', () => {
      completedSlots++;
      if (completedSlots === slots.length) {
        checkWin();
      }
    }, { once: true });
  });
}

function checkWin() {
  const slots = document.querySelectorAll('.slot');
  const displayedSymbols = [];

  slots.forEach((slot, index) => {
    const symbols = slot.querySelector('.symbols');
    const symbolIndex = Math.floor(Math.abs(parseInt(symbols.style.top, 10)) / slot.clientHeight) % slotSymbols[index].length;
    const displayedSymbol = slotSymbols[index][symbolIndex];
    displayedSymbols.push(displayedSymbol);
  });

  const uniqueSymbols = new Set(displayedSymbols);
  if (uniqueSymbols.size === 1) {
    currentBalance += betAmount * 2;
    alert('Congratulations! You won the bet.');
  } else {
    alert('Better luck next time. Try again!');
  }

  updateBalanceDisplay();
  reset();
}

function reset() {
  const slots = document.querySelectorAll('.slot');

  slots.forEach(slot => {
    const symbols = slot.querySelector('.symbols');
    symbols.style.transition = 'none';
    symbols.style.top = '0';
    symbols.offsetHeight;
    symbols.style.transition = '';
  });
}

function updateBalanceDisplay() {
  document.getElementById('balanceDisplay').textContent = `Balance: $${currentBalance.toFixed(2)}`;
}

updateBalanceDisplay();
