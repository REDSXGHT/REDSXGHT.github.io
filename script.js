(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Typing effect
  var lines = [
    "Active Directory attack paths, from foothold to domain admin.",
    "Red team engagements that test detection and response.",
    "OT / ICS assessments across industrial plant sites.",
    "Reports that engineers can actually remediate from."
  ];
  var el = document.getElementById("typed");
  var box = el.parentNode;
  var noise = "!-_/\\[]{}=+*^?#01$%";

  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // Human-like typing with slightly uneven key timing
  async function typeLine(text) {
    for (var i = 1; i <= text.length; i++) {
      el.textContent = text.slice(0, i);
      await sleep(28 + Math.random() * 50 + (text[i - 1] === " " ? 30 : 0));
    }
  }

  // Backspace the current line
  async function eraseLine() {
    var t = el.textContent;
    while (t.length) {
      t = t.slice(0, -1);
      el.textContent = t;
      await sleep(14);
    }
  }

  // Scramble the current line into the next one, letter by letter
  async function morph(to) {
    var from = el.textContent, len = Math.max(from.length, to.length), cells = [], frames = 46;
    for (var i = 0; i < len; i++) {
      var start = Math.floor(Math.random() * 18);
      cells.push({ start: start, end: start + 8 + Math.floor(Math.random() * 18) });
    }
    box.classList.add("glitch");
    for (var f = 0; f <= frames; f++) {
      var out = "";
      for (var j = 0; j < len; j++) {
        var c = cells[j];
        if (f >= c.end) out += to[j] || "";
        else if (f >= c.start) out += '<span class="scr">' + noise[Math.floor(Math.random() * noise.length)] + "</span>";
        else out += from[j] || "";
      }
      el.innerHTML = out;
      await sleep(32);
    }
    box.classList.remove("glitch");
    el.textContent = to;
  }

  // Alternate between two effects: scramble-morph, then backspace-and-retype
  async function run() {
    var i = 0, n = 0;
    await typeLine(lines[0]);
    while (true) {
      await sleep(2000);
      var next = lines[(i + 1) % lines.length];
      if (n % 2 === 0) {
        await morph(next);
      } else {
        await eraseLine();
        await sleep(250);
        await typeLine(next);
      }
      i = (i + 1) % lines.length;
      n++;
    }
  }

  // Typing and text changes always run; only the shaky glitch and the
  // background rain are switched off for reduced-motion users (see CSS / below).
  run();

  // Count-up stats
  function countUp(node) {
    var target = +node.dataset.count, suffix = node.dataset.suffix || "";
    if (reduce) { node.textContent = target + suffix; return; }
    var start = null, dur = 1200;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1);
      node.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Scroll reveal
  var targets = document.querySelectorAll(".section, .stat, .card, .cert, .job");
  targets.forEach(function (t) { t.classList.add("reveal"); });
  var counted = false;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      if (e.target.classList.contains("stat") && !counted) {
        counted = true;
        document.querySelectorAll(".num").forEach(countUp);
      }
      io.unobserve(e.target);
    });
  }, { threshold: 0.12 });
  targets.forEach(function (t) { io.observe(t); });

  // Matrix-style background
  if (reduce) return;
  var c = document.getElementById("matrix"), ctx = c.getContext("2d");
  var chars = "01<>/{}[]$#@%&*ABCDEF".split(""), size = 16, drops = [];
  function resize() {
    c.width = window.innerWidth; c.height = window.innerHeight;
    drops = new Array(Math.floor(c.width / size)).fill(0).map(function () {
      return Math.random() * c.height / size;
    });
  }
  resize();
  window.addEventListener("resize", resize);
  setInterval(function () {
    ctx.fillStyle = "rgba(7,11,10,0.08)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#2dff9a";
    ctx.font = size + "px monospace";
    drops.forEach(function (y, i) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
      drops[i] = (y * size > c.height && Math.random() > 0.975) ? 0 : y + 1;
    });
  }, 70);
})();
