const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('start');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [];
let direction = { x: 1, y: 0 };
let nextDirection = { ...direction };
let food = { x: 5, y: 5 };
let score = 0;
let gameLoop;

function resetState() {
  snake = [
    { x: 8, y: 10 },
    { x: 7, y: 10 },
    { x: 6, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  updateScore();
  placeFood();
}

function initGame() {
  resetState();
  clearInterval(gameLoop);
  gameLoop = setInterval(() => {
    update();
    draw();
  }, 120);
}

function update() {
  direction = nextDirection;
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  head.x = (head.x + tileCount) % tileCount;
  head.y = (head.y + tileCount) % tileCount;

  if (isCollision(head)) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score += 10;
    updateScore();
    placeFood();
  } else {
    snake.pop();
  }
}

function draw() {
  ctx.fillStyle = '#1b1d20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
  });
}

function isCollision(position) {
  return snake.some((segment) => segment.x === position.x && segment.y === position.y);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function updateScore() {
  scoreEl.textContent = score;
}

function endGame() {
  clearInterval(gameLoop);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#fff';
  ctx.font = '24px "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 12);
  ctx.font = '18px "Segoe UI", sans-serif';
  ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 16);
  ctx.fillText('Press Start to play again', canvas.width / 2, canvas.height / 2 + 44);
}

function handleKeydown(event) {
  const key = event.key.toLowerCase();
  switch (key) {
    case 'arrowup':
    case 'w':
      if (direction.y === 0) nextDirection = { x: 0, y: -1 };
      break;
    case 'arrowdown':
    case 's':
      if (direction.y === 0) nextDirection = { x: 0, y: 1 };
      break;
    case 'arrowleft':
    case 'a':
      if (direction.x === 0) nextDirection = { x: -1, y: 0 };
      break;
    case 'arrowright':
    case 'd':
      if (direction.x === 0) nextDirection = { x: 1, y: 0 };
      break;
  }
}

startBtn.addEventListener('click', initGame);
document.addEventListener('keydown', handleKeydown);

resetState();
draw();
