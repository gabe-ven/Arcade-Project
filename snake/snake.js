// DOM elements grouped together
const snakeElements = {
  startText: document.getElementById("snakeStartText"),
  gameArea: document.querySelector("#snake-page .gameArea"),
  scoreElement: document.getElementById("snakeScore"),
  highScoreElement: document.getElementById("highScore"),
  gameOverSound: document.getElementById("gameOverSound"),
  eatSound: document.getElementById("eatSound"),
  headElement: document.getElementById("snake-head"),
  foodElement: document.getElementById("food"),
};

// Game settings
const snakeSettings = {
  gridSize: 20,
  gameWidth: 600,
  gameHeight: 400,
  updateSpeed: 150,
};

// Game state in one object
const snakeState = {
  running: false,
  keysPressed: {},
  snake: [{ x: 300, y: 200 }],
  direction: { x: 0, y: 0 },
  food: { x: 0, y: 0 },
  score: 0,
  highScore: parseInt(localStorage.getItem("snakeHighScore")) || 0,
  bodySegments: [],
  lastUpdateTime: 0,
};

/**
 * Starts the snake game when a key is pressed
 * Initializes snake position and begins game loop
 */
function startSnakeGame() {
  const snakePage = document.getElementById("snake-page");

  if (snakePage?.style.visibility === "visible" && !snakeState.running) {
    snakeState.snake = [{ x: 300, y: 200 }];
    snakeState.direction = { x: 0, y: 0 };
    snakeState.running = true;
    snakeState.lastUpdateTime = 0;

    snakeElements.startText.style.display = "none";
    document.removeEventListener("keydown", startSnakeGame);

    if (snakeState.food.x === 0 && snakeState.food.y === 0) {
      generateSnakeFood();
    }

    requestAnimationFrame(snakeGameLoop);
  }
}

/**
 * Main game loop that updates the game state based on elapsed time
 * Uses requestAnimationFrame for smooth animation
 * @param {number} timestamp - Current timestamp from requestAnimationFrame
 */
function snakeGameLoop(timestamp) {
  if (!snakeState.running) return;

  if (!snakeState.lastUpdateTime) snakeState.lastUpdateTime = timestamp;
  const elapsed = timestamp - snakeState.lastUpdateTime;

  if (elapsed > snakeSettings.updateSpeed) {
    updateSnakeGame();
    snakeState.lastUpdateTime = timestamp;
  }

  requestAnimationFrame(snakeGameLoop);
}

/**
 * Updates snake position, checks collisions, and handles food consumption
 */
function updateSnakeGame() {
  if (snakeState.direction.x === 0 && snakeState.direction.y === 0) return;

  const head = { ...snakeState.snake[0] };
  head.x += snakeState.direction.x;
  head.y += snakeState.direction.y;

  if (checkSnakeCollision(head)) {
    snakeGameOver();
    return;
  }

  snakeState.snake.unshift(head);

  if (head.x === snakeState.food.x && head.y === snakeState.food.y) {
    snakeState.score++;
    playSnakeSound(snakeElements.eatSound);
    updateSnakeScoreboard();
    generateSnakeFood();
  } else {
    snakeState.snake.pop();
  }

  updateSnakeDisplay();
}

/**
 * Handles key down events for snake direction control
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSnakeKeyDown(event) {
  const snakePage = document.getElementById("snake-page");

  if (!snakePage?.style.visibility === "visible" || !snakeState.running) return;

  snakeState.keysPressed[event.key] = true;
  processSnakeDirectionChange();
}

/**
 * Processes direction changes based on current key presses
 * Prevents the snake from reversing directly into itself
 */
function processSnakeDirectionChange() {
  let newDirection = { ...snakeState.direction };
  let changed = false;

  if (
    (snakeState.keysPressed["ArrowUp"] || snakeState.keysPressed["w"]) &&
    snakeState.direction.y === 0
  ) {
    newDirection = { x: 0, y: -snakeSettings.gridSize };
    changed = true;
  } else if (
    (snakeState.keysPressed["ArrowDown"] || snakeState.keysPressed["s"]) &&
    snakeState.direction.y === 0
  ) {
    newDirection = { x: 0, y: snakeSettings.gridSize };
    changed = true;
  } else if (
    (snakeState.keysPressed["ArrowLeft"] || snakeState.keysPressed["a"]) &&
    snakeState.direction.x === 0
  ) {
    newDirection = { x: -snakeSettings.gridSize, y: 0 };
    changed = true;
  } else if (
    (snakeState.keysPressed["ArrowRight"] || snakeState.keysPressed["d"]) &&
    snakeState.direction.x === 0
  ) {
    newDirection = { x: snakeSettings.gridSize, y: 0 };
    changed = true;
  }

  if (changed) {
    snakeState.direction = newDirection;
  }
}

/**
 * Handles key up events to track released keys
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleSnakeKeyUp(event) {
  snakeState.keysPressed[event.key] = false;
}

/**
 * Checks if the snake has collided with walls or itself
 * @param {Object} head - Position of the snake's head
 * @returns {boolean} - True if collision detected, false otherwise
 */
function checkSnakeCollision(head) {
  if (
    head.x < 0 ||
    head.x >= snakeSettings.gameWidth ||
    head.y < 0 ||
    head.y >= snakeSettings.gameHeight
  ) {
    return true;
  }

  for (let i = 0; i < snakeState.snake.length - 1; i++) {
    const segment = snakeState.snake[i];
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }

  return false;
}

/**
 * Updates the visual display of the snake on screen
 */
function updateSnakeDisplay() {
  if (snakeElements.headElement) {
    snakeElements.headElement.style.left = snakeState.snake[0].x + "px";
    snakeElements.headElement.style.top = snakeState.snake[0].y + "px";
  }

  updateSnakeBodySegments();
}

/**
 * Updates the snake body segments to match the current snake state
 * Creates, removes, and positions segments as needed
 */
function updateSnakeBodySegments() {
  while (snakeState.bodySegments.length >= snakeState.snake.length) {
    const segment = snakeState.bodySegments.pop();
    segment.remove();
  }

  while (snakeState.bodySegments.length < snakeState.snake.length - 1) {
    const segment = createSnakeBodySegment();
    snakeState.bodySegments.push(segment);
  }

  for (let i = 1; i < snakeState.snake.length; i++) {
    const bodyIndex = i - 1;
    if (snakeState.bodySegments[bodyIndex]) {
      snakeState.bodySegments[bodyIndex].style.left =
        snakeState.snake[i].x + "px";
      snakeState.bodySegments[bodyIndex].style.top =
        snakeState.snake[i].y + "px";
    }
  }
}

/**
 * Creates a new snake body segment DOM element
 * @returns {HTMLElement} - The created segment element
 */
function createSnakeBodySegment() {
  const segment = document.createElement("div");
  segment.className = "snake-segment";
  segment.style.position = "absolute";
  segment.style.width = snakeSettings.gridSize + "px";
  segment.style.height = snakeSettings.gridSize + "px";
  segment.style.transition = "left 0.15s linear, top 0.15s linear";

  snakeElements.gameArea?.appendChild(segment);
  return segment;
}

/**
 * Generates a new food position that doesn't overlap with the snake
 */
function generateSnakeFood() {
  snakeState.food = {
    x:
      Math.floor(
        Math.random() * (snakeSettings.gameWidth / snakeSettings.gridSize)
      ) * snakeSettings.gridSize,
    y:
      Math.floor(
        Math.random() * (snakeSettings.gameHeight / snakeSettings.gridSize)
      ) * snakeSettings.gridSize,
  };

  for (const segment of snakeState.snake) {
    if (segment.x === snakeState.food.x && segment.y === snakeState.food.y) {
      generateSnakeFood();
      return;
    }
  }

  if (snakeElements.foodElement) {
    Object.assign(snakeElements.foodElement.style, {
      position: "absolute",
      width: snakeSettings.gridSize + "px",
      height: snakeSettings.gridSize + "px",
      left: snakeState.food.x + "px",
      top: snakeState.food.y + "px",
    });
  }
}

/**
 * Updates the score display and checks for high score
 */
function updateSnakeScoreboard() {
  if (snakeElements.scoreElement) {
    snakeElements.scoreElement.innerText = snakeState.score;
  }

  const currentScore = Number(snakeState.score);
  const highScore = Number(snakeState.highScore);

  if (currentScore > highScore) {
    snakeState.highScore = currentScore;
    localStorage.setItem("snakeHighScore", snakeState.highScore);
  }

  if (snakeElements.highScoreElement) {
    snakeElements.highScoreElement.innerText = snakeState.highScore;
  }
}

/**
 * Handles game over state when the snake collides with a wall or itself
 */
function snakeGameOver() {
  snakeState.running = false;
  playSnakeSound(snakeElements.gameOverSound);
  pauseSnakeGame();
}

/**
 * Pauses the game and displays game over message
 * Sets up event listener for restart
 */
function pauseSnakeGame() {
  snakeState.running = false;
  snakeState.keysPressed = {};

  if (snakeElements.startText) {
    snakeElements.startText.style.display = "block";
    snakeElements.startText.innerText = `Game Over!\nScore: ${snakeState.score}\nPress any key to restart`;
  }

  const restartHandler = function (event) {
    document.removeEventListener("keydown", restartHandler);
    resetSnakeGame();
    startSnakeGame(event);
  };

  document.addEventListener("keydown", restartHandler);
}

/**
 * Resets the game to its initial state
 */
function resetSnakeGame() {
  snakeState.running = false;
  snakeState.lastUpdateTime = 0;
  snakeState.keysPressed = {};
  snakeState.snake = [{ x: 300, y: 200 }];
  snakeState.direction = { x: 0, y: 0 };
  snakeState.score = 0;

  if (snakeElements.highScoreElement) {
    snakeElements.highScoreElement.innerText = snakeState.highScore;
  }

  resetSnakeDisplay();
  updateSnakeScoreboard();
  generateSnakeFood();

  if (snakeElements.startText) {
    snakeElements.startText.style.display = "block";
    snakeElements.startText.innerText = "Press any key to start the game";
  }

  document.addEventListener("keydown", startSnakeGame);
}

/**
 * Resets the visual display of the snake
 */
function resetSnakeDisplay() {
  if (snakeElements.headElement) {
    Object.assign(snakeElements.headElement.style, {
      position: "absolute",
      width: snakeSettings.gridSize + "px",
      height: snakeSettings.gridSize + "px",
      left: snakeState.snake[0].x + "px",
      top: snakeState.snake[0].y + "px",
      transition: "left 0.15s linear, top 0.15s linear",
    });
  }

  snakeState.bodySegments.forEach((segment) => segment.remove());
  snakeState.bodySegments = [];
}

/**
 * Plays a sound effect with error handling
 * @param {HTMLAudioElement} sound - The sound element to play
 */
function playSnakeSound(sound) {
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch((e) => console.log("Audio play failed:", e));
  }
}

/**
 * Initializes the snake game by setting up event listeners and initial state
 */
function snakeInit() {
  document.addEventListener("keydown", startSnakeGame);
  document.addEventListener("keydown", handleSnakeKeyDown);
  document.addEventListener("keyup", handleSnakeKeyUp);

  if (snakeElements.highScoreElement) {
    snakeElements.highScoreElement.innerText = snakeState.highScore;
  }

  snakeState.food = { x: 0, y: 0 };

  resetSnakeGame();
}

/**
 * Cleans up event listeners and resets the display when leaving the game
 */
function snakeCleanup() {
  snakeState.running = false;

  document.removeEventListener("keydown", startSnakeGame);
  document.removeEventListener("keydown", handleSnakeKeyDown);
  document.removeEventListener("keyup", handleSnakeKeyUp);

  resetSnakeDisplay();

  if (snakeElements.startText) {
    snakeElements.startText.style.display = "block";
    snakeElements.startText.innerText = "Press any key to start the game";
  }
}

window.snakeInit = snakeInit;
window.snakeCleanup = snakeCleanup;
