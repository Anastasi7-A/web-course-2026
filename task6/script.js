class SnakeModel {
    constructor() {
        this.gridSize = 20;
        this.cellSize = 20;
        this.canvasSize = 400;
        this.moveInterval = 150;
        
        this.snake = [];
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.apple = { x: 0, y: 0 };
        this.score = 0;
        this.gameOver = false;
        this.lastMoveTime = 0;
    }

    init() {
        const startX = 5;
        const startY = 10;
        
        this.snake = [
            { x: startX, y: startY },
            { x: startX - 1, y: startY },
            { x: startX - 2, y: startY }
        ];
        
        this.direction = 'RIGHT';
        this.nextDirection = 'RIGHT';
        this.score = 0;
        this.gameOver = false;
        this.lastMoveTime = 0;
        
        this.spawnApple();
    }

    update(deltaTime) {
        if (this.gameOver) return;

        this.lastMoveTime += deltaTime;

        if (this.lastMoveTime >= this.moveInterval) {
            this.lastMoveTime = 0;
            this.moveSnake();
        }
    }

    moveSnake() {
        this.direction = this.nextDirection;
        const head = { ...this.snake[0] };

        switch (this.direction) {
            case 'UP': head.y--; break;
            case 'DOWN': head.y++; break;
            case 'LEFT': head.x--; break;
            case 'RIGHT': head.x++; break;
        }

        if (this.checkCollision(head)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        if (this.checkAppleEaten(head)) {
            this.score += 1;
            this.spawnApple();
        } else {
            this.snake.pop();
        }
    }

    checkCollision(head) {
        if (head.x < 0 || head.x >= this.gridSize || 
            head.y < 0 || head.y >= this.gridSize) {
            return true;
        }

        for (let segment of this.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }

        return false;
    }

    checkAppleEaten(head) {
        return head.x === this.apple.x && head.y === this.apple.y;
    }

    spawnApple() {
        let validPosition = false;
        while (!validPosition) {
            this.apple.x = Math.floor(Math.random() * this.gridSize);
            this.apple.y = Math.floor(Math.random() * this.gridSize);
            validPosition = true;
            
            for (let segment of this.snake) {
                if (this.apple.x === segment.x && this.apple.y === segment.y) {
                    validPosition = false;
                    break;
                }
            }
        }
    }

    changeDirection(newDirection) {
        const opposites = {
            'UP': 'DOWN',
            'DOWN': 'UP',
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT'
        };

        if (opposites[newDirection] !== this.direction) {
            this.nextDirection = newDirection;
        }
    }
}

class SnakeView {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreEl = document.getElementById('score');
        this.gameOverEl = document.getElementById('gameOver');
        this.finalScoreEl = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        this.startBtn = document.getElementById('startBtn'); 
        
        this.canvas.width = 400;
        this.canvas.height = 400;
    }

    clear() {
        this.ctx.fillStyle = '#16213e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawGrid(cellSize, gridSize) {
        this.ctx.strokeStyle = '#1a1a3e';
        this.ctx.lineWidth = 0.5;
        
        for (let i = 0; i <= gridSize; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * cellSize, 0);
            this.ctx.lineTo(i * cellSize, gridSize * cellSize);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * cellSize);
            this.ctx.lineTo(gridSize * cellSize, i * cellSize);
            this.ctx.stroke();
        }
    }

    drawSnake(snake, cellSize) {
        snake.forEach((segment, index) => {
            if (index === 0) {
                this.ctx.fillStyle = '#00ff88';
                this.ctx.shadowBlur = 10;
                this.ctx.shadowColor = '#00ff88';
            } else {
                this.ctx.fillStyle = '#00cc66';
                this.ctx.shadowBlur = 0;
            }
            
            this.ctx.fillRect(
                segment.x * cellSize + 1, 
                segment.y * cellSize + 1, 
                cellSize - 2, 
                cellSize - 2
            );
        });
        this.ctx.shadowBlur = 0;
    }

    drawApple(apple, cellSize) {
        this.ctx.fillStyle = '#ff3366';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff3366';
        
        this.ctx.beginPath();
        this.ctx.arc(
            apple.x * cellSize + cellSize / 2,
            apple.y * cellSize + cellSize / 2,
            cellSize / 2 - 2,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }

    updateScore(score) {
        this.scoreEl.textContent = `Счёт: ${score}`;
    }

    showGameOver(score) {
        this.finalScoreEl.textContent = score;
        this.gameOverEl.style.display = 'flex';
    }

    hideGameOver() {
        this.gameOverEl.style.display = 'none';
    }

    showStartButton() {
        this.startBtn.style.display = 'inline-block';
    }

    hideStartButton() {
        this.startBtn.style.display = 'none';
    }

    setStartButtonText(text) {
        this.startBtn.textContent = text;
    }

    onStartClick(callback) {
        this.startBtn.addEventListener('click', callback);
    }

    onKeyInput(callback) {
        document.addEventListener('keydown', (e) => {
            const keyMap = {
                'ArrowUp': 'UP',
                'ArrowDown': 'DOWN',
                'ArrowLeft': 'LEFT',
                'ArrowRight': 'RIGHT'
            };
            
            if (keyMap[e.key]) {
                e.preventDefault();
                callback(keyMap[e.key]);
            }
        });
    }

    onRestart(callback) {
        this.restartBtn.addEventListener('click', callback);
    }
}

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