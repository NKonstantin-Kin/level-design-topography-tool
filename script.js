// Настройка Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentTool = 'line';
let currentColor = '#000000';
let startX, startY;
let elements = []; // Массив для хранения объектов

// Размеры Canvas
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

// Сетка
function drawGrid(step = 30, color = '#e0e0e0') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  for (let x = 0; x < canvas.width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

// Перерисовка всех объектов
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color + '40';
    if (el.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
    } else if (el.type === 'rect') {
      ctx.beginPath();
      ctx.rect(el.x, el.y, el.width, el.height);
      ctx.fill();
      ctx.stroke();
    }
  });
}

// Отрисовка при загрузке
drawGrid();

// Рисование
canvas.addEventListener('mousedown', (e) => {
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing) return;
  
  // Временный объект (пока не отпустили кнопку мыши)
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  redrawCanvas();
  
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = currentColor + '40';
  
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

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  
  // Сохраняем объект в массив
  if (currentTool === 'line') {
    elements.push({
      type: 'line',
      x1: startX,
      y1: startY,
      x2: e.offsetX,
      y2: e.offsetY,
      color: currentColor
    });
  } else if (currentTool === 'rect') {
    elements.push({
      type: 'rect',
      x: startX,
      y: startY,
      width: e.offsetX - startX,
      height: e.offsetY - startY,
      color: currentColor
    });
  }
  
  redrawCanvas();
});
