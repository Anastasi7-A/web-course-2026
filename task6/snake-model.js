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

        if(head.x < 0) head.x = this.gridSize - 1;
        if(head.x >= this.gridSize) head.x = 0;
        if(head.y < 0) head.y = this.gridSize - 1;
        if(head.y >= this.gridSize) head.y = 0;


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