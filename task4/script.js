const state = {
    secretNumber: '',
    history: [], 
    attempts: 0,
    isGameOver: false
};

const inputEl = document.getElementById('guess-input');
const checkBtnEl = document.getElementById('check-btn');
const newGameBtnEl = document.getElementById('new-game-btn');
const attemptsCountEl = document.getElementById('attempts-count');
const messageEl = document.getElementById('message');
const historyListEl = document.getElementById('history-list');


function generateSecretNumber() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    for (let i = digits.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [digits[i], digits[j]] = [digits[j], digits[i]];
    }

    return digits.slice(0, 4).join('');
}

function validateInput(input) {

    if (!/^\d{4}$/.test(input)) {
        return 'Введите ровно 4 цифры (без букв и символов).';
    }

    const uniqueDigits = new Set(input);
    if (uniqueDigits.size !== 4) {
        return 'Все цифры должны быть уникальными.';
    }
    return null; 
}

function calculateBullsAndCows(guess, secret) {
    let bulls = 0;
    let cows = 0;
    
    for (let i = 0; i < 4; i++) {
        if (guess[i] === secret[i]) {
            bulls++;
        } else if (secret.includes(guess[i])) {
            cows++;
        }
    }
    
    return { bulls, cows };
}


function pluralize(count, one, two, five) {
    let abs = Math.abs(count) % 100;
    let n1 = abs % 10;
    if (abs > 10 && abs < 20) return five;
    if (n1 > 1 && n1 < 5) return two;
    if (n1 === 1) return one;
    return five;
}

function render() {

    attemptsCountEl.textContent = state.attempts;

    historyListEl.innerHTML = ''; 

    state.history.forEach(item => {
        const li = document.createElement('li');
        const bullWord = pluralize(item.bulls, 'бык', 'быка', 'быков');
        const cowWord = pluralize(item.cows, 'корова', 'коровы', 'коров');
        
        li.textContent = `${item.guess} - ${item.bulls} ${bullWord}, ${item.cows} ${cowWord}`;
        historyListEl.appendChild(li);
    });

    if (state.isGameOver) {
        inputEl.disabled = true;
        checkBtnEl.disabled = true;
        messageEl.className = 'message win';
        messageEl.textContent = `Победа! Угадано за ${state.attempts} ${pluralize(state.attempts, 'попытку', 'попытки', 'попыток')}.`;
    } else {
        inputEl.disabled = false;
        checkBtnEl.disabled = false;

        if (!messageEl.classList.contains('error')) {
            messageEl.textContent = '';
            messageEl.className = 'message';
        }
    }
}

function handleCheck() {
    if (state.isGameOver) return;

    const guess = inputEl.value.trim();
  
    const error = validateInput(guess);
    if (error) {
        messageEl.className = 'message error';
        messageEl.textContent = error;
        return; 
    }

    messageEl.className = 'message';
    messageEl.textContent = '';
    
    const { bulls, cows } = calculateBullsAndCows(guess, state.secretNumber);

    state.attempts++;
    state.history.push({ guess, bulls, cows });

    if (bulls === 4) {
        state.isGameOver = true;
    }

    inputEl.value = '';
    render();
}

function handleNewGame() {

    state.secretNumber = generateSecretNumber();
    state.history = [];
    state.attempts = 0;
    state.isGameOver = false;

    inputEl.value = '';
    messageEl.textContent = '';
    messageEl.className = 'message';

    render();

    inputEl.focus();
}


checkBtnEl.addEventListener('click', handleCheck);
newGameBtnEl.addEventListener('click', handleNewGame);

inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        handleCheck();
    }
});

handleNewGame();