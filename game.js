// Game Variables
const gameCanvas = document.getElementById('gameCanvas');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameRunning = true;
let gameSpeed = 5;

// Player object
const player = {
    x: gameCanvas.offsetWidth / 2 - 20,
    y: gameCanvas.offsetHeight - 100,
    width: 40,
    height: 40,
    velocityY: 0,
    jumping: false,
    element: null
};

// Game obstacles
let obstacles = [];
let obstacleSpeed = 3;

// Create player element
function createPlayer() {
    player.element = document.createElement('div');
    player.element.className = 'player';
    gameCanvas.appendChild(player.element);
    updatePlayerPosition();
}

// Update player position
function updatePlayerPosition() {
    if (player.element) {
        player.element.style.left = player.x + 'px';
        player.element.style.bottom = player.y + 'px';
    }
}

// Create obstacles
function createObstacle() {
    const obstacle = {
        x: gameCanvas.offsetWidth,
        y: Math.random() * (gameCanvas.offsetHeight - 100) + 50,
        width: 60,
        height: 15,
        element: null
    };

    obstacle.element = document.createElement('div');
    obstacle.element.className = 'obstacle';
    obstacle.element.style.left = obstacle.x + 'px';
    obstacle.element.style.bottom = obstacle.y + 'px';
    gameCanvas.appendChild(obstacle.element);

    obstacles.push(obstacle);
}

// Jump function
function jump() {
    if (!player.jumping) {
        player.velocityY = 15;
        player.jumping = true;
    }
}

// Gravity and movement
function applyPhysics() {
    // Gravity
    player.velocityY -= 0.6;
    player.y += player.velocityY;

    // Ground collision
    if (player.y <= 0) {
        player.y = 0;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Keep player in bounds horizontally
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > gameCanvas.offsetWidth) {
        player.x = gameCanvas.offsetWidth - player.width;
    }

    updatePlayerPosition();
}

// Check collision
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Update obstacles
function updateObstacles() {
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;
        obstacles[i].element.style.left = obstacles[i].x + 'px';

        // Check collision
        if (checkCollision(player, obstacles[i])) {
            gameOver();
            return;
        }

        // Remove obstacle if off screen
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles[i].element.remove();
            obstacles.splice(i, 1);
            score += 10;
            scoreDisplay.textContent = score;

            // Increase difficulty
            if (score % 100 === 0) {
                obstacleSpeed += 0.5;
            }
        }
    }
}

// Game over
function gameOver() {
    gameRunning = false;
    alert('Game Over! Score: ' + score + '\n\nAppuyez sur OK pour redémarrer');
    location.reload();
}

// Game loop
function gameLoop() {
    if (!gameRunning) return;

    applyPhysics();
    updateObstacles();

    requestAnimationFrame(gameLoop);
}

// Spawn obstacles
let spawnRate = 0;
function spawnObstacles() {
    if (!gameRunning) return;

    spawnRate++;
    if (spawnRate > 100) {
        createObstacle();
        spawnRate = 0;
    }

    setTimeout(spawnObstacles, 30);
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

// Touch controls for mobile
gameCanvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    jump();
});

gameCanvas.addEventListener('click', jump);

// Mouse move for aiming (optional)
gameCanvas.addEventListener('mousemove', (e) => {
    const rect = gameCanvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    if (mouseX < gameCanvas.offsetWidth / 2) {
        player.x = Math.max(0, player.x - 3);
    } else {
        player.x = Math.min(gameCanvas.offsetWidth - player.width, player.x + 3);
    }
});

// Initialize game
createPlayer();
gameLoop();
spawnObstacles();

console.log('🎮 Jeu lancé! Appuyez sur l\'écran ou la barre d\'espace pour sauter.');
