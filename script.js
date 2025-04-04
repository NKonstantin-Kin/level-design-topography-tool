const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Состояние приложения
const state = {
  tool: 'line',
  color: '#0000ff',
  elements: [], // Здесь храним все нарисованные элементы
  isDrawing: false,
  startX: 0,
  startY: 0
};

// Сетка (остаётся без изменений)
function drawGrid() {
  ctx.strokeStyle = '#e0e0e0';
  ctx.lineWidth = 1;
  const step = 30;

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

// Перерисовка всех элементов
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  state.elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = 2;

    if (el.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
    } else if (el.type === 'rect') {
      ctx.strokeRect(el.x, el.y, el.width, el.height);
    }
  });
}

// Обработчики событий
canvas.addEventListener('mousedown', (e) => {
  state.isDrawing = true;
  state.startX = e.clientX;
  state.startY = e.clientY;

  // Создаем новый элемент
  if (state.tool === 'line') {
    state.elements.push({
      type: 'line',
      x1: e.clientX,
      y1: e.clientY,
      x2: e.clientX,
      y2: e.clientY,
      color: state.color
    });
  } else if (state.tool === 'rect') {
    state.elements.push({
      type: 'rect',
      x: e.clientX,
      y: e.clientY,
      width: 0,
      height: 0,
      color: state.color
    });
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!state.isDrawing) return;

  const currentElement = state.elements[state.elements.length - 1];

  if (state.tool === 'line') {
    currentElement.x2 = e.clientX;
    currentElement.y2 = e.clientY;
  } else if (state.tool === 'rect') {
    currentElement.width = e.clientX - state.startX;
    currentElement.height = e.clientY - state.startY;
  }

  redraw(); // Перерисовываем всё
});

canvas.addEventListener('mouseup', () => {
  state.isDrawing = false;
});

// Инициализация
document.getElementById('line-btn').addEventListener('click', () => {
  state.tool = 'line';
});

document.getElementById('rect-btn').addEventListener('click', () => {
  state.tool = 'rect';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
  state.color = e.target.value;
});

// Первая отрисовка
drawGrid();
