// Настройка Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let currentTool = 'line';
let currentColor = '#000000';

// Рисуем сетку
function drawGrid(step = 30, color = '#e0e0e0') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  
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

// Вызываем при загрузке
drawGrid();

// Размеры Canvas (большие, как у dgrm.net)
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

// Рисование на Canvas
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);

function startDrawing(e) {
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
  ctx.strokeStyle = currentColor;
  ctx.fillStyle = currentColor;
}

function draw(e) {
  if (!isDrawing) return;
  
  if (currentTool === 'line') {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  } else if (currentTool === 'rect') {
    // Прямоугольник будет рисоваться при отпускании кнопки мыши
  }
}

function stopDrawing() {
  isDrawing = false;
}
