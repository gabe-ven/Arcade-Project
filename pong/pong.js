// DOM elements grouped together
const pongElements = {
  startText: document.getElementById("startText"),
  paddle1: document.getElementById("paddle1"),
  paddle2: document.getElementById("paddle2"),
  ball: document.getElementById("ball"),
  player1Score: document.getElementById("player1Score"),
  player2Score: document.getElementById("player2Score"),
  lossSound: document.getElementById("lossSound"),
  wallSound: document.getElementById("wallSound"),
  paddleSound: document.getElementById("paddleSound"),
  exitButton: document.getElementById("back-button"),
};

// Game constants
const pongSettings = {
  paddleAccel: 1,
  maxPaddleSpeed: 5,
  paddleDecel: 1,
  gameHeight: 400,
  gameWidth: 600,
  frameTime: 8,
  initialPaddleY: 150,
};

// Game state in one object
const pongState = {
  running: false,
  keysPressed: {},
  paddle1: {
    y: pongSettings.initialPaddleY,
    speed: 0,
  },
  paddle2: {
    y: pongSettings.initialPaddleY,
    speed: 0,
  },
  ball: {
    x: 290,
    y: 190,
    speedX: 2,
    speedY: 2,
  },
  score: {
    player1: 0,
    player2: 0,
  },
};

/**
 * Starts the pong game when a key is pressed
 * Hides start text and begins the game loop
 */
function startPongGame() {
  const pongPage = document.getElementById("pong-page");

  if (pongPage?.style.visibility === "visible" && !pongState.running) {
    pongState.running = true;
    pongElements.startText.style.display = "none";
    document.removeEventListener("keydown", startPongGame);
    pongGameLoop();
  }
}

/**
 * Main game loop that updates paddle positions and ball movement
 * Runs continuously while the game is active
 */
function pongGameLoop() {
  if (!pongState.running) return;

  updatePongPaddles();
  movePongBall();

  setTimeout(pongGameLoop, pongSettings.frameTime);
}

/**
 * Handles key down events to track player inputs
 * @param {KeyboardEvent} event - The keyboard event
 */
function handlePongKeyDown(event) {
  pongState.keysPressed[event.key] = true;
}

/**
 * Handles key up events to stop paddle movement
 * @param {KeyboardEvent} event - The keyboard event
 */
function handlePongKeyUp(event) {
  pongState.keysPressed[event.key] = false;
}

/**
 * Updates positions of both paddles based on keyboard input
 */
function updatePongPaddles() {
  updatePongPaddle(
    pongState.paddle1,
    pongElements.paddle1,
    pongState.keysPressed["w"],
    pongState.keysPressed["s"]
  );

  updatePongPaddle(
    pongState.paddle2,
    pongElements.paddle2,
    pongState.keysPressed["ArrowUp"],
    pongState.keysPressed["ArrowDown"]
  );
}

/**
 * Updates a single paddle's position and speed based on input
 * Handles acceleration, deceleration, and boundary constraints
 * @param {Object} paddleState - State object for the paddle
 * @param {HTMLElement} paddleElement - DOM element for the paddle
 * @param {boolean} upPressed - Whether the up key is pressed
 * @param {boolean} downPressed - Whether the down key is pressed
 */
function updatePongPaddle(paddleState, paddleElement, upPressed, downPressed) {
  if (upPressed) {
    paddleState.speed = Math.max(
      paddleState.speed - pongSettings.paddleAccel,
      -pongSettings.maxPaddleSpeed
    );
  } else if (downPressed) {
    paddleState.speed = Math.min(
      paddleState.speed + pongSettings.paddleAccel,
      pongSettings.maxPaddleSpeed
    );
  } else {
    if (paddleState.speed > 0) {
      paddleState.speed = Math.max(
        paddleState.speed - pongSettings.paddleDecel,
        0
      );
    } else if (paddleState.speed < 0) {
      paddleState.speed = Math.min(
        paddleState.speed + pongSettings.paddleDecel,
        0
      );
    }
  }

  paddleState.y += paddleState.speed;

  paddleState.y = Math.max(
    0,
    Math.min(
      paddleState.y,
      pongSettings.gameHeight - paddleElement.clientHeight
    )
  );

  paddleElement.style.top = paddleState.y + "px";
}

/**
 * Updates the ball's position and checks for collisions
 */
function movePongBall() {
  const ball = pongState.ball;
  const ballElement = pongElements.ball;

  ball.x += ball.speedX;
  ball.y += ball.speedY;

  if (
    ball.y >= pongSettings.gameHeight - ballElement.clientHeight ||
    ball.y <= 0
  ) {
    ball.speedY = -ball.speedY;
    playPongSound(pongElements.wallSound);
  }

  checkPongPaddleCollisions();
  checkPongGoalCollisions();

  ballElement.style.left = ball.x + "px";
  ballElement.style.top = ball.y + "px";
}

/**
 * Checks for collision between the ball and paddles
 * Reverses ball direction and plays sound on collision
 */
function checkPongPaddleCollisions() {
  const ball = pongState.ball;
  const ballElement = pongElements.ball;
  const paddle1 = pongElements.paddle1;
  const paddle2 = pongElements.paddle2;

  if (
    ball.x <= paddle1.clientWidth &&
    ball.y >= pongState.paddle1.y &&
    ball.y <= pongState.paddle1.y + paddle1.clientHeight
  ) {
    ball.speedX = -ball.speedX;
    playPongSound(pongElements.paddleSound);
  }

  if (
    ball.x >=
      pongSettings.gameWidth - paddle2.clientWidth - ballElement.clientWidth &&
    ball.y >= pongState.paddle2.y &&
    ball.y <= pongState.paddle2.y + paddle2.clientHeight
  ) {
    ball.speedX = -ball.speedX;
    playPongSound(pongElements.paddleSound);
  }
}

/**
 * Checks if the ball has reached either side of the game area
 * Updates score and resets the ball when a player scores
 */
function checkPongGoalCollisions() {
  const ball = pongState.ball;
  const ballElement = pongElements.ball;

  if (ball.x <= 0) {
    pongState.score.player2++;
    playPongSound(pongElements.lossSound);
    updatePongScoreboard();
    resetPongBall();
    pausePongGame();
  } else if (ball.x >= pongSettings.gameWidth - ballElement.clientWidth) {
    pongState.score.player1++;
    playPongSound(pongElements.lossSound);
    updatePongScoreboard();
    resetPongBall();
    pausePongGame();
  }
}

/**
 * Updates the score display on the game board
 */
function updatePongScoreboard() {
  pongElements.player1Score.innerText = pongState.score.player1;
  pongElements.player2Score.innerText = pongState.score.player2;
}

/**
 * Resets the ball to the center with a random direction
 */
function resetPongBall() {
  const ballElement = pongElements.ball;

  pongState.ball = {
    x: pongSettings.gameWidth / 2 - ballElement.clientWidth / 2,
    y: pongSettings.gameHeight / 2 - ballElement.clientHeight / 2,
    speedX: Math.random() > 0.5 ? 2 : -2,
    speedY: Math.random() > 0.5 ? 2 : -2,
  };

  ballElement.style.left = pongState.ball.x + "px";
  ballElement.style.top = pongState.ball.y + "px";
}

/**
 * Pauses the game and waits for player input to continue
 */
function pausePongGame() {
  pongState.running = false;
  document.addEventListener("keydown", startPongGame);
}

/**
 * Resets the entire game to its initial state
 * Resets paddles, ball, and score
 */
function resetPongGame() {
  pongState.running = false;

  pongState.paddle1.y = pongSettings.initialPaddleY;
  pongState.paddle2.y = pongSettings.initialPaddleY;
  pongState.paddle1.speed = 0;
  pongState.paddle2.speed = 0;

  pongElements.paddle1.style.top = pongState.paddle1.y + "px";
  pongElements.paddle2.style.top = pongState.paddle2.y + "px";

  resetPongBall();

  pongState.score.player1 = 0;
  pongState.score.player2 = 0;
  updatePongScoreboard();

  pongElements.startText.style.display = "block";

  document.addEventListener("keydown", startPongGame);
}

/**
 * Plays a sound effect with error handling
 * @param {HTMLAudioElement} sound - The sound element to play
 */
function playPongSound(sound) {
  if (!sound) return;
  sound.currentTime = 0;
  sound.play().catch((e) => console.log("Audio play failed:", e));
}

/**
 * Initializes the pong game by setting up event listeners
 */
function pongInit() {
  document.addEventListener("keydown", startPongGame);
  document.addEventListener("keydown", handlePongKeyDown);
  document.addEventListener("keyup", handlePongKeyUp);

  resetPongGame();
}

/**
 * Cleans up event listeners and resets the game when leaving
 */
function pongCleanup() {
  pongState.running = false;

  document.removeEventListener("keydown", startPongGame);
  document.removeEventListener("keydown", handlePongKeyDown);
  document.removeEventListener("keyup", handlePongKeyUp);

  resetPongGame();
}

window.pongInit = pongInit;
window.pongCleanup = pongCleanup;
