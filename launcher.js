(function () {
  if (document.getElementById("panel")) return;

  const d = document;
  let zCounter = 999999;

  /* STYLE */
  const s = d.createElement("style");
  s.textContent = `
  #panel{
    position:fixed;top:50%;left:50%;
    transform:translate(-50%,-50%);
    width:380px;height:520px;
    background:linear-gradient(135deg,#1a1124,#3a255a);
    color:#fff;border-radius:18px;
    display:flex;flex-direction:column;
    overflow:hidden;z-index:${zCounter};
    box-shadow:0 0 25px rgba(199,167,255,.35);
    animation:fadeIn .25s ease-out forwards;
  }
  @keyframes fadeIn{
    from{opacity:0;transform:translate(-50%,-50%) scale(.9);opacity:0}
    to{opacity:1;transform:translate(-50%,-50%) scale(1);opacity:1}
  }

  #head{
    background:rgba(0,0,0,.25);padding:10px 12px;
    font-weight:600;display:flex;
    justify-content:space-between;align-items:center;
    user-select:none;cursor:grab;
    border-bottom:1px solid rgba(255,255,255,.08);
  }
  #head span{pointer-events:none;}

  #closeBtn{
    background:transparent;border:none;color:#fff;
    cursor:pointer;font-size:.9rem;
    padding:2px 6px;border-radius:6px;
    transition:.2s;
  }
  #closeBtn:hover{
    background:rgba(255,156,230,.25);
    box-shadow:0 0 8px rgba(255,156,230,.35);
  }

  #tabs{display:flex;background:rgba(0,0,0,.2);user-select:none;}
  #tabs button{
    flex:1;padding:9px;background:transparent;
    color:#fff;border:none;cursor:pointer;
    transition:.2s;font-size:.85rem;
  }
  #tabs button:hover{
    background:rgba(255,156,230,.12);
    transform:translateY(-1px);
  }
  #tabs button.active{
    border-bottom:2px solid #ff9ce6;
    box-shadow:0 0 8px rgba(255,156,230,.25);
  }

  .tab{
    flex:1;display:none;flex-direction:column;
    padding:10px;animation:slideIn .2s ease-out;
  }
  @keyframes slideIn{
    from{opacity:0;transform:translateY(8px)}
    to{opacity:1;transform:translateY(0)}
  }
  .tab.active{display:flex}

  select,input,button.action{
    padding:9px;border-radius:10px;
    border:1px solid rgba(255,156,230,.25);
    background:rgba(0,0,0,.25);color:#fff;
    margin-bottom:8px;font-size:.85rem;
    transition:.2s;
  }
  button.action{
    cursor:pointer;
  }
  button.action:hover{
    background:rgba(255,156,230,.15);
    border-color:#ff9ce6;transform:scale(1.02);
    box-shadow:0 0 10px rgba(255,156,230,.25);
  }

  iframe{
    flex:1;border:none;background:#000;
    border-radius:10px;margin-top:6px;
  }

  /* drag from edges */
  #panelEdgeTop,
  #panelEdgeBottom,
  #panelEdgeLeft,
  #panelEdgeRight{
    position:absolute;z-index:${zCounter + 1};
  }
  #panelEdgeTop,
  #panelEdgeBottom{
    left:0;right:0;height:10px;cursor:grab;
  }
  #panelEdgeTop{top:0;}
  #panelEdgeBottom{bottom:0;}
  #panelEdgeLeft,
  #panelEdgeRight{
    top:0;bottom:0;width:10px;cursor:grab;
  }
  #panelEdgeLeft{left:0;}
  #panelEdgeRight{right:0;}
  `;
  d.head.appendChild(s);

  /* PANEL */
  const p = d.createElement("div");
  p.id = "panel";
  p.innerHTML = `
    <div id="head">
      <span>Launcher</span>
      <button id="closeBtn">✕</button>
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

    <div id="panelEdgeTop"></div>
    <div id="panelEdgeBottom"></div>
    <div id="panelEdgeLeft"></div>
    <div id="panelEdgeRight"></div>
  `;
  d.body.appendChild(p);

  const bringToFront = el => {
    zCounter++;
    el.style.zIndex = zCounter;
  };
  p.addEventListener("mousedown", () => bringToFront(p));

  /* CLOSE */
  d.getElementById("closeBtn").onclick = () => p.remove();

  /* TABS */
  const tabButtons = p.querySelectorAll("#tabs button");
  const tabs = p.querySelectorAll(".tab");

  tabButtons.forEach(btn => {
    btn.onclick = () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      tabs.forEach(t => t.classList.remove("active"));
      btn.classList.add("active");
      p.querySelector("#" + btn.dataset.tab).classList.add("active");
    };
  });

  /* DRAG FROM HEADER + EDGES ONLY */
  let dragging = false;
  let startX = 0, startY = 0;
  let panelX = window.innerWidth / 2 - 190;
  let panelY = window.innerHeight / 2 - 260;

  const setPanelPos = () => {
    p.style.left = panelX + "px";
    p.style.top = panelY + "px";
  };
  setPanelPos();

  const startDrag = e => {
    dragging = true;
    bringToFront(p);
    startX = e.clientX - panelX;
    startY = e.clientY - panelY;
    e.preventDefault();
  };

  d.getElementById("head").addEventListener("mousedown", startDrag);
  d.getElementById("panelEdgeTop").addEventListener("mousedown", startDrag);
  d.getElementById("panelEdgeBottom").addEventListener("mousedown", startDrag);
  d.getElementById("panelEdgeLeft").addEventListener("mousedown", startDrag);
  d.getElementById("panelEdgeRight").addEventListener("mousedown", startDrag);

  d.addEventListener("mousemove", e => {
    if (!dragging) return;
    panelX = e.clientX - startX;
    panelY = e.clientY - startY;
    setPanelPos();
  });

  d.addEventListener("mouseup", () => {
    dragging = false;
  });

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
})();
