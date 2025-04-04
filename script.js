// Инициализация
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Состояние
let currentTool = 'line';
let isDrawing = false;
let startX, startY;
let currentColor = '#0000ff';

// Сетка
function drawGrid() {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  const step = 30;

  // Вертикальные линии
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  // Горизонтальные линии
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Обработчики
document.getElementById('line-btn').addEventListener('click', () => {
  currentTool = 'line';
});

document.getElementById('rect-btn').addEventListener('click', () => {
  currentTool = 'rect';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
  currentColor = e.target.value;
});

canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  
  ctx.strokeStyle = currentColor;
  ctx.lineWidth = 2;

  if (currentTool === 'line') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
  } else if (currentTool === 'rect') {
    ctx.strokeRect(
      startX,
      startY,
      e.clientX - startX,
      e.clientY - startY
    );
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});

// Запуск
drawGrid();
