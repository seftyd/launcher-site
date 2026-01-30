(function () {
  if (document.getElementById("panel")) return;

  const d = document;
  let zCounter = 999999;

  /* STYLE */
  const s = d.createElement("style");
  s.textContent = `
  #panel{
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%) scale(.9);
    width:380px;height:520px;
    background:linear-gradient(135deg,#1a1124,#3a255a);
    color:#fff;border-radius:18px;
    display:flex;flex-direction:column;
    overflow:hidden;z-index:${zCounter};
    box-shadow:0 0 25px rgba(199,167,255,.35);
    animation:fadeIn .35s ease-out forwards;
    cursor:grab;
  }
  #panel:active{cursor:grabbing}

  @keyframes fadeIn{
    from{opacity:0;transform:translate(-50%,-50%) scale(.85)}
    to{opacity:1;transform:translate(-50%,-50%) scale(1)}
  }

  #head{
    background:rgba(0,0,0,.25);padding:12px;
    font-weight:600;display:flex;
    justify-content:space-between;align-items:center;
    user-select:none;
    border-bottom:1px solid rgba(255,255,255,.08);
  }

  #headLeft{display:flex;align-items:center;gap:8px}
  #tabManagerBtn{
    background:transparent;border:none;color:#fff;
    cursor:pointer;font-size:1rem;padding:2px 6px;
    border-radius:6px;transition:.2s;
  }
  #tabManagerBtn:hover{
    background:rgba(255,156,230,.18);
    box-shadow:0 0 8px rgba(255,156,230,.35);
  }

  #tabManagerMenu{
    position:absolute;top:40px;right:10px;
    background:rgba(15,10,30,.96);
    border-radius:10px;
    padding:8px 10px;
    border:1px solid rgba(255,156,230,.35);
    box-shadow:0 0 18px rgba(0,0,0,.6);
    font-size:.8rem;
    display:none;
    z-index:${zCounter + 1};
  }
  #tabManagerMenu label{
    display:flex;align-items:center;
    gap:6px;margin:4px 0;cursor:pointer;
  }
  #tabManagerMenu input{accent-color:#ff9ce6;}

  #tabs{display:flex;background:rgba(0,0,0,.2)}
  #tabs button{
    flex:1;padding:10px;background:transparent;
    color:#fff;border:none;cursor:pointer;
    transition:.2s;font-size:.9rem;
    position:relative;
  }
  #tabs button:hover{
    background:rgba(255,156,230,.12);
    transform:translateY(-2px);
  }
  #tabs button.active{
    border-bottom:2px solid #ff9ce6;
    box-shadow:0 0 8px rgba(255,156,230,.25);
  }

  .tab{
    flex:1;display:none;flex-direction:column;
    padding:12px;animation:slideIn .25s ease-out;
  }
  @keyframes slideIn{
    from{opacity:0;transform:translateY(10px)}
    to{opacity:1;transform:translateY(0)}
  }
  .tab.active{display:flex}

  select,input,button.action{
    padding:10px;border-radius:10px;
    border:1px solid rgba(255,156,230,.25);
    background:rgba(0,0,0,.25);color:#fff;
    margin-bottom:10px;font-size:.9rem;
    transition:.2s;
  }
  button.action:hover{
    background:rgba(255,156,230,.15);
    border-color:#ff9ce6;transform:scale(1.03);
    box-shadow:0 0 10px rgba(255,156,230,.25);
  }

  iframe{
    flex:1;border:none;background:#000;
    border-radius:10px;margin-top:10px;
  }

  #resizeHandle{
    position:absolute;width:16px;height:16px;
    bottom:6px;right:6px;border-radius:50%;
    background:#ff9ce6;opacity:.6;
    box-shadow:0 0 10px rgba(255,156,230,.4);
    cursor:se-resize;
  }
  #resizeHandle:hover{
    opacity:.9;box-shadow:0 0 14px rgba(255,156,230,.6);
  }

  .floatWindow{
    position:fixed;
    width:380px;height:520px;
    background:linear-gradient(135deg,#1a1124,#3a255a);
    color:#fff;border-radius:18px;
    display:flex;flex-direction:column;
    overflow:hidden;
    box-shadow:0 0 25px rgba(199,167,255,.35);
    z-index:${zCounter};
  }
  .floatHeader{
    background:rgba(0,0,0,.3);
    padding:8px 10px;
    display:flex;justify-content:space-between;
    align-items:center;font-size:.85rem;
    user-select:none;cursor:grab;
  }
  .floatHeaderBtns{
    display:flex;gap:6px;
  }
  .floatHeaderBtns button{
    background:rgba(0,0,0,.35);
    border:none;color:#fff;
    border-radius:6px;
    padding:2px 6px;
    cursor:pointer;font-size:.75rem;
    transition:.2s;
  }
  .floatHeaderBtns button:hover{
    background:rgba(255,156,230,.25);
    box-shadow:0 0 8px rgba(255,156,230,.35);
  }
  .floatBody{
    flex:1;display:flex;flex-direction:column;
    padding:10px;
  }
  `;
  d.head.appendChild(s);

  /* MAIN PANEL */
  const p = d.createElement("div");
  p.id = "panel";
  p.innerHTML = `
    <div id="head">
      <div id="headLeft">
        <span>Launcher</span>
      </div>
      <div>
        <button id="tabManagerBtn">☰</button>
        <button id="closeBtn">✕</button>
      </div>
      <div id="tabManagerMenu">
        <label><input type="checkbox" id="tmGames" checked> Games</label>
        <label><input type="checkbox" id="tmYt" checked> YouTube</label>
        <label><input type="checkbox" id="tmWeb" checked> Browser</label>
      </div>
    </div>

    <div id="tabs">
      <button data-tab="games" class="active">Games</button>
      <button data-tab="yt">YouTube</button>
      <button data-tab="web">Browser</button>
    </div>

    <div id="games" class="tab active">
      <select id="gameSelect">
        <option value="">— Select a game —</option>
        <option value="https://1v1.lol">🎯 1v1.lol</option>
        <option value="https://tetris-js.onrender.com">🧱 Tetris</option>
        <option value="https://cookieclickerclone.onrender.com">🍪 Cookie Clicker</option>
        <option value="https://flappybirdclone.onrender.com">🐦 Flappy Bird</option>
        <option value="https://play2048.onrender.com">🔢 2048</option>
        <option value="https://snakegamejs.onrender.com">🐍 Snake</option>
        <option value="https://browserfps.com/krunker">🔫 Krunker</option>
        <option value="https://paper-io.com">🧻 Paper.io</option>
        <option value="https://shellshockers.io">🥚 Shell Shockers</option>
        <option value="https://motox3m.co">🏍️ Moto X3M</option>
        <option value="https://drift-hunters.co">🚗 Drift Hunters</option>
        <option value="https://slopegame.onrender.com">🟩 Slope</option>
        <option value="https://run3game.onrender.com">🚀 Run 3</option>
        <option value="https://crossyroad.co">🐤 Crossy Road</option>
        <option value="https://geometrydashlite.onrender.com">🎵 Geometry Dash</option>
      </select>
      <button class="action" id="playGame">Play</button>
      <iframe id="gameFrame"></iframe>
    </div>

    <div id="yt" class="tab">
      <input id="ytSearch" placeholder="Search or paste YouTube link">
      <button class="action" id="ytBtn">Load</button>
      <iframe id="ytFrame"></iframe>
    </div>

    <div id="web" class="tab">
      <input id="webUrl" placeholder="Enter URL">
      <button class="action" id="webBtn">Go</button>
      <iframe id="webFrame"></iframe>
    </div>

    <div id="resizeHandle"></div>
  `;
  d.body.appendChild(p);

  const bringToFront = el => {
    zCounter++;
    el.style.zIndex = zCounter;
  };
  p.addEventListener("mousedown", () => bringToFront(p));

  /* CLOSE */
  d.getElementById("closeBtn").onclick = () => p.remove();

  /* TAB MANAGER */
  const tmBtn = d.getElementById("tabManagerBtn");
  const tmMenu = d.getElementById("tabManagerMenu");
  const tmGames = d.getElementById("tmGames");
  const tmYt = d.getElementById("tmYt");
  const tmWeb = d.getElementById("tmWeb");

  const tabButtons = p.querySelectorAll("#tabs button");
  const tabs = p.querySelectorAll(".tab");

  const tabMap = {
    games: {
      btn: p.querySelector('button[data-tab="games"]'),
      tab: d.getElementById("games"),
      checkbox: tmGames,
      float: null
    },
    yt: {
      btn: p.querySelector('button[data-tab="yt"]'),
      tab: d.getElementById("yt"),
      checkbox: tmYt,
      float: null
    },
    web: {
      btn: p.querySelector('button[data-tab="web"]'),
      tab: d.getElementById("web"),
      checkbox: tmWeb,
      float: null
    }
  };

  tmBtn.onclick = e => {
    e.stopPropagation();
    bringToFront(p);
    tmMenu.style.display = tmMenu.style.display === "block" ? "none" : "block";
  };

  d.addEventListener("click", e => {
    if (!tmMenu.contains(e.target) && e.target !== tmBtn) {
      tmMenu.style.display = "none";
    }
  });

  const applyTabVisibility = key => {
    const cfg = tabMap[key];
    const visible = cfg.checkbox.checked;
    cfg.btn.style.display = visible ? "" : "none";
    if (!visible) {
      cfg.tab.classList.remove("active");
      cfg.btn.classList.remove("active");
      if (cfg.float) cfg.float.style.display = "none";
    } else {
      if (!p.querySelector("#tabs button.active") && !cfg.float) {
        cfg.btn.classList.add("active");
        cfg.tab.classList.add("active");
      }
      if (cfg.float) cfg.float.style.display = "flex";
    }
  };

  tmGames.onchange = () => applyTabVisibility("games");
  tmYt.onchange = () => applyTabVisibility("yt");
  tmWeb.onchange = () => applyTabVisibility("web");

  /* TABS SWITCHING */
  const activateTab = key => {
    tabButtons.forEach(b => b.classList.remove("active"));
    tabs.forEach(t => t.classList.remove("active"));
    const cfg = tabMap[key];
    if (cfg && cfg.btn.style.display !== "none" && !cfg.float) {
      cfg.btn.classList.add("active");
      cfg.tab.classList.add("active");
    }
  };

  tabButtons.forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.tab;
      activateTab(key);
    };
  });

  /* DRAG + RESIZE MAIN PANEL */
  let dragging = false,
    resizing = false,
    x,
    y,
    w,
    h,
    targetX,
    targetY,
    targetW,
    targetH;
  let dragOX, dragOY, rsX, rsY, startW, startH;

  const rh = d.getElementById("resizeHandle");
  const r = p.getBoundingClientRect();

  x = targetX = r.left;
  y = targetY = r.top;
  w = targetW = r.width;
  h = targetH = r.height;

  p.style.left = x + "px";
  p.style.top = y + "px";
  p.style.width = w + "px";
  p.style.height = h + "px";

  p.onmousedown = e => {
    if (e.target === rh || e.target.closest("#head") || e.target.closest("#tabs")) return;
    dragging = true;
    bringToFront(p);
    dragOX = e.clientX - x;
    dragOY = e.clientY - y;
  };

  d.getElementById("head").onmousedown = e => {
    if (e.target === tmBtn || e.target.id === "closeBtn" || tmMenu.contains(e.target)) return;
    dragging = true;
    bringToFront(p);
    dragOX = e.clientX - x;
    dragOY = e.clientY - y;
  };

  rh.onmousedown = e => {
    e.stopPropagation();
    resizing = true;
    bringToFront(p);
    rsX = e.clientX;
    rsY = e.clientY;
    startW = w;
    startH = h;
  };

  d.onmousemove = e => {
    if (dragging) {
      targetX = e.clientX - dragOX;
      targetY = e.clientY - dragOY;
    }
    if (resizing) {
      targetW = Math.max(260, startW + (e.clientX - rsX));
      targetH = Math.max(260, startH + (e.clientY - rsY));
    }
  };

  d.onmouseup = () => {
    dragging = false;
    resizing = false;
    draggingTab = null;
  };

  (function anim() {
    const ease = 0.2;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    w += (targetW - w) * ease;
    h += (targetH - h) * ease;

    p.style.left = x + "px";
    p.style.top = y + "px";
    p.style.width = w + "px";
    p.style.height = h + "px";

    requestAnimationFrame(anim);
  })();

  /* DETACHABLE TABS (DRAG LABEL) */
  let draggingTab = null;
  let tabDragStartX = 0;
  let tabDragStartY = 0;
  const TAB_DETACH_THRESHOLD = 25;

  tabButtons.forEach(btn => {
    btn.addEventListener("mousedown", e => {
      if (e.button !== 0) return;
      const key = btn.dataset.tab;
      const cfg = tabMap[key];
      if (cfg.float) return; // already detached
      draggingTab = { key, btn, startX: e.clientX, startY: e.clientY };
    });
  });

  d.addEventListener("mousemove", e => {
    if (!draggingTab) return;
    const dx = e.clientX - draggingTab.startX;
    const dy = e.clientY - draggingTab.startY;
    if (Math.hypot(dx, dy) > TAB_DETACH_THRESHOLD) {
      detachTab(draggingTab.key, e.clientX, e.clientY);
      draggingTab = null;
    }
  });

  function detachTab(key, cx, cy) {
    const cfg = tabMap[key];
    if (!cfg || cfg.float) return;

    cfg.btn.classList.remove("active");
    cfg.tab.classList.remove("active");

    const float = d.createElement("div");
    float.className = "floatWindow";
    float.style.left = (cx - w / 2) + "px";
    float.style.top = (cy - 30) + "px";
    bringToFront(float);

    float.innerHTML = `
      <div class="floatHeader">
        <span>${cfg.btn.textContent}</span>
        <div class="floatHeaderBtns">
          <button class="snapBackBtn">⤺</button>
          <button class="closeFloatBtn">✕</button>
        </div>
      </div>
      <div class="floatBody"></div>
    `;

    const body = float.querySelector(".floatBody");
    body.appendChild(cfg.tab);
    cfg.float = float;

    d.body.appendChild(float);

    /* drag floating window */
    let fx = float.getBoundingClientRect().left;
    let fy = float.getBoundingClientRect().top;
    let fTargetX = fx;
    let fTargetY = fy;
    let fDragging = false;
    let fOX = 0, fOY = 0;

    const fHead = float.querySelector(".floatHeader");
    fHead.onmousedown = ev => {
      if (ev.button !== 0) return;
      fDragging = true;
      bringToFront(float);
      const rect = float.getBoundingClientRect();
      fx = rect.left;
      fy = rect.top;
      fTargetX = fx;
      fTargetY = fy;
      fOX = ev.clientX - fx;
      fOY = ev.clientY - fy;
      ev.stopPropagation();
    };

    d.addEventListener("mousemove", function moveFloat(ev) {
      if (!fDragging) return;
      fTargetX = ev.clientX - fOX;
      fTargetY = ev.clientY - fOY;
      float.style.left = fTargetX + "px";
      float.style.top = fTargetY + "px";
    });

    d.addEventListener("mouseup", function upFloat() {
      fDragging = false;
    });

    float.addEventListener("mousedown", () => bringToFront(float));

    /* close floating window */
    float.querySelector(".closeFloatBtn").onclick = () => {
      cfg.tab.remove(); // content gone
      float.remove();
      cfg.float = null;
    };

    /* snap back */
    float.querySelector(".snapBackBtn").onclick = () => {
      reattachTab(key);
    };
  }

  function reattachTab(key) {
    const cfg = tabMap[key];
    if (!cfg || !cfg.float) return;
    const float = cfg.float;
    const body = float.querySelector(".floatBody");

    p.insertBefore(cfg.tab, p.querySelector("#resizeHandle"));
    cfg.float.remove();
    cfg.float = null;

    if (cfg.checkbox.checked) {
      activateTab(key);
    }
  }

  /* ELEMENTS */
  const gs = d.getElementById("gameSelect"),
        gf = d.getElementById("gameFrame"),
        ys = d.getElementById("ytSearch"),
        yf = d.getElementById("ytFrame"),
        wu = d.getElementById("webUrl"),
        wf = d.getElementById("webFrame");

  /* GAMES */
  d.getElementById("playGame").onclick = () => {
    if (gs.value) gf.src = gs.value;
  };

  /* YOUTUBE */
  d.getElementById("ytBtn").onclick = () => {
    const q = ys.value.trim();
    if (!q) return;

    let id = "";
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      id = q.split("v=")[1] || q.split("/").pop();
      id = id.split("&")[0];
    } else {
      yf.src = "https://www.google.com/search?q=" + encodeURIComponent(q);
      return;
    }

    const popup = window.open("about:blank", "_blank");
    if (popup) popup.document.title = "";

    yf.src = "https://www.youtube.com/embed/" + id;

    setTimeout(() => {
      if (popup && popup.location) {
        popup.location.href = "https://www.youtube.com/watch?v=" + id;
      }
    }, 1200);
  };

  /* BROWSER — POPUP ONLY */
  d.getElementById("webBtn").onclick = () => {
    let q = wu.value.trim();
    if (!q) return;

    const isURL =
      q.startsWith("http://") ||
      q.startsWith("https://") ||
      (q.includes(".") && !q.includes(" "));

    if (!isURL) {
      q = "https://www.google.com/search?q=" + encodeURIComponent(q);
    } else if (!q.startsWith("http")) {
      q = "https://" + q;
    }

    wf.src = "about:blank";

    const popup = window.open("about:blank", "_blank");
    if (popup) popup.document.title = "";

    setTimeout(() => {
      if (popup && popup.location) {
        popup.location.href = q;
      }
    }, 200);
  };

  /* initial visibility sync */
  applyTabVisibility("games");
  applyTabVisibility("yt");
  applyTabVisibility("web");
})();
