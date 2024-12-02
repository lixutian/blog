var canvasEl = document.createElement('canvas');
canvasEl.style.cssText = 'position:fixed;top:0;left:0;pointer-events:none;z-index:9999999';
document.body.appendChild(canvasEl);

var ctx = canvasEl.getContext('2d');
var numberOfParticules = 30;
var pointerX = 0;
var pointerY = 0;
var tap = 'click'; // ('ontouchstart' in window || navigator.msMaxTouchPoints) ? 'touchstart' : 'mousedown'
var colors = [
    // 原始默认
    "rgba(255,182,185,.9)",
    "rgba(250,227,217,.9)",
    "rgba(187,222,214,.9)",
    "rgba(138,198,209,.9)",
    // 粉彩色系
    "rgba(255, 223, 186, 0.9)", // 浅橙色
    "rgba(255, 214, 165, 0.9)", // 奶油色
    "rgba(253, 255, 182, 0.9)", // 浅黄色
    "rgba(202, 255, 191, 0.9)", // 淡绿色
    "rgba(155, 246, 255, 0.9)", // 浅蓝色
    "rgba(160, 196, 255, 0.9)", // 天蓝色
    // 清新渐变
    "rgba(244, 194, 194, 0.9)", // 淡红色
    "rgba(183, 234, 218, 0.9)", // 浅青绿色
    "rgba(174, 213, 254, 0.9)", // 浅天蓝色
    "rgba(207, 159, 255, 0.9)", // 薰衣草紫
    "rgba(255, 223, 244, 0.9)", // 浅粉紫色
    // 活力色彩
    "rgba(255, 87, 51, 0.9)",  // 活力橙
    "rgba(255, 195, 0, 0.9)",  // 明黄色
    "rgba(137, 207, 240, 0.9)", // 宝石蓝
    "rgba(255, 111, 146, 0.9)", // 樱花粉
    "rgba(138, 43, 226, 0.9)",  // 深紫色
    // // 梦幻星空
    // "rgba(128, 0, 128, 0.9)",   // 紫罗兰
    // "rgba(75, 0, 130, 0.9)",    // 靛蓝色
    // "rgba(0, 191, 255, 0.9)",   // 天空蓝
    // "rgba(255, 20, 147, 0.9)",  // 深粉红
    // "rgba(240, 128, 128, 0.9)", // 浅珊瑚色
    // // 高级灰色
    // "rgba(192, 192, 192, 0.9)", // 银灰
    // "rgba(169, 169, 169, 0.9)", // 深灰
    // "rgba(105, 105, 105, 0.9)", // 石板灰
    // "rgba(211, 211, 211, 0.9)", // 浅灰
    // "rgba(47, 79, 79, 0.9)"     // 暗淡灰
];

function setCanvasSize() {
    canvasEl.width = window.innerWidth * 2;
    canvasEl.height = window.innerHeight * 2;
    canvasEl.style.width = window.innerWidth + 'px';
    canvasEl.style.height = window.innerHeight + 'px';
    canvasEl.getContext('2d').scale(2, 2);
}

function updateCoords(e) {
    pointerX = e.clientX || e.touches && e.touches[0].clientX;
    pointerY = e.clientY || e.touches && e.touches[0].clientY;
}

function setParticuleDirection(p) {
    var angle = anime.random(0, 360) * Math.PI / 180;
    var value = anime.random(30, 150);
    var radius = [-1, 1][anime.random(0, 1)] * value;
    return {
        x: p.x + radius * Math.cos(angle),
        y: p.y + radius * Math.sin(angle)
    }
}

function createParticule(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = colors[anime.random(0, colors.length - 1)];
    p.radius = anime.random(16, 32);
    p.endPos = setParticuleDirection(p);
    p.draw = function () {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.fillStyle = p.color;
        ctx.fill();
    }
    return p;
}

function createCircle(x, y) {
    var p = {};
    p.x = x;
    p.y = y;
    p.color = '#FFF';
    p.radius = 0.1;
    p.alpha = .5;
    p.lineWidth = 6;
    p.draw = function () {
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, true);
        ctx.lineWidth = p.lineWidth;
        ctx.strokeStyle = p.color;
        ctx.stroke();
        ctx.globalAlpha = 1;
    }
    return p;
}

function renderParticule(anim) {
    for (var i = 0; i < anim.animatables.length; i++) {
        anim.animatables[i].target.draw();
    }
}

function animateParticules(x, y) {
    var circle = createCircle(x, y);
    var particules = [];
    for (var i = 0; i < numberOfParticules; i++) {
        particules.push(createParticule(x, y));
    }
    anime.timeline().add({
        targets: particules,
        x: function (p) {
            return p.endPos.x;
        },
        y: function (p) {
            return p.endPos.y;
        },
        radius: 0.1,
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    }).add({
        targets: circle,
        radius: anime.random(80, 160),
        lineWidth: 0,
        alpha: {
            value: 0,
            easing: 'linear',
            duration: anime.random(600, 800),
        },
        duration: anime.random(1200, 1800),
        easing: 'easeOutExpo',
        update: renderParticule
    }, 0);
}

var render = anime({
    duration: Infinity,
    update: function () {
        ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    }
});

document.addEventListener(tap, function (e) {
    render.play();
    updateCoords(e);
    animateParticules(pointerX, pointerY);
}, false);

setCanvasSize();
window.addEventListener('resize', setCanvasSize, false);
