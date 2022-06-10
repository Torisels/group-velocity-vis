(function () {
  for (var a = 0, c = ["ms", "moz", "webkit", "o"], b = 0; b < c.length && !window.requestAnimationFrame; ++b)
    (window.requestAnimationFrame = window[c[b] + "RequestAnimationFrame"]), (window.cancelAnimationFrame = window[c[b] + "CancelAnimationFrame"] || window[c[b] + "CancelRequestAnimationFrame"]);
  window.requestAnimationFrame ||
  (window.requestAnimationFrame = function (b, c) {
    var d = new Date().getTime(),
      e = Math.max(0, 16 - (d - a)),
      f = window.setTimeout(function () {
        b(d + e);
      }, e);
    a = d + e;
    return f;
  });
  window.cancelAnimationFrame ||
  (window.cancelAnimationFrame = function (a) {
    clearTimeout(a);
  });
})();
var meta = document.createElement("meta");
meta.name = "keywords";
meta.content = "general physics, general physics animations, physics animations, surendranath";
document.getElementsByTagName("head")[0].appendChild(meta);
var pw = document.getElementById("page-wrapper"),
  nameInfo = create('<div style="color:darkGray;font-size:50%;width:200px;">Animation by Surendranath.B. Hyderabad, India </div>');
pw.appendChild(nameInfo);

function create(a) {
  var c = document.createDocumentFragment(),
    b = document.createElement("div");
  for (b.innerHTML = a; b.firstChild;) c.appendChild(b.firstChild);
  return c;
}

var btnSS = document.getElementById("btnSS"),
  menu = document.getElementById("menu"),
  menuNP = document.getElementById("menuNP"),
  fgCanvas = document.getElementById("fgCanvas"),
  bgCanvas = document.getElementById("bgCanvas");
menuNP.onchange = changeNP;
menu.onchange = changeIndex;
btnSS.onclick = startStop;
var cw = fgCanvas.width,
  ch = fgCanvas.height,
  ctx = fgCanvas.getContext("2d"),
  ctxBG = bgCanvas.getContext("2d"),
  centerX = cw / 2,
  centerY = ch / 2,
  A = ch / 8,
  sy = Array(cw + 1),
  index = 3,
  xg,
  xp,
  k = 0,
  freq = 1,
  dk = 0,
  df = 0,
  lambda = cw / 10,
  phaseVel,
  groupVel,
  k1 = k + dk,
  k2 = k - dk,
  f1 = freq + df,
  f2 = freq - df,
  numWP = 3,
  gx = cw / 10,
  gy = ch / 4,
  hwl,
  radiusRedDot = 3,
  radiusGreenDot = 4,
  captions = "Phase Velocity = Group Velocity;Phase Velocity > Group Velocity;Phase Velocity < Group Velocity;Phase Velocity > 0  Group Velocity = 0;Phase Velocity = 0  Group Velocity > 0;Phase Velocity < 0  Group Velocity > 0;Phase Velocity > 0  Group Velocity < 0".split(
    ";"
  ),
  anim = !1;
menu.selectedIndex = 2;
menuNP.selectedIndex = 2;
var frame = 0,
  fps = 25,
  now,
  delta,
  then = Date.now(),
  interval = 1e3 / fps;
calcConstants();
drawGrid();
drawCanvas();

function calcConstants() {
  switch (index) {
    case 1:
      freq = 1;
      df = 0.05;
      break;
    case 2:
      freq = 1;
      df = 0.025;
      break;
    case 3:
      freq = 1;
      df = 0.1;
      break;
    case 4:
      freq = 1;
      df = 0;
      break;
    case 5:
      freq = 0;
      df = 0.05;
      break;
    case 6:
      freq = -1;
      df = 0.05;
      break;
    case 7:
      (freq = 1), (df = -0.05);
  }
  k = (2 * numWP * Math.PI) / lambda;
  dk = 0.05 * k;
  k1 = k + dk;
  k2 = k - dk;
  f1 = freq + df;
  f2 = freq - df;
  phaseVel = freq / k;
  hwl = (0.5 * lambda) / numWP;
  groupVel = df / dk;
  frame = 0;
  calc();
}

function calc() {
  for (var a = 0; a < cw; a += 1) sy[a] = A * (Math.sin(f1 * frame - k1 * a) - Math.sin(f2 * frame - k2 * a));
}

function animate() {
  now = Date.now();
  delta = now - then;
  delta > interval && anim && (calc(), drawCanvas(), frame++, (then = now - (delta % interval)));
  requestAnimationFrame(animate);
}

function drawGrid() {
  ctxBG.clearRect(0, 0, cw, ch);
  ctxBG.beginPath();
  ctxBG.strokeStyle = "lightGray";
  ctxBG.lineWidth = 1;
  ctxBG.font = "18pt Calibri";
  ctxBG.textAlign = "center";
  ctxBG.fillStyle = "white";
  ctxBG.fillText(captions[index - 1], cw / 2, 24);
  for (var a = 1; 10 > a; a++) ctxBG.moveTo(a * gx, 0), ctxBG.lineTo(a * gx, ch);
  for (a = 1; 4 > a; a++) ctxBG.moveTo(0, a * gy), ctxBG.lineTo(cw, a * gy);
  ctxBG.stroke();
}

function drawCanvas() {
  ctx.clearRect(0, 0, cw, ch);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "white";
  ctx.beginPath();
  for (var a = 0; a < cw - 1; a++) ctx.moveTo(a, ch / 2 + sy[a]), ctx.lineTo(a, ch / 2 + sy[a + 1]);
  ctx.stroke();
  5 == index
    ? (ctx.beginPath(), (ctx.strokeStyle = "cyan"), ctx.moveTo(cw / 2 - hwl, ch / 4), ctx.lineTo(cw / 2 - hwl, (3 * ch) / 4 - 1), ctx.moveTo(cw / 2 + hwl, ch / 4), ctx.lineTo(cw / 2 + hwl, (3 * ch) / 4 - 1), ctx.stroke())
    : 4 == index &&
    (ctx.beginPath(),
      (ctx.fillStyle = "yellow"),
      ctx.arc(0, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1),
      ctx.arc(cw, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1),
      2 == numWP ? ctx.arc(cw / 2, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1) : 3 == numWP && (ctx.arc(cw / 3, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1), ctx.arc((2 * cw) / 3, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1)));
  ctx.fill();
  ctx.beginPath();
  ctx.strokeStyle = "white";
  xg = groupVel * frame;
  xg %= cw;
  0 > xg && (xg = cw + xg);
  0 == groupVel ? ((xg = cw / 2 + radiusGreenDot * hwl), (ctx.fillStyle = "yellow")) : (ctx.beginPath(), (ctx.fillStyle = "yellow"), ctx.arc(xg, ch / 2, radiusGreenDot, 0, 2 * Math.PI, !1), ctx.fill());
  ctx.beginPath();
  ctx.fill();
  xp = phaseVel * frame;
  xp %= cw;
  0 > xp && (xp = cw + xp);
  0 == phaseVel && (xp += cw / 2);
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.arc(xp, ch / 2, radiusRedDot, 0, 2 * Math.PI, !1);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(xp, ch / 2);
  ctx.lineTo(xp, ch / 2 + sy[xp]);
  ctx.stroke();
}

function changeIndex() {
  index = menu.selectedIndex + 1;
  calcConstants();
  frame = 0;
  anim = !0;
  btnSS.innerHTML = "Stop";
  btnSS.style.color = "black";
  drawGrid();
  animate();
}

function changeNP() {
  numWP = menuNP.selectedIndex + 1;
  calcConstants();
  frame = 0;
  anim = !0;
  btnSS.innerHTML = "Stop";
  btnSS.style.color = "black";
  animate();
}

function startStop() {
  (anim = !anim) ? ((btnSS.innerHTML = "Stop"), (btnSS.style.color = "black")) : ((btnSS.innerHTML = "Start"), (btnSS.style.color = "white"));
  animate();
}
