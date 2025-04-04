// Настройка Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentTool = 'line';
let currentColor = '#000000';
let elements = []; // Все объекты
let selectedElement = null; // Выбранный элемент
let hoveredPoint = null; // Наведённая точка
let isDragging = false;

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

// Сетка (теперь видна всегда!)
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

// Фон холста (белый)
function drawBackground() {
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Рисуем все объекты
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(); // Белый фон
  drawGrid(); // Сетка сверху
  
  elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color + '40';
    
    if (el.type === 'line') {
      // Линия
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      
      // Точки управления (если выбрана)
      if (el === selectedElement) {
        drawControlPoint(el.x1, el.y1);
        drawControlPoint(el.x2, el.y2);
      }
    } else if (el.type === 'rect') {
      // Прямоугольник
      ctx.beginPath();
      ctx.rect(el.x, el.y, el.width, el.height);
      ctx.fill();
      ctx.stroke();
      
      // Точки управления (если выбран)
      if (el === selectedElement) {
        drawControlPoint(el.x, el.y); // Левый верхний угол
        drawControlPoint(el.x + el.width, el.y + el.height); // Правый нижний
      }
    }
  });
}

// Рисуем точку управления
function drawControlPoint(x, y) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

// Проверяем, кликнули ли на точку
function getHoveredPoint(x, y, el) {
  const hitRadius = 10;
  
  if (el.type === 'line') {
    // Проверяем концы линии
    const dx1 = x - el.x1;
    const dy1 = y - el.y1;
    const dx2 = x - el.x2;
    const dy2 = y - el.y2;
    if (dx1 * dx1 + dy1 * dy1 < hitRadius * hitRadius) return 'p1';
    if (dx2 * dx2 + dy2 * dy2 < hitRadius * hitRadius) return 'p2';
  } else if (el.type === 'rect') {
    // Проверяем углы прямоугольника
    const corners = [
      { x: el.x, y: el.y, id: 'tl' }, // Верхний левый
      { x: el.x + el.width, y: el.y + el.height, id: 'br' } // Нижний правый
    ];
    for (const corner of corners) {
      const dx = x - corner.x;
      const dy = y - corner.y;
      if (dx * dx + dy * dy < hitRadius * hitRadius) return corner.id;
    }
  }
  return null;
}

// Обработчики событий
canvas.addEventListener('mousedown', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  
  // Проверяем, кликнули ли на точку существующего элемента
  for (const el of elements) {
    const point = getHoveredPoint(x, y, el);
    if (point) {
      selectedElement = el;
      hoveredPoint = point;
      isDragging = true;
      redrawCanvas();
      return;
    }
  }
  
  // Создаём новый объект
  if (currentTool === 'line') {
    elements.push({
      type: 'line',
      x1: x,
      y1: y,
      x2: x,
      y2: y,
      color: currentColor
    });
    selectedElement = elements[elements.length - 1];
    hoveredPoint = 'p2'; // Редактируем вторую точку
  } else if (currentTool === 'rect') {
    elements.push({
      type: 'rect',
      x: x,
      y: y,
      width: 0,
      height: 0,
      color: currentColor
    });
    selectedElement = elements[elements.length - 1];
    hoveredPoint = 'br'; // Редактируем правый нижний угол
  }
  
  isDragging = true;
  redrawCanvas();
});

canvas.addEventListener('mousemove', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  
  if (isDragging && selectedElement) {
    if (selectedElement.type === 'line') {
      if (hoveredPoint === 'p1') {
        selectedElement.x1 = x;
        selectedElement.y1 = y;
      } else if (hoveredPoint === 'p2') {
        selectedElement.x2 = x;
        selectedElement.y2 = y;
      }
    } else if (selectedElement.type === 'rect') {
      if (hoveredPoint === 'tl') {
        selectedElement.width += selectedElement.x - x;
        selectedElement.height += selectedElement.y - y;
        selectedElement.x = x;
        selectedElement.y = y;
      } else if (hoveredPoint === 'br') {
        selectedElement.width = x - selectedElement.x;
        selectedElement.height = y - selectedElement.y;
      }
    }
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  hoveredPoint = null;
});

// Первая отрисовка
drawBackground();
drawGrid();
