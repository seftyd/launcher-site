/* FULL LAUNCHER SCRIPT */
(function(){
  if (document.getElementById("panel")) return;

  const d = document;

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
    overflow:hidden;z-index:999999;
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

  #tabs{display:flex;background:rgba(0,0,0,.2)}
  #tabs button{
    flex:1;padding:10px;background:transparent;
    color:#fff;border:none;cursor:pointer;
    transition:.2s;font-size:.9rem;
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
  `;
  d.head.appendChild(s);

  /* PANEL */
  const p = d.createElement("div");
  p.id = "panel";

  p.innerHTML = `
  <div id="head"><span>Launcher</span><button id="closeBtn">✕</button></div>

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

  /* ⭐ DRAG ANYWHERE + RESIZE ⭐ */
  let dragging=false,resizing=false,x,y,w,h,targetX,targetY,targetW,targetH;
  let dragOX,dragOY,rsX,rsY,startW,startH;

  const rh = d.getElementById("resizeHandle");
  const r = p.getBoundingClientRect();

  x = targetX = r.left;
  y = targetY = r.top;
  w = targetW = r.width;
  h = targetH = r.height;

  p.style.left = x+"px";
  p.style.top = y+"px";
  p.style.width = w+"px";
  p.style.height = h+"px";

  /* DRAG FROM ANYWHERE */
  p.onmousedown = e => {
    if (e.target === rh) return;
    dragging = true;
    dragOX = e.clientX - x;
    dragOY = e.clientY - y;
  };

  /* RESIZE HANDLE */
  rh.onmousedown = e => {
    e.stopPropagation();
    resizing = true;
    rsX = e.clientX;
    rsY = e.clientY;
    startW = w;
    startH = h;
  };

  d.onmousemove = e => {
    if (dragging){
      targetX = e.clientX - dragOX;
      targetY = e.clientY - dragOY;
    }
    if (resizing){
      targetW = Math.max(260, startW + (e.clientX - rsX));
      targetH = Math.max(260, startH + (e.clientY - rsY));
    }
  };

  d.onmouseup = () => {
    dragging = false;
    resizing = false;
  };

  /* SMOOTH ANIMATION */
  (function anim(){
    const ease = .2;
    x += (targetX - x) * ease;
    y += (targetY - y) * ease;
    w += (targetW - w) * ease;
    h += (targetH - h) * ease;

    p.style.left = x+"px";
    p.style.top = y+"px";
    p.style.width = w+"px";
    p.style.height = h+"px";

    requestAnimationFrame(anim);
  })();

  /* GAME LOGIC */
  const gs=d.getElementById("gameSelect"),
        gf=d.getElementById("gameFrame"),
        ys=d.getElementById("ytSearch"),
        yf=d.getElementById("ytFrame"),
        wu=d.getElementById("webUrl"),
        wf=d.getElementById("webFrame");

  d.getElementById("playGame").onclick=()=>{ if(gs.value) gf.src=gs.value };

  /* ⭐ SUPER YOUTUBE LOADER — ALL FALLBACKS + INSTANT POPUP ⭐ */
  d.getElementById("ytBtn").onclick = () => {
    const q = ys.value.trim();
    if (!q) return;

    let id = "";

    // Extract video ID
    if (q.includes("youtube.com") || q.includes("youtu.be")) {
      id = q.split("v=")[1] || q.split("/").pop();
      id = id.split("&")[0];
    } else {
      // Search mode → use Piped search
      yf.src = "https://piped.video/search?q=" + encodeURIComponent(q);
      return;
    }

    /* ⭐ Open disguised blank popup IMMEDIATELY ⭐ */
    const popup = window.open("about:blank", "_blank");
    if (popup) {
      popup.document.title = "";
    }

    /* 1️⃣ Try YouTube embed */
    yf.src = "https://www.youtube.com/embed/" + id;

    /* 2️⃣ Try Invidious embed */
    setTimeout(() => {
      if (yf.contentWindow == null) {
        yf.src = "https://inv.nadeko.net/embed/" + id;
      }
    }, 800);

    /* 3️⃣ Try Piped embed */
    setTimeout(() => {
      if (yf.contentWindow == null) {
        yf.src = "https://piped.video/embed/" + id;
      }
    }, 1600);

    /* 4️⃣ Try full proxied page */
    setTimeout(() => {
      if (yf.contentWindow == null) {
        yf.src = "https://piped.video/watch?v=" + id;
      }
    }, 2400);

    /* 5️⃣ Final fallback — load video into the popup */
    setTimeout(() => {
      if (popup && popup.location) {
        popup.location.href = "https://piped.video/watch?v=" + id;
      }
    }, 3000);
  };

/* ⭐ BROWSER — POPUP-ONLY MODE (CHROMEBOOK SAFE) ⭐ */
d.getElementById("webBtn").onclick = () => {
  let q = wu.value.trim();
  if (!q) return;

  /* Detect if input is a real URL */
  const isURL = q.startsWith("http://") ||
                q.startsWith("https://") ||
                (q.includes(".") && !q.includes(" "));

  /* If not a URL → Google search */
  if (!isURL) {
    q = "https://www.google.com/search?q=" + encodeURIComponent(q);
  } else if (!q.startsWith("http")) {
    q = "https://" + q;
  }

  /* ⭐ Open blank popup IMMEDIATELY ⭐ */
  const popup = window.open("about:blank", "_blank");
  if (popup) popup.document.title = "";

  /* ⭐ Load ONLY in popup — iframe is ignored ⭐ */
  if (popup && popup.location) {
    popup.location.href = q;
  }

  /* Clear iframe so it doesn't show errors */
  wf.src = "about:blank";
};


})();






