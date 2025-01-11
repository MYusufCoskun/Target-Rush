class Target {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = (Math.random() - 0.5) * 4;
        this.dy = (Math.random() - 0.5) * 4;
        this.color = `hsl(${Math.random() * 360}, 70%, 50%)`;
    }

    update(canvas) {
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) this.dx = -this.dx;
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) this.dy = -this.dy;
        
        this.x += this.dx;
        this.y += this.dy;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    isClicked(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance <= this.radius;
    }
}

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.score = 0;
        this.timeLeft = 30;
        this.targets = [];
        this.gameActive = false;
        this.scoreElement = document.getElementById('score');
        this.timerElement = document.getElementById('timer');
        this.startButton = document.getElementById('startButton');

        this.startButton.addEventListener('click', () => this.startGame());
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        this.animate = this.animate.bind(this);
    }

    startGame() {
        this.score = 0;
        this.timeLeft = 30;
        this.targets = [];
        this.gameActive = true;
        this.updateScore();
        this.startButton.disabled = true;

        // Create initial targets
        for (let i = 0; i < 5; i++) {
            this.addTarget();
        }

        // Start the timer
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.timerElement.textContent = `Time: ${this.timeLeft}s`;
            
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);

        // Start the animation
        requestAnimationFrame(this.animate);
    }

    endGame() {
        this.gameActive = false;
        clearInterval(this.timer);
        this.targets = [];
        this.startButton.disabled = false;
        alert(`Game Over! Final Score: ${this.score}`);
    }

    addTarget() {
        const radius = 15 + Math.random() * 15;
        const x = radius + Math.random() * (this.canvas.width - 2 * radius);
        const y = radius + Math.random() * (this.canvas.height - 2 * radius);
        this.targets.push(new Target(x, y, radius));
    }

    handleClick(e) {
        if (!this.gameActive) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        for (let i = this.targets.length - 1; i >= 0; i--) {
            if (this.targets[i].isClicked(x, y)) {
                this.targets.splice(i, 1);
                this.score += 10;
                this.updateScore();
                this.addTarget();
                break;
            }
        }
    }

    updateScore() {
        this.scoreElement.textContent = `Score: ${this.score}`;
    }

    animate() {
        if (!this.gameActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.targets.forEach(target => {
            target.update(this.canvas);
            target.draw(this.ctx);
        });

        requestAnimationFrame(this.animate);
    }
}

// Initialize the game
const game = new Game();