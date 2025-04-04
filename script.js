// Конфигурация
const CONFIG = {
  GRID_SIZE: 30,
  GRID_COLOR: '#e0e0e0',
  SHEET_BG: '#ffffff'
};

// Инициализация
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const roughCanvas = Rough.canvas(canvas);
let currentTool = 'select';
let elements = [];
let isDrawing = false;
let startX, startY;
let sheets = [{ id: 0, name: "Лист 1", elements: [] }];
let activeSheetId = 0;

// Размеры холста
function initCanvas() {
  canvas.width = 5000;
  canvas.height = 5000;
  canvas.style.background = CONFIG.SHEET_BG;
  canvas.classList.add('grid'); // Добавляем сетку
}

// Панель инструментов
function setupTools() {
  document.querySelectorAll('.tool-section button').forEach(btn => {
    btn.addEventListener('click', function() {
      currentTool = this.id.replace('tool-', '');
      document.querySelectorAll('.tool-section button').forEach(b => 
        b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Горячие клавиши
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'm') addNewSheet();
    if (e.key >= '1' && e.key <= '5') {
      const tool = document.getElementById(`tool-${['select', 'line', 'rect', 'circle', 'text'][e.key - 1]}`);
      tool?.click();
    }
  });
}
// Листы
function renderSheetTabs() {
  const container = document.getElementById('sheet-tabs');
  container.innerHTML = '';
  sheets.forEach(sheet => {
    const tab = document.createElement('button');
    tab.className = `sheet-tab ${sheet.id === activeSheetId ? 'active' : ''}`;
    tab.textContent = sheet.name;
    tab.onclick = () => switchSheet(sheet.id);
    container.appendChild(tab);
  });
}

function addNewSheet() {
  const newId = Date.now();
  sheets.push({ id: newId, name: `Лист ${sheets.length + 1}`, elements: [] });
  switchSheet(newId);
}

function switchSheet(sheetId) {
  activeSheetId = sheetId;
  renderSheetTabs();
  redrawCanvas();
}

// Отрисовка
function redrawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const activeSheet = sheets.find(s => s.id === activeSheetId);
  activeSheet?.elements.forEach(el => drawElement(el));
}

function drawElement(el) {
  switch (el.type) {
    case 'line':
      ctx.beginPath();
      ctx.moveTo(el.x1, el.y1);
      ctx.lineTo(el.x2, el.y2);
      ctx.strokeStyle = el.strokeColor;
      ctx.lineWidth = 2;
      ctx.setLineDash(el.dashStyle === 'dashed' ? [5, 3] : []);
      ctx.stroke();
      break;
    case 'rect':
      roughCanvas.rectangle(
        el.x, el.y, el.width, el.height,
        {
          stroke: el.strokeColor,
          fill: el.fillColor,
          roughness: document.getElementById('toggle-style').classList.contains('active') ? 1.5 : 0
        }
      );
      break;
  }
}
// Обработчики событий
function setupCanvasEvents() {
  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;
    isDrawing = true;

    if (currentTool === 'line') {
      sheets.find(s => s.id === activeSheetId).elements.push({
        type: 'line',
        x1: startX, y1: startY,
        x2: startX, y2: startY,
        strokeColor: document.getElementById('stroke-color').value,
        dashStyle: document.getElementById('dash-style').value
      });
    }
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const activeSheet = sheets.find(s => s.id === activeSheetId);
    const lastElement = activeSheet.elements[activeSheet.elements.length - 1];

    if (lastElement && currentTool === 'line') {
      lastElement.x2 = mouseX;
      lastElement.y2 = mouseY;
      redrawCanvas();
    }
  });

  canvas.addEventListener('mouseup', () => isDrawing = false);
}

// Инициализация
function init() {
  initCanvas();
  setupTools();
  renderSheetTabs();
  setupCanvasEvents();
  document.getElementById('add-sheet').addEventListener('click', addNewSheet);
  document.getElementById('toggle-style').addEventListener('click', function() {
    this.classList.toggle('active');
    redrawCanvas();
  });
}

window.onload = init;
