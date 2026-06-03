const display = document.getElementById('display');
const funnyMessage = document.getElementById('funnyMessage');
const buttons = document.querySelectorAll('.btn');

let expression = '0';
let history = [];

const messages = [
  'Premium math mode engaged 💎',
  'Numbers got roasted with style 😂',
  'Bhumiq history updated! 📚',
  'Calculation cooked perfectly 🍳',
  'bhumiq premium result unlocked 🌟',
  'This answer has premium vibes 💎',
  'Calculator is thinking...',
  'Math monster defeated! 🎉'
];

function updateDisplay() {
  display.value = expression;
}

function setMessage(text) {
  funnyMessage.textContent = text;
}

function randomMessage() {
  const index = Math.floor(Math.random() * messages.length);
  setMessage(messages[index]);
}

function isOperator(char) {
  return ['+', '-', '*', '/'].includes(char);
}

function addValue(value) {
  const lastChar = expression.slice(-1);

  if (expression === 'Error') expression = '0';

  if (expression === '0' && value !== '.') {
    expression = value;
  } else if (value === '.' && expression.split(/[-+*/]/).pop().includes('.')) {
    setMessage('One dot is enough, topper! 😎');
    return;
  } else if (isOperator(value) && isOperator(lastChar)) {
    expression = expression.slice(0, -1) + value;
  } else {
    expression += value;
  }

  setMessage('Calculator is thinking...');
  updateDisplay();
}

function clearAll() {
  expression = '0';
  setMessage('Fresh start! Old math deleted 🧹');
  updateDisplay();
}

function backspace() {
  expression = expression.length > 1 ? expression.slice(0, -1) : '0';
  setMessage('Oopsie digit removed! ⌫');
  updateDisplay();
}

function calculate() {
  try {
    if (/[^0-9+\-*/.]/.test(expression)) throw new Error('Invalid');
    if (isOperator(expression.slice(-1))) expression = expression.slice(0, -1);

    const result = Function(`'use strict'; return (${expression})`)();

    if (!Number.isFinite(result)) {
      expression = 'Error';
      setMessage('Division by zero? Math said NOPE 🚫');
    } else {
      const formattedResult = Number.isInteger(result) ? String(result) : String(Number(result.toFixed(8)));
      addHistory(`${expression} = ${formattedResult}`);
      expression = formattedResult;
      randomMessage();
      burstSparkles();
    }
  } catch (error) {
    expression = 'Error';
    setMessage('Math goblin confused me 😵');
  }

  updateDisplay();
}

function addHistory(entry) {
  history.unshift(entry);
  if (history.length > 6) history.pop();
  renderHistory();
}

function renderHistory() {
  const historyList = document.getElementById('historyList');
  historyList.innerHTML = history.length === 0
    ? '<p class="history-empty">No history yet. Calculate to save entries here.</p>'
    : history.map(item => `<div class="history-item">${item}</div>`).join('');
}

function clearHistory() {
  history = [];
  renderHistory();
  setMessage('History cleared. Fresh start! 🧹');
}

function copyResult() {
  if (expression === 'Error') {
    setMessage('Nothing useful to copy yet. 🤔');
    return;
  }

  navigator.clipboard.writeText(expression)
    .then(() => setMessage('Result copied to clipboard! 📋'))
    .catch(() => setMessage('Copy failed. Try again! ⚠️'));
}

function burstSparkles() {
  for (let i = 0; i < 18; i++) {
    const sparkle = document.createElement('span');
    sparkle.className = 'sparkle-pop';
    sparkle.textContent = ['✨', '💫', '🎉', '⭐'][Math.floor(Math.random() * 4)];
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.animationDelay = `${Math.random() * 0.25}s`;
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }
}

const sparkleStyle = document.createElement('style');
sparkleStyle.textContent = `
  .sparkle-pop {
    position: fixed;
    z-index: 99;
    pointer-events: none;
    font-size: 1.8rem;
    animation: popSparkle 0.9s ease-out forwards;
  }

  @keyframes popSparkle {
    0% { transform: scale(0) rotate(0deg); opacity: 0; }
    35% { opacity: 1; }
    100% { transform: translateY(-80px) scale(1.5) rotate(180deg); opacity: 0; }
  }
`;
document.head.appendChild(sparkleStyle);

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.dataset.value;
    const action = button.dataset.action;

    if (value) addValue(value);
    if (action === 'clear') clearAll();
    if (action === 'backspace') backspace();
    if (action === 'equal') calculate();
    if (action === 'copy') copyResult();
    if (action === 'clear-history') clearHistory();
  });
});

document.addEventListener('keydown', event => {
  const key = event.key;

  if (/^[0-9.+\-*/]$/.test(key)) addValue(key);
  if (key === 'Enter') calculate();
  if (key === 'Backspace') backspace();
  if (key === 'Escape') clearAll();
  if (key.toLowerCase() === 'c') copyResult();
});

updateDisplay();
