const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('startBtn');
const restartBtn = document.getElementById('restartBtn');
const gameStatus = document.getElementById('game-status');

// Set canvas to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const GRAVITY = 0.8;
const INITIAL_JUMP_FORCE = -10;
const BOOST_FORCE = -0.6;
const HORIZONTAL_BOOST = 0.15;
const GROUND_Y = () => canvas.height - 100;
const PLAYER_SIZE = 40;
const STONE_WIDTH = 30;
const STONE_HEIGHT = 30;
const INITIAL_SPEED = 3;
const WOLF_DELAY = 3000;
const PREGAME_DELAY = 3000; // 3 seconds delay before game starts
const POSITION_STEP = 50; // Distance to move on stone hit
const MIN_WOLF_DISTANCE = 50; // Minimum distance to catch rabbit

let gameState = 'idle';
let gameSpeed = INITIAL_SPEED;
let frameCount = 0;
let wolfStartTime = 0;
let gameStartTime = 0;

// Match scoring
let rabbitWins = 0;
let wolfWins = 0;
const MATCH_WIN_SCORE = 10;
let totalWins = 0;
const SPEED_INCREASE_PER_WIN = 0.3;

// Settings
let gameSettings = {
    maxJumpHeight: 203,
    boostForce: 0.4,
    horizontalBoost: 0.15,
    playerPosition: 40
};

// Sprite canvases
let rabbitSpriteCanvas = null;
let wolfSpriteCanvas = null;
let rabbitDeadSpriteCanvas = null;
let wolfDeadSpriteCanvas = null;
let stoneSpriteCanvas = null;
let groundTextureCanvas = null;
let groundOffset = 0;

// Cloud system
let clouds = [];
let cloudsInitialized = false;

class Player {
    constructor(x, y, color, name) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.name = name;
        this.width = this.name === 'Вовк' ? 70 : 50;
        this.height = 50;
        this.velocityY = 0;
        this.isJumping = false;
        this.score = 0;
        this.isActive = false;
        this.isDead = false;
        this.animationFrame = 0;
        this.animationSpeed = 0.2;
        this.hitCooldown = 0; // Cooldown after hitting stone
        this.isBoosting = false;
        this.velocityX = 0;
    }

    startJump() {
        if (!this.isJumping && this.isActive && !this.isDead) {
            this.velocityY = INITIAL_JUMP_FORCE;
            this.velocityX = 0;
            this.isJumping = true;
            this.isBoosting = true;
        }
    }
    
    stopBoosting() {
        this.isBoosting = false;
    }

    update() {
        if (!this.isActive || this.isDead) return;

        if (this.isJumping) {
            // Apply boost while key is held
            if (this.isBoosting) {
                this.velocityY += -gameSettings.boostForce;
                this.velocityX += gameSettings.horizontalBoost;
            }
            
            // Limit maximum height
            const maxHeight = GROUND_Y() - gameSettings.maxJumpHeight;
            if (this.y < maxHeight) {
                this.y = maxHeight;
                this.velocityY = Math.max(this.velocityY, 0);
            }
            
            this.velocityY += GRAVITY;
            this.y += this.velocityY;
            this.x += this.velocityX;
            
            // Apply horizontal drag
            this.velocityX *= 0.98;

            if (this.y >= GROUND_Y() - this.height) {
                this.y = GROUND_Y() - this.height;
                this.velocityY = 0;
                this.velocityX = 0;
                this.isJumping = false;
                this.isBoosting = false;
            }
        }

        // Update animation frame
        if (!this.isJumping && !this.isDead) {
            this.animationFrame += this.animationSpeed;
            if (this.animationFrame >= 4) {
                this.animationFrame = 0;
            }
        }

        if (gameState === 'playing') {
            this.score = Math.floor((Date.now() - (this.name === 'Вовк' ? wolfStartTime : gameStartTime)) / 100);
        }
    }

    draw() {
        if (!this.isActive) return;

        // Apply death effect if dead - tint the sprite red with 50% opacity
        if (this.isDead) {
            ctx.globalAlpha = 0.5;
        }
        // Apply hit effect (blinking) - only if not dead
        else if (this.hitCooldown > 0) {
            const alpha = Math.sin(Date.now() * 0.02) * 0.5 + 0.5; // Oscillate between 0 and 1
            ctx.globalAlpha = alpha;
        }

        // Draw sprite if available
        let spriteCanvas;
        if (this.isDead) {
            // Use red/dead version of sprites
            spriteCanvas = this.name === 'Заєць' ? rabbitDeadSpriteCanvas : wolfDeadSpriteCanvas;
        } else {
            spriteCanvas = this.name === 'Заєць' ? rabbitSpriteCanvas : wolfSpriteCanvas;
        }
        
        if (spriteCanvas) {
            // Calculate which frame to draw
            const frameIndex = Math.floor(this.animationFrame);
            const sourceX = frameIndex * (this.name === 'Вовк' ? 70 : 50);
            const sourceY = 0;
            const sourceWidth = this.name === 'Вовк' ? 70 : 50;
            const sourceHeight = 50;
            
            // Draw the sprite
            ctx.drawImage(
                spriteCanvas,
                sourceX, sourceY, sourceWidth, sourceHeight,
                this.x, this.y, this.width, this.height
            );
        } else {
            // Fallback to simple rectangles if sprites not loaded
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        
        // Reset alpha
        ctx.globalAlpha = 1.0;
        
        // Draw name above character
        ctx.fillStyle = this.isDead ? 'red' : 'white';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(this.name, this.x + this.width / 2, this.y - 10);
    }

    checkCollision(stone) {
        if (!this.isActive || this.isDead) return false;
        
        // Reduce collision area by adding margin
        const margin = 10;
        return this.x + margin < stone.x + stone.width - margin &&
               this.x + this.width - margin > stone.x + margin &&
               this.y + margin < stone.y + stone.height - margin &&
               this.y + this.height - margin > stone.y + margin;
    }
}

class Stone {
    constructor(x) {
        this.x = x;
        this.y = GROUND_Y() - 40; // More visible above ground
        this.width = 75;
        this.height = 75;
        this.passed = false;
        this.variant = Math.floor(Math.random() * 5); // Random stone variant (0-4)
        this.hitByRabbit = false;
        this.hitByWolf = false;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw() {
        if (stoneSpriteCanvas) {
            // Draw sprite stone
            const sourceX = this.variant * 75;
            const sourceY = 0;
            const sourceWidth = 75;
            const sourceHeight = 75;
            
            ctx.drawImage(
                stoneSpriteCanvas,
                sourceX, sourceY, sourceWidth, sourceHeight,
                this.x, this.y, this.width, this.height
            );
        } else {
            // Fallback to simple rectangle
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(this.x, this.y, this.width, this.height);
            
            ctx.strokeStyle = '#654321';
            ctx.lineWidth = 2;
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
}

const rabbit = new Player(500, GROUND_Y() - 50, '#90EE90', 'Заєць');
const wolf = new Player(200, GROUND_Y() - 50, '#FFB6C1', 'Вовк');

let stones = [];
let nextStoneDistance = 150;

function generateStone() {
    const lastStone = stones[stones.length - 1];
    const minDistance = Math.max(150 - frameCount / 100, 80);
    const maxDistance = Math.max(300 - frameCount / 50, 150);
    
    if (!lastStone || canvas.width - lastStone.x > nextStoneDistance) {
        stones.push(new Stone(canvas.width));
        nextStoneDistance = minDistance + Math.random() * (maxDistance - minDistance);
    }
}

function drawBackground() {
    // Sky gradient (blue only, no green)
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(1, '#B0E0E6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Textured Ground
    if (groundTextureCanvas) {
        const groundHeight = canvas.height - GROUND_Y();
        const textureWidth = groundTextureCanvas.width;
        const textureHeight = groundTextureCanvas.height;
        
        // Update ground offset for scrolling effect
        if (gameState === 'playing') {
            groundOffset += gameSpeed;
            if (groundOffset >= textureWidth) {
                groundOffset = 0;
            }
        }
        
        // Draw repeating ground texture
        const startX = -groundOffset;
        const tilesNeeded = Math.ceil((canvas.width + textureWidth) / textureWidth);
        
        for (let i = 0; i < tilesNeeded; i++) {
            const x = startX + i * textureWidth;
            ctx.drawImage(
                groundTextureCanvas,
                0, 0, textureWidth, textureHeight,
                x, GROUND_Y(), textureWidth, groundHeight
            );
        }
    } else {
        // Fallback solid ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, GROUND_Y(), canvas.width, canvas.height - GROUND_Y());
    }
    
    // Draw clouds
    drawClouds();
}

function updateGame() {
    if (gameState !== 'playing') return;

    frameCount++;
    
    const currentTime = Date.now();
    if (!wolf.isActive && currentTime - gameStartTime >= WOLF_DELAY) {
        wolf.isActive = true;
        wolfStartTime = currentTime;
        gameStatus.textContent = 'Ну заяц!!!';
        setTimeout(() => {
            if (gameState === 'playing') {
                gameStatus.textContent = '';
            }
        }, 2000);
    }

    if (frameCount % 10 === 0 && gameSpeed < 8 + totalWins * SPEED_INCREASE_PER_WIN) {
        gameSpeed += 0.02;
    }

    generateStone();

    stones = stones.filter(stone => stone.x > -stone.width);
    stones.forEach(stone => {
        stone.update();
        
        // Handle rabbit collision with stone
        if (rabbit.checkCollision(stone) && !stone.hitByRabbit && rabbit.hitCooldown <= 0) {
            stone.hitByRabbit = true;
            rabbit.hitCooldown = 30; // Cooldown frames
            
            // Move rabbit back (closer to wolf)
            rabbit.x = Math.max(rabbit.x - POSITION_STEP, wolf.x + MIN_WOLF_DISTANCE);
        }
        
        // Handle wolf collision with stone
        if (wolf.checkCollision(stone) && !stone.hitByWolf && wolf.hitCooldown <= 0 && wolf.isActive) {
            stone.hitByWolf = true;
            wolf.hitCooldown = 30; // Cooldown frames
            
            // Move wolf farther from rabbit
            wolf.x = wolf.x - POSITION_STEP;
        }
    });
    
    // Update hit cooldowns
    if (rabbit.hitCooldown > 0) rabbit.hitCooldown--;
    if (wolf.hitCooldown > 0) wolf.hitCooldown--;

    rabbit.update();
    wolf.update();
    
    // Check win conditions
    if (wolf.isActive) {
        // Wolf catches rabbit
        if (wolf.x + wolf.width >= rabbit.x) {
            rabbit.isDead = true;
            gameStatus.textContent = 'Вовк зʼїв зайця! Вовк переміг!';
            endGame();
        }
        
        // Wolf falls too far behind (off screen)
        if (wolf.x < 0) {
            gameStatus.textContent = 'Заєць втік! Вовк програв!';
            endGame();
        }
    }
    
    // Rabbit reaches the right edge
    if (rabbit.x >= canvas.width - rabbit.width - 50) {
        gameStatus.textContent = 'Заєць переміг! Добіг до фінішу!';
        endGame();
    }
    
}

function initializeClouds() {
    clouds = [];
    for (let i = 0; i < 20; i++) {
        const cloud = {
            x: Math.random() * (canvas.width + 400) - 200,
            y: Math.random() * canvas.height * 0.5 + 40,
            speed: 0.1 + Math.random() * 0.3,
            baseSize: 20 + Math.random() * 30,
            opacity: 0.85 + Math.random() * 0.15,
            puffs: []
        };
        
        // Generate realistic cloud puffs
        const numPuffs = 5 + Math.floor(Math.random() * 8);
        for (let j = 0; j < numPuffs; j++) {
            cloud.puffs.push({
                offsetX: (Math.random() - 0.5) * cloud.baseSize * 2,
                offsetY: (Math.random() - 0.5) * cloud.baseSize * 0.8,
                size: cloud.baseSize * (0.6 + Math.random() * 0.8),
                alpha: 0.7 + Math.random() * 0.3
            });
        }
        
        clouds.push(cloud);
    }
    cloudsInitialized = true;
}

function drawClouds() {
    if (!cloudsInitialized) {
        initializeClouds();
    }
    
    for (let cloud of clouds) {
        // Update cloud position
        if (gameState === 'playing') {
            cloud.x -= cloud.speed * gameSpeed;
            
            // Reset cloud when it goes off screen
            if (cloud.x < -200) {
                cloud.x = canvas.width + 100 + Math.random() * 200;
                cloud.y = Math.random() * canvas.height * 0.5 + 40;
            }
        }
        
        // Draw realistic cloud using gradient and soft edges
        const gradient = ctx.createRadialGradient(
            cloud.x, cloud.y, 0,
            cloud.x, cloud.y, cloud.baseSize * 2
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(248, 248, 255, 0.9)');
        gradient.addColorStop(0.7, 'rgba(240, 248, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(230, 240, 255, 0.1)');
        
        ctx.globalAlpha = cloud.opacity;
        
        // Draw each puff with soft blending
        for (let puff of cloud.puffs) {
            const puffX = cloud.x + puff.offsetX;
            const puffY = cloud.y + puff.offsetY;
            
            // Create soft circular gradient for each puff
            const puffGradient = ctx.createRadialGradient(
                puffX, puffY, 0,
                puffX, puffY, puff.size
            );
            puffGradient.addColorStop(0, `rgba(255, 255, 255, ${puff.alpha})`);
            puffGradient.addColorStop(0.5, `rgba(248, 248, 255, ${puff.alpha * 0.8})`);
            puffGradient.addColorStop(0.8, `rgba(240, 248, 255, ${puff.alpha * 0.4})`);
            puffGradient.addColorStop(1, 'rgba(230, 240, 255, 0)');
            
            ctx.fillStyle = puffGradient;
            ctx.beginPath();
            ctx.arc(puffX, puffY, puff.size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Add subtle highlight on top
        const highlightGradient = ctx.createRadialGradient(
            cloud.x - cloud.baseSize * 0.3, cloud.y - cloud.baseSize * 0.3, 0,
            cloud.x - cloud.baseSize * 0.3, cloud.y - cloud.baseSize * 0.3, cloud.baseSize * 0.8
        );
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = highlightGradient;
        ctx.beginPath();
        ctx.arc(cloud.x - cloud.baseSize * 0.3, cloud.y - cloud.baseSize * 0.3, cloud.baseSize * 0.8, 0, Math.PI * 2);
        ctx.fill();
        
        // Add subtle shadow on bottom
        const shadowGradient = ctx.createRadialGradient(
            cloud.x + cloud.baseSize * 0.2, cloud.y + cloud.baseSize * 0.4, 0,
            cloud.x + cloud.baseSize * 0.2, cloud.y + cloud.baseSize * 0.4, cloud.baseSize * 0.6
        );
        shadowGradient.addColorStop(0, 'rgba(200, 220, 240, 0.3)');
        shadowGradient.addColorStop(1, 'rgba(200, 220, 240, 0)');
        
        ctx.fillStyle = shadowGradient;
        ctx.beginPath();
        ctx.arc(cloud.x + cloud.baseSize * 0.2, cloud.y + cloud.baseSize * 0.4, cloud.baseSize * 0.6, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.globalAlpha = 1;
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    
    stones.forEach(stone => stone.draw());
    
    rabbit.draw();
    wolf.draw();
    
    
    
}

function gameLoop() {
    updateGame();
    drawGame();
    
    if (gameState !== 'gameover') {
        requestAnimationFrame(gameLoop);
    }
}

function startGame() {
    gameState = 'countdown';
    gameSpeed = INITIAL_SPEED + totalWins * SPEED_INCREASE_PER_WIN;
    frameCount = 0;
    stones = [];
    nextStoneDistance = 150;
    
    const basePosition = canvas.width * (gameSettings.playerPosition / 100);
    rabbit.x = basePosition + 300;
    rabbit.y = GROUND_Y() - 50;
    rabbit.velocityY = 0;
    rabbit.isJumping = false;
    rabbit.score = 0;
    rabbit.isActive = true;
    rabbit.isDead = false;
    rabbit.animationFrame = 0;
    rabbit.hitCooldown = 0;
    rabbit.velocityX = 0;
    rabbit.isBoosting = false;
    
    wolf.x = basePosition;
    wolf.y = GROUND_Y() - 50;
    wolf.velocityY = 0;
    wolf.isJumping = false;
    wolf.score = 0;
    wolf.isActive = false;
    wolf.isDead = false;
    wolf.animationFrame = 0;
    wolf.hitCooldown = 0;
    wolf.velocityX = 0;
    wolf.isBoosting = false;
    
    gameStartTime = Date.now();
    
    startBtn.style.display = 'none';
    restartBtn.style.display = 'none';
    
    // Hide controls info when game starts
    const controlsInfo = document.querySelector('.controls-info');
    if (controlsInfo) {
        controlsInfo.style.display = 'none';
    }
    
    // Show countdown
    let countdown = 3;
    gameStatus.textContent = countdown;
    
    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdown > 0) {
            gameStatus.textContent = countdown;
        } else {
            clearInterval(countdownInterval);
            gameState = 'playing';
            gameStatus.textContent = '';
        }
    }, 1000);
    
    gameLoop();
}

function endGame() {
    gameState = 'gameover';
    
    // Determine winner and update match score
    let winner = '';
    if (gameStatus.textContent.includes('Вовк зʼїв зайця') || gameStatus.textContent.includes('Вовк переміг')) {
        wolfWins++;
        totalWins++;
        winner = 'Вовк';
    } else if (gameStatus.textContent.includes('Заєць переміг') || gameStatus.textContent.includes('Заєць втік')) {
        rabbitWins++;
        totalWins++;
        winner = 'Заєць';
    }
    
    // Update match score display
    updateMatchScore();
    
    // Check for match winner
    if (rabbitWins >= MATCH_WIN_SCORE) {
        gameStatus.textContent = `🏆 ЗАЄЦЬ ВИГРАВ МАТЧ! (${rabbitWins}:${wolfWins})`;
        setTimeout(() => {
            resetMatch();
        }, 3000);
    } else if (wolfWins >= MATCH_WIN_SCORE) {
        gameStatus.textContent = `🏆 ВОВК ВИГРАВ МАТЧ! (${wolfWins}:${rabbitWins})`;
        setTimeout(() => {
            resetMatch();
        }, 3000);
    } else {
        // Continue match - show next game button
        restartBtn.style.display = 'inline-block';
        restartBtn.textContent = 'Наступна гра';
    }
    
    // Show controls info again when game ends
    const controlsInfo = document.querySelector('.controls-info');
    if (controlsInfo) {
        controlsInfo.style.display = 'flex';
    }
}

function updateMatchScore() {
    const rabbitScoreEl = document.getElementById('rabbit-match-score');
    const wolfScoreEl = document.getElementById('wolf-match-score');
    
    if (rabbitScoreEl) rabbitScoreEl.textContent = rabbitWins;
    if (wolfScoreEl) wolfScoreEl.textContent = wolfWins;
    
    // Update speed indicator
    updateSpeedIndicator();
}

function updateSpeedIndicator() {
    const speedIndicator = document.getElementById('speed-indicator');
    if (speedIndicator && totalWins > 0) {
        const speedMultiplier = (1 + totalWins * SPEED_INCREASE_PER_WIN / INITIAL_SPEED).toFixed(1);
        speedIndicator.textContent = `⚡ x${speedMultiplier}`;
        speedIndicator.style.display = 'block';
    } else if (speedIndicator) {
        speedIndicator.style.display = 'none';
    }
}

function resetMatch() {
    rabbitWins = 0;
    wolfWins = 0;
    totalWins = 0;
    updateMatchScore();
    gameStatus.textContent = '';
    restartBtn.style.display = 'inline-block';
    restartBtn.textContent = 'Почати новий матч';
}

// Track key states
const keysPressed = {};

document.addEventListener('keydown', (e) => {
    // Start or restart game with Space
    if ((gameState === 'idle' || gameState === 'gameover') && e.code === 'Space') {
        e.preventDefault();
        startGame();
        return;
    }
    
    if (gameState !== 'playing') return;
    
    // Prevent key repeat
    if (keysPressed[e.code]) return;
    keysPressed[e.code] = true;
    
    if (e.code === 'Space') {
        e.preventDefault();
        rabbit.startJump();
    } else if (e.code === 'KeyA' || e.code === 'KeyF') {
        e.preventDefault();
        wolf.startJump();
    }
});

document.addEventListener('keyup', (e) => {
    keysPressed[e.code] = false;
    
    if (gameState !== 'playing') return;
    
    if (e.code === 'Space') {
        e.preventDefault();
        rabbit.stopBoosting();
    } else if (e.code === 'KeyA' || e.code === 'KeyF') {
        e.preventDefault();
        wolf.stopBoosting();
    }
});

// Settings functionality
const settingsBtn = document.getElementById('settingsBtn');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettingsBtn = document.getElementById('closeSettings');
const resetSettingsBtn = document.getElementById('resetSettings');

function loadSettings() {
    const saved = localStorage.getItem('gameSettings');
    if (saved) {
        gameSettings = { ...gameSettings, ...JSON.parse(saved) };
    }
    updateSettingsUI();
}

function saveSettings() {
    localStorage.setItem('gameSettings', JSON.stringify(gameSettings));
}

function updateSettingsUI() {
    document.getElementById('maxJumpHeight').value = gameSettings.maxJumpHeight;
    document.getElementById('maxJumpValue').textContent = gameSettings.maxJumpHeight + 'px';
    
    document.getElementById('jumpBoostPower').value = gameSettings.boostForce;
    document.getElementById('jumpBoostValue').textContent = gameSettings.boostForce;
    
    document.getElementById('jumpDistance').value = gameSettings.horizontalBoost;
    document.getElementById('jumpDistanceValue').textContent = gameSettings.horizontalBoost;
    
    document.getElementById('playerPosition').value = gameSettings.playerPosition;
    document.getElementById('playerPositionValue').textContent = gameSettings.playerPosition + '%';
}

function resetSettings() {
    gameSettings = {
        maxJumpHeight: 203,
        boostForce: 0.4,
        horizontalBoost: 0.15,
        playerPosition: 40
    };
    updateSettingsUI();
    saveSettings();
}

settingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'flex';
});

closeSettingsBtn.addEventListener('click', () => {
    settingsPanel.style.display = 'none';
});

resetSettingsBtn.addEventListener('click', resetSettings);

// Settings sliders
document.getElementById('maxJumpHeight').addEventListener('input', (e) => {
    gameSettings.maxJumpHeight = parseInt(e.target.value);
    document.getElementById('maxJumpValue').textContent = e.target.value + 'px';
    saveSettings();
});

document.getElementById('jumpBoostPower').addEventListener('input', (e) => {
    gameSettings.boostForce = parseFloat(e.target.value);
    document.getElementById('jumpBoostValue').textContent = e.target.value;
    saveSettings();
});

document.getElementById('jumpDistance').addEventListener('input', (e) => {
    gameSettings.horizontalBoost = parseFloat(e.target.value);
    document.getElementById('jumpDistanceValue').textContent = e.target.value;
    saveSettings();
});

document.getElementById('playerPosition').addEventListener('input', (e) => {
    gameSettings.playerPosition = parseInt(e.target.value);
    document.getElementById('playerPositionValue').textContent = e.target.value + '%';
    saveSettings();
});

// Close settings when clicking outside
settingsPanel.addEventListener('click', (e) => {
    if (e.target === settingsPanel) {
        settingsPanel.style.display = 'none';
    }
});

startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', startGame);

// Initialize sprites
window.addEventListener('load', () => {
    if (typeof createRabbitSprite === 'function') {
        rabbitSpriteCanvas = createRabbitSprite();
    }
    if (typeof createWolfSprite === 'function') {
        wolfSpriteCanvas = createWolfSprite();
    }
    if (typeof createRabbitDeadSprite === 'function') {
        rabbitDeadSpriteCanvas = createRabbitDeadSprite();
    }
    if (typeof createWolfDeadSprite === 'function') {
        wolfDeadSpriteCanvas = createWolfDeadSprite();
    }
    if (typeof createStoneSprites === 'function') {
        stoneSpriteCanvas = createStoneSprites();
    }
    if (typeof createGroundTexture === 'function') {
        groundTextureCanvas = createGroundTexture();
    }
    loadSettings();
    updateMatchScore();
    drawBackground();
});

drawBackground();