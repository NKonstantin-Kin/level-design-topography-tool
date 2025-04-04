// Инициализация
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const roughCanvas = Rough.canvas(canvas);
let isRoughStyle = false;

// Состояние
const state = {
  tool: 'line',
  color: '#0000ff',
  elements: [],
  history: [],
  historyIndex: -1,
  isDrawing: false,
  startX: 0,
  startY: 0
};

// Размеры холста
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  redraw();
}
window.addEventListener('resize', resizeCanvas);

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

// Сохранение состояния
function saveState() {
  state.history = state.history.slice(0, state.historyIndex + 1);
  state.history.push(JSON.parse(JSON.stringify(state.elements)));
  state.historyIndex++;
}

// Отмена/повтор
function undo() {
  if (state.historyIndex > 0) {
    state.historyIndex--;
    state.elements = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
    redraw();
  }
}

function redo() {
  if (state.historyIndex < state.history.length - 1) {
    state.historyIndex++;
    state.elements = JSON.parse(JSON.stringify(state.history[state.historyIndex]));
    redraw();
  }
}

// Отрисовка
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();

  state.elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.fillStyle = el.color;
    ctx.lineWidth = 2;

    switch (el.type) {
      case 'line':
        ctx.beginPath();
        ctx.moveTo(el.x1, el.y1);
        ctx.lineTo(el.x2, el.y2);
        ctx.stroke();
        break;
      case 'rect':
        if (isRoughStyle) {
          roughCanvas.rectangle(el.x, el.y, el.width, el.height, {
            stroke: el.color,
            roughness: 1.5
          });
        } else {
          ctx.strokeRect(el.x, el.y, el.width, el.height);
        }
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(el.x, el.y, el.radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'text':
        ctx.font = '16px Arial';
        ctx.fillText(el.content, el.x, el.y);
        break;
    }
  });
}

// Обработчики
canvas.addEventListener('mousedown', (e) => {
  const rect = canvas.getBoundingClientRect();
  state.isDrawing = true;
  state.startX = e.clientX - rect.left;
  state.startY = e.clientY - rect.top;

  switch (state.tool) {
    case 'line':
      state.elements.push({
        type: 'line',
        x1: state.startX,
        y1: state.startY,
        x2: state.startX,
        y2: state.startY,
        color: state.color
      });
      break;
    case 'rect':
      state.elements.push({
        type: 'rect',
        x: state.startX,
        y: state.startY,
        width: 0,
        height: 0,
        color: state.color
      });
      break;
    case 'circle':
      state.elements.push({
        type: 'circle',
        x: state.startX,
        y: state.startY,
        radius: 0,
        color: state.color
      });
      break;
  }
  saveState();
});

canvas.addEventListener('mousemove', (e) => {
  if (!state.isDrawing) return;
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;
  const current = state.elements[state.elements.length - 1];

  switch (state.tool) {
    case 'line':
      current.x2 = mouseX;
      current.y2 = mouseY;
      break;
    case 'rect':
      current.width = mouseX - state.startX;
      current.height = mouseY - state.startY;
      break;
    case 'circle':
      current.radius = Math.sqrt(
        Math.pow(mouseX - state.startX, 2) + 
        Math.pow(mouseY - state.startY, 2)
      );
      break;
  }
  redraw();
});

canvas.addEventListener('mouseup', () => {
  state.isDrawing = false;
});

canvas.addEventListener('click', (e) => {
  if (state.tool !== 'text') return;
  const rect = canvas.getBoundingClientRect();
  const text = document.getElementById('text-input').value;
  if (text) {
    state.elements.push({
      type: 'text',
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      content: text,
      color: state.color
    });
    saveState();
    redraw();
  }
});

// Инструменты
document.getElementById('line-btn').addEventListener('click', () => {
  state.tool = 'line';
});

document.getElementById('rect-btn').addEventListener('click', () => {
  state.tool = 'rect';
});

document.getElementById('circle-btn').addEventListener('click', () => {
  state.tool = 'circle';
});

document.getElementById('text-btn').addEventListener('click', () => {
  state.tool = 'text';
});

document.getElementById('color-picker').addEventListener('input', (e) => {
  state.color = e.target.value;
});

document.getElementById('style-toggle').addEventListener('click', function() {
  isRoughStyle = !isRoughStyle;
  this.classList.toggle('active');
  redraw();
});

document.getElementById('clear-btn').addEventListener('click', () => {
  state.elements = [];
  saveState();
  redraw();
});

document.getElementById('save-btn').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'diagram.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

// Горячие клавиши
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') undo();
  if (e.ctrlKey && e.key === 'y') redo();
  if (e.key === 'Delete') {
    state.elements = [];
    redraw();
  }
});

// Запуск
resizeCanvas();
