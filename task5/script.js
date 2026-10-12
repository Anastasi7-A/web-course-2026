class GameModel {
    constructor() {
        this.sequence = [];
        this.playerInput = [];
        this.level = 0;
        this.state = 'IDLE';
    }

    startGame() {
        this.sequence = [];
        this.playerInput = [];
        this.level = 0;
        this.state = 'IDLE';
        this.nextRound();
    }

    nextRound() {
        this.level++;
        this.playerInput = [];
        const randomIndex = Math.floor(Math.random() * 4);
        this.sequence.push(randomIndex);
        this.state = 'SHOWING';
    }

    handlePlayerClick(index) {
        if (this.state !== 'WAITING_INPUT') {
            return { status: 'IGNORED' };
        }

        this.playerInput.push(index);
        const stepIndex = this.playerInput.length - 1;

        if (this.playerInput[stepIndex] !== this.sequence[stepIndex]) {
            this.state = 'GAME_OVER';
            return { status: 'GAME_OVER' };
        }

        if (this.playerInput.length === this.sequence.length) {
            return { status: 'ROUND_COMPLETE' };
        }

        return { status: 'CORRECT_STEP' };
    }
}

class GameView {
    constructor() {
        this.levelEl   = document.getElementById('level-display');
        this.messageEl = document.getElementById('message-display');
        this.startBtn  = document.getElementById('start-btn');
        this.buttons   = document.querySelectorAll('.btn');

        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.frequencies = [329.63, 261.63, 220.00, 164.81]; // Ми, До, Ля, Ми
    }

    updateLevel(level) {
        this.levelEl.textContent = `Уровень: ${level}`;
    }

    showMessage(text) {
        this.messageEl.textContent = text;
    }

    clearMessage() {
        this.messageEl.textContent = '';
    }

    setBoardDisabled(isDisabled) {
        this.buttons.forEach(btn => btn.disabled = isDisabled);
    }

    setStartBtnDisabled(isDisabled) {
        this.startBtn.disabled = isDisabled;
    }

    setStartBtnText(text) {
        this.startBtn.textContent = text;
    }

    highlightButton(index) {
        this.buttons[index].classList.add('active');
        this.playSound(index);
    }

    unhighlightButton(index) {
        this.buttons[index].classList.remove('active');
    }

    playSound(index) {
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const osc  = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.frequency.value = this.frequencies[index];
        osc.type = 'sine';

        gain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);

        osc.start(this.audioCtx.currentTime);
        osc.stop(this.audioCtx.currentTime + 0.4);
    }

    onButtonClick(callback) {
        this.buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index, 10);
                callback(index);
            });
        });
    }

    onStartClick(callback) {
        this.startBtn.addEventListener('click', callback);
    }
}

class GameController {
    constructor(model, view) {
        this.model = model;
        this.view  = view;
        this.playId = 0;

        this.initEvents();
    }

    initEvents() {
        this.view.onStartClick(() => this.startGame());
        this.view.onButtonClick((index) => this.handlePlayerInput(index));
    }

    async startGame() {
        this.model.startGame();
        this.view.updateLevel(this.model.level);
        this.view.clearMessage();

        this.view.setBoardDisabled(true);
        this.view.setStartBtnDisabled(true);
        this.view.setStartBtnText('Старт');

        await this.playSequence();
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async playSequence() {

        this.playId++;
        const currentPlayId = this.playId;

        for (let i = 0; i < this.model.sequence.length; i++) {
            if (this.playId !== currentPlayId) return;

            const btnIndex = this.model.sequence[i];

            this.view.highlightButton(btnIndex);
            await this.sleep(500);

            if (this.playId !== currentPlayId) return;

            this.view.unhighlightButton(btnIndex);
            await this.sleep(250);
        }

        if (this.playId === currentPlayId) {
            this.model.state = 'WAITING_INPUT';
            this.view.setBoardDisabled(false);
        }
    }

    handlePlayerInput(index) {

        if (this.model.state !== 'WAITING_INPUT') return;

        this.view.highlightButton(index);
        setTimeout(() => this.view.unhighlightButton(index), 300);

        const result = this.model.handlePlayerClick(index);

        if (result.status === 'GAME_OVER') {
            this.view.showMessage(`Игра окончена! Вы дошли до уровня ${this.model.level}`);
            this.view.setBoardDisabled(true);
            this.view.setStartBtnDisabled(false);
            this.view.setStartBtnText('Заново');
        }
        else if (result.status === 'ROUND_COMPLETE') {
            this.view.setBoardDisabled(true);
            this.model.nextRound();
            this.view.updateLevel(this.model.level);

            setTimeout(() => this.playSequence(), 800);
        }

    }
}

document.addEventListener('DOMContentLoaded', () => {
    const model      = new GameModel();
    const view       = new GameView();
    const controller = new GameController(model, view);

    // Начальное состояние UI
    view.setBoardDisabled(true);
    view.setStartBtnDisabled(false);
    view.setStartBtnText('Старт');
});