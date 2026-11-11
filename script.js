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
  var li = 0, ci = 0, deleting = false;
  function tick() {
    var full = lines[li];
    if (reduce) { el.textContent = full; return; }
    el.textContent = full.slice(0, ci);
    if (!deleting && ci < full.length) { ci++; return setTimeout(tick, 38); }
    if (!deleting) { deleting = true; return setTimeout(tick, 1600); }
    if (ci > 0) { ci--; return setTimeout(tick, 16); }
    deleting = false; li = (li + 1) % lines.length;
    setTimeout(tick, 350);
  }
  tick();

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
