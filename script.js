// Настройка Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let currentTool = 'line';
let currentColor = '#000000';
let elements = []; // Все объекты
let selectedElement = null; // Выбранный элемент
let hoveredPoint = null; // Наведённая точка (для редактирования)

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

// Сетка (всегда видна)
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

// Рисуем все объекты
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid(); // Сетка рисуется первой
  
  elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color + '40';
    
    if (el.type === 'line') {
      // Линия
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
      
      // Точки (если элемент выбран)
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

// Проверяем, попадает ли курсор в точку
function isPointInElement(x, y, el) {
  if (el.type === 'line') {
    // Проверяем точки линии
    const hitRadius = 10;
    const dx1 = x - el.x1;
    const dy1 = y - el.y1;
    const dx2 = x - el.x2;
    const dy2 = y - el.y2;
    if (dx1 * dx1 + dy1 * dy1 < hitRadius * hitRadius) return 'p1';
    if (dx2 * dx2 + dy2 * dy2 < hitRadius * hitRadius) return 'p2';
  }
  return null;
}

// Обработчики событий
let isDragging = false;

canvas.addEventListener('mousedown', (e) => {
  const x = e.offsetX;
  const y = e.offsetY;
  
  // Проверяем, кликнули ли на точку
  for (const el of elements) {
    const point = isPointInElement(x, y, el);
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
      x2: x, // Начально линия — точка
      y2: y,
      color: currentColor
    });
    selectedElement = elements[elements.length - 1];
    hoveredPoint = 'p2'; // Редактируем вторую точку
    isDragging = true;
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
    isDragging = true;
  }
  
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
      selectedElement.width = x - selectedElement.x;
      selectedElement.height = y - selectedElement.y;
    }
    redrawCanvas();
  }
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  hoveredPoint = null;
});

canvas.addEventListener('mouseleave', () => {
  isDragging = false;
  hoveredPoint = null;
});

// Первая отрисовка
redrawCanvas();
