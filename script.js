// Настройка Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentTool = 'line';
let currentColor = '#000000';
let startX, startY; // Для фигур

// Размеры Canvas (5000x5000)
canvas.width = 5000;
canvas.height = 5000;

// Цвет из палитры
document.getElementById('color-picker').addEventListener('input', (e) => {
  currentColor = e.target.value;
});

// Выбор инструмента
document.getElementById('tool-line').addEventListener('click', () => {
  currentTool = 'line';
});

document.getElementById('tool-rect').addEventListener('click', () => {
  currentTool = 'rect';
});

// Рисуем сетку
function drawGrid(step = 30, color = '#e0e0e0') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  
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

// Отрисовка при загрузке
drawGrid();

// Рисование на Canvas
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  
  // Очищаем холст и рисуем сетку заново
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  
  // Временная линия/прямоугольник (пока не отпустили кнопку мыши)
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = currentColor + '40'; // Прозрачная заливка
  
  if (currentTool === 'line') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === 'rect') {
    ctx.beginPath();
    ctx.rect(startX, startY, e.offsetX - startX, e.offsetY - startY);
    ctx.fill();
    ctx.stroke();
  }
});

canvas.addEventListener('mouseup', () => {
  isDrawing = false;
});
