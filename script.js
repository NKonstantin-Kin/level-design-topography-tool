document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;

    // Фон
    function drawBackground() {
        ctx.fillStyle = "#f8f8f8";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Сетка
    function drawGrid(gridSize = 50) {
        ctx.strokeStyle = "#ddd";
        ctx.lineWidth = 0.5;

        for (let x = 0; x < canvas.width; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for (let y = 0; y < canvas.height; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }

    // Рисование вручную
    let drawing = false;
    canvas.addEventListener("mousedown", () => drawing = true);
    canvas.addEventListener("mouseup", () => drawing = false);
    canvas.addEventListener("mousemove", draw);

    function draw(event) {
        if (!drawing) return;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(event.offsetX, event.offsetY, 2, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBackground();
    drawGrid();
});
