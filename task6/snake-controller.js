class SnakeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.lastTime = 0;
        this.animationId = null;
        this.isRunning = false;
    }

    init() {
        this.view.hideGameOver();
        this.view.showStartButton();
        this.view.setStartButtonText('Начать игру');
        this.view.updateScore(0);
        this.view.clear();
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.view.onStartClick(() => this.startGame());
        this.view.onRestart(() => this.startGame());

        this.view.onKeyInput((direction) => {
            if (this.isRunning && !this.model.gameOver) {
                this.model.changeDirection(direction);
            }
        });
    }

    startGame() {
        this.model.init();
        this.isRunning = true;
        
        this.view.hideStartButton();
        this.view.hideGameOver();
        this.view.updateScore(this.model.score);
        
        this.lastTime = performance.now();
        this.gameLoop(this.lastTime);
    }

    gameLoop(timestamp) {
        if (!this.isRunning) return;

        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.model.update(deltaTime);
        this.render();

        if (!this.model.gameOver) {
            this.animationId = requestAnimationFrame((ts) => this.gameLoop(ts));
        } else {
            this.isRunning = false;
            this.view.showGameOver(this.model.score);
            this.view.showStartButton();
            this.view.setStartButtonText('Начать заново');
        }
    }

    render() {
        this.view.clear();
        this.view.drawGrid(this.model.cellSize, this.model.gridSize);
        this.view.drawSnake(this.model.snake, this.model.cellSize);
        this.view.drawApple(this.model.apple, this.model.cellSize);
        this.view.updateScore(this.model.score);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const model = new SnakeModel();
    const view = new SnakeView();
    const controller = new SnakeController(model, view);

    controller.init();
});