// Инициализация Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 50;

// Состояние приложения
const state = {
  tool: 'select',
  color: '#0000ff',
  sheets: [{ id: 1, name: 'Лист 1', elements: [] }],
  currentSheet: 1,
  isDrawing: false,
  startX: 0,
  startY: 0
};

// Рисование сетки
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

// Обработчики событий
canvas.addEventListener('mousedown', (e) => {
  state.isDrawing = true;
  state.startX = e.offsetX;
  state.startY = e.offsetY;

  if (state.tool === 'line') {
    state.sheets[0].elements.push({
      type: 'line',
      x1: e.offsetX,
      y1: e.offsetY,
      x2: e.offsetX,
      y2: e.offsetY,
      color: state.color
    });
  }
});

canvas.addEventListener('mousemove', (e) => {
  if (!state.isDrawing) return;

  if (state.tool === 'line') {
    const currentLine = state.sheets[0].elements[state.sheets[0].elements.length - 1];
    currentLine.x2 = e.offsetX;
    currentLine.y2 = e.offsetY;
    redraw();
  }
});

canvas.addEventListener('mouseup', () => {
  state.isDrawing = false;
});

// Перерисовка холста
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  
  state.sheets[0].elements.forEach(el => {
    ctx.strokeStyle = el.color;
    ctx.lineWidth = 2;
    
    if (el.type === 'line') {
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.stroke();
    }
  });
}

// Инициализация
function init() {
  document.getElementById('tool-line').addEventListener('click', () => {
    state.tool = 'line';
    updateToolButtons();
  });

  document.getElementById('tool-select').addEventListener('click', () => {
    state.tool = 'select';
    updateToolButtons();
  });

  document.getElementById('stroke-color').addEventListener('input', (e) => {
    state.color = e.target.value;
  });

  document.getElementById('add-sheet').addEventListener('click', addNewSheet);

  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'm') addNewSheet();
  });

  redraw();
}

function updateToolButtons() {
  document.querySelectorAll('.toolbar button').forEach(btn => {
    btn.style.background = btn.id === `tool-${state.tool}` ? '#1abc9c' : '#34495e';
  });
}

function addNewSheet() {
  const newId = state.sheets.length + 1;
  state.sheets.push({ id: newId, name: `Лист ${newId}`, elements: [] });
  alert(`Добавлен новый лист (${newId})`); // Временное уведомление
}

window.onload = init;
