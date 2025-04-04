const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Настройка размеров
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redraw();
}
window.addEventListener('resize', resizeCanvas);

// Состояние приложения
const state = {
  tool: 'line',
  color: '#0000ff',
  elements: [],
  isDrawing: false,
  startX: 0,
  startY: 0
};

// Сетка
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
  const rect = canvas.getBoundingClientRect();
  state.isDrawing = true;
  state.startX = e.clientX - rect.left;
  state.startY = e.clientY - rect.top;

  if (state.tool === 'line') {
    state.elements.push({
      type: 'line',
      x1: state.startX,
      y1: state.startY,
      x2: state.startX,
      y2: state.startY,
      color: state.color
    });
  } else if (state.tool === 'rect') {
    state.elements.push({
      type: 'rect',
      x: state.startX,
      y: state.startY,
      width: 0,
      height: 0,
      color: state.color
    });
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!state.isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const currentElement = state.elements[state.elements.length - 1];

  if (state.tool === 'line') {
    currentElement.x2 = mouseX;
    currentElement.y2 = mouseY;
  } else if (state.tool === 'rect') {
    currentElement.width = mouseX - state.startX;
    currentElement.height = mouseY - state.startY;
  }

  redraw();
});

canvas.addEventListener('mouseup', () => {
  state.isDrawing = false;
});

// Управление интерфейсом
document.getElementById('line-btn').addEventListener('click', () => {
  state.tool = 'line';
});

document.getElementById('rect-btn').addEventListener('click', () => {
  state.tool = 'rect';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
  state.color = e.target.value;
});

document.getElementById('clear-btn').addEventListener('click', () => {
  state.elements = [];
  redraw();
});

// Инициализация
resizeCanvas();
