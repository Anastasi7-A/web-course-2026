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