// Конфигурация
const CONFIG = {
  GRID_SIZE: 30,
  GRID_COLOR: '#e0e0e0',
  BACKGROUND_COLORS: {
    light: '#ffffff',
    gray: '#f0f0f0',
    dark: '#333333',
    paper: '#f5e7c6'
  }
};

// Инициализация Canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const roughCanvas = Rough.canvas(canvas);
const canvasContainer = document.getElementById('canvas-container');

// Состояние приложения
let state = {
  currentTool: 'select',
  currentSheet: 0,
  sheets: [{
    id: 0,
    name: 'Лист 1',
    elements: [],
    background: 'light'
  }],
  selectedElement: null,
  isDrawing: false,
  startX: 0,
  startY: 0,
  snapToGrid: true
};

// Масштабирование
let scale = 1.0;
let offsetX = 0;
let offsetY = 0;
// Утилиты
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (e.clientX - rect.left - offsetX) / scale,
    y: (e.clientY - rect.top - offsetY) / scale
  };
}

function drawGrid() {
  const step = CONFIG.GRID_SIZE;
  ctx.strokeStyle = CONFIG.GRID_COLOR;
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

function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Фон
  ctx.fillStyle = CONFIG.BACKGROUND_COLORS[state.sheets[state.currentSheet].background];
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Сетка
  drawGrid();
  
  // Элементы
  state.sheets[state.currentSheet].elements.forEach(el => drawElement(el));
}
// Отрисовка элементов
function drawElement(el) {
  switch (el.type) {
    case 'line':
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = el.strokeWidth;
      ctx.setLineDash(el.dashStyle === 'dashed' ? [5, 3] : []);
      ctx.stroke();
      
      // Стрелки
      if (el.hasArrowStart) drawArrow(el.x1, el.y1, el.x2, el.y2, el.strokeColor);
      if (el.hasArrowEnd) drawArrow(el.x2, el.y2, el.x1, el.y1, el.strokeColor);
      break;
      
    case 'rect':
      roughCanvas.rectangle(
        el.x, el.y, el.width, el.height,
        { 
          stroke: el.strokeColor,
          fill: el.fillColor,
          fillStyle: el.fillStyle,
          roughness: el.style === 'handdrawn' ? 1.5 : 0
        }
      );
      break;
      
    case 'text':
      ctx.font = `${el.fontSize}px Arial`;
      ctx.fillStyle = el.color;
      ctx.fillText(el.text, el.x, el.y);
      break;
  }
}

function drawArrow(fromX, fromY, toX, toY, color) {
  const headLength = 10;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
}
// Обработчики событий
function initEventListeners() {
  // Инструменты
  document.getElementById('tool-select').addEventListener('click', () => {
    state.currentTool = 'select';
    updateActiveTool();
  });
  
  document.getElementById('tool-line').addEventListener('click', () => {
    state.currentTool = 'line';
    updateActiveTool();
  });
  
  // Клики по холсту
  canvas.addEventListener('mousedown', handleMouseDown);
  canvas.addEventListener('mousemove', handleMouseMove);
  canvas.addEventListener('mouseup', handleMouseUp);
  
  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && state.selectedElement) {
      deleteSelectedElement();
    }
  });
}

function handleMouseDown(e) {
  const pos = getMousePos(e);
  state.isDrawing = true;
  state.startX = pos.x;
  state.startY = pos.y;
  
  if (state.currentTool === 'line') {
    state.sheets[state.currentSheet].elements.push({
      type: 'line',
      x1: pos.x,
      y1: pos.y,
      x2: pos.x,
      y2: pos.y,
      strokeColor: document.getElementById('stroke-color').value,
      strokeWidth: 2,
      dashStyle: document.getElementById('dash-style').value,
      hasArrowStart: false,
      hasArrowEnd: false
    });
  }
}

function handleMouseMove(e) {
  if (!state.isDrawing) return;
  
  const pos = getMousePos(e);
  const currentSheet = state.sheets[state.currentSheet];
  const lastElement = currentSheet.elements[currentSheet.elements.length - 1];
  
  if (lastElement && state.currentTool === 'line') {
    lastElement.x2 = pos.x;
    lastElement.y2 = pos.y;
    redrawCanvas();
  }
}
function handleMouseUp() {
  state.isDrawing = false;
}

function updateActiveTool() {
  document.querySelectorAll('.toolbar button').forEach(btn => {
    btn.classList.remove('active');
  });
  document.getElementById(`tool-${state.currentTool}`).classList.add('active');
}

// Инициализация
function init() {
  // Настройка размеров Canvas
  canvas.width = 5000;
  canvas.height = 5000;
  
  // Загрузка сохраненных данных
  loadFromLocalStorage();
  
  // Инициализация интерфейса
  initEventListeners();
  updateActiveTool();
  redrawCanvas();
}

// Сохранение/загрузка
function saveToLocalStorage() {
  localStorage.setItem('levelDesignerData', JSON.stringify(state));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem('levelDesignerData');
  if (savedData) state = JSON.parse(savedData);
}

// Запуск приложения
window.onload = init;
