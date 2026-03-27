function createGrid() {
    const slider = document.querySelector('.speakers');
    if (!slider) return;

    // Удаляем существующую сетку
    const existingGrid = slider.querySelector('.grid-overlay');
    if (existingGrid) {
        existingGrid.remove();
    }

    // Получаем размеры блока и его позицию относительно документа
    const sliderRect = slider.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    // Абсолютные координаты блока относительно документа
    const absoluteTop = sliderRect.top + scrollTop;
    const absoluteBottom = sliderRect.bottom + scrollTop;
    const absoluteLeft = sliderRect.left + scrollLeft;
    const absoluteRight = sliderRect.right + scrollLeft;
    
    // Границы для рисования от левого края окна до правого
    // Но в абсолютных координатах
    const startX = scrollLeft;
    const endX = scrollLeft + window.innerWidth;
    const startY = absoluteTop;
    const endY = absoluteBottom;
    
    const width = endX - startX;
    const height = endY - startY;

    // Высота ячейки = высота блока / 3
    const cellHeight = height / 3;
    // Ширина ячейки = высоте ячейки (квадратные клетки)
    const cellWidth = cellHeight;

    // Создаем canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.zIndex = '-1';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.className = 'grid-overlay';

    // Устанавливаем реальные размеры canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = slider.offsetWidth * dpr;
    canvas.height = slider.offsetHeight * dpr;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    
    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.beginPath();
    ctx.strokeStyle = '#3F3F3F';
    ctx.lineWidth = 1;

    // Рисуем вертикальные линии
    // Рассчитываем смещение для рисования относительно canvas
    const offsetX = absoluteLeft - scrollLeft;
    const offsetY = absoluteTop - scrollTop;
    
    // Определяем количество колонок от левого края окна до правого
    const startCol = Math.floor(scrollLeft / cellWidth);
    const endCol = Math.ceil((scrollLeft + window.innerWidth) / cellWidth);
    
    for (let i = startCol; i <= endCol; i++) {
        const x = (i * cellWidth) - scrollLeft - offsetX;
        if (x >= 0 && x <= canvas.width) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    // Рисуем горизонтальные линии
    // Верхняя граница
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.stroke();
    
    // Внутренние линии (2 линии для 3 рядов)
    for (let i = 1; i <= 2; i++) {
        const y = i * cellHeight;
        if (y >= 0 && y <= canvas.height) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
    }
    
    // Нижняя граница
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.stroke();

    slider.style.position = 'relative';
    slider.appendChild(canvas);
}

// Функция для плавного обновления при скролле
let rafId = null;

function updateGrid() {
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    rafId = requestAnimationFrame(() => {
        createGrid();
        rafId = null;
    });
}

// Вызываем при загрузке
window.addEventListener('load', updateGrid);

// При изменении размера окна
window.addEventListener('resize', () => {
    clearTimeout(window.resizeTimer);
    window.resizeTimer = setTimeout(updateGrid, 250);
});

// При прокрутке - используем requestAnimationFrame для плавности
window.addEventListener('scroll', () => {
    updateGrid();
});

// Отслеживаем изменения в стилях блока
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            updateGrid();
        }
    });
});

const slider = document.querySelector('.speakers__slider');
if (slider) {
    observer.observe(slider, { attributes: true });
}

// Отслеживаем изменения размера блока
const resizeObserver = new ResizeObserver(() => {
    updateGrid();
});

if (slider) {
    resizeObserver.observe(slider);
}