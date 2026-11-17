export function buildDemoPreviewHtml(deviceId: string, version = 1): string {
  const safeDeviceId = JSON.stringify(deviceId);

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>نموذج متجاوب تفاعلي — مِرآة الشاشات</title>
  <style>
    :root {
      --bg: #ffffff;
      --surface: #f8fafc;
      --border: #e2e8f0;
      --text: #0f172a;
      --muted: #475569;
      --accent: #2563eb;
      --accent-hover: #1d4ed8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      font-family: "IBM Plex Sans Arabic", system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }
    .container {
      width: 100%;
      max-width: 1120px;
      margin: 0 auto;
      padding: 0 20px;
    }
    header {
      position: sticky;
      top: 0;
      z-index: 20;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      border-bottom: 1px solid var(--border);
    }
    .nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      gap: 16px;
    }
    .brand {
      font-weight: 700;
      font-size: 18px;
      letter-spacing: -0.01em;
      white-space: nowrap;
    }
    .nav-links {
      display: none;
      align-items: center;
      gap: 24px;
      font-size: 14px;
      color: var(--muted);
    }
    .nav-links a {
      color: inherit;
      text-decoration: none;
      white-space: nowrap;
    }
    .nav-links a:hover { color: var(--text); }
    .btn-primary {
      background: var(--accent);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      padding: 9px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
    }
    .btn-primary:hover { background: var(--accent-hover); }
    .menu-toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--border);
      background: var(--bg);
      border-radius: 8px;
      padding: 6px 10px;
      font-size: 13px;
      cursor: pointer;
      color: var(--text);
    }
    .mobile-drawer {
      display: none;
      border-top: 1px solid var(--border);
      padding: 12px 20px 16px;
      background: var(--bg);
    }
    .mobile-drawer.open { display: grid; gap: 10px; }
    .mobile-drawer a {
      color: var(--text);
      text-decoration: none;
      font-size: 14px;
      padding: 6px 0;
    }
    .hero {
      padding: 48px 0 40px;
      display: grid;
      grid-template-columns: 1fr;
      gap: 28px;
      align-items: center;
    }
    .hero h1 {
      margin: 0 0 14px;
      font-size: clamp(26px, 4vw, 44px);
      line-height: 1.2;
      font-weight: 700;
    }
    .hero p {
      margin: 0 0 22px;
      color: var(--muted);
      font-size: 16px;
      max-width: 54ch;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .btn-secondary {
      background: var(--surface);
      color: var(--text);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 9px 18px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .viewport-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px;
    }
    .metric-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin-top: 12px;
    }
    .metric-box {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px;
    }
    .metric-label { font-size: 12px; color: var(--muted); }
    .metric-val {
      font-family: monospace;
      font-size: 18px;
      font-weight: 700;
      margin-top: 4px;
      direction: ltr;
      text-align: right;
    }
    .section {
      padding: 36px 0 56px;
      border-top: 1px solid var(--border);
    }
    .section-head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 24px;
    }
    .section-head h2 {
      margin: 0;
      font-size: 22px;
      font-weight: 700;
    }
    .tabs {
      display: inline-flex;
      background: var(--surface);
      border: 1px solid var(--border);
      padding: 4px;
      border-radius: 8px;
      gap: 4px;
    }
    .tab-btn {
      border: none;
      background: transparent;
      color: var(--muted);
      padding: 6px 12px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 6px;
      cursor: pointer;
    }
    .tab-btn.active {
      background: var(--bg);
      color: var(--text);
      box-shadow: 0 1px 2px rgba(0,0,0,0.06);
    }
    .cards-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }
    .feature-card {
      background: var(--bg);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
    }
    .feature-card h3 {
      margin: 0 0 8px;
      font-size: 16px;
      font-weight: 700;
    }
    .feature-card p {
      margin: 0;
      font-size: 14px;
      color: var(--muted);
    }
    .card-meta {
      margin-top: 14px;
      padding-top: 12px;
      border-top: 1px solid var(--border);
      font-size: 12px;
      color: var(--muted);
      display: flex;
      justify-content: space-between;
    }
    footer {
      border-top: 1px solid var(--border);
      padding: 24px 0;
      font-size: 13px;
      color: var(--muted);
    }
    @media (min-width: 640px) {
      .cards-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (min-width: 768px) {
      .nav-links { display: flex; }
      .menu-toggle { display: none; }
      .mobile-drawer.open { display: none; }
      .hero { grid-template-columns: 1.15fr 0.85fr; padding: 64px 0; }
    }
    @media (min-width: 1024px) {
      .cards-grid { grid-template-columns: repeat(3, 1fr); }
    }
  </style>
</head>
<body>
  <header>
    <div class="container nav-row">
      <div class="brand">استوديو المعمار الرقمي</div>
      <nav class="nav-links">
        <a href="#overview">نظرة عامة</a>
        <a href="#grid">الشبكة المرنة</a>
        <a href="#metrics">القياسات</a>
      </nav>
      <div style="display:flex;align-items:center;gap:8px;">
        <button class="btn-primary" onclick="alertAction()">جرّب التفاعل</button>
        <button class="menu-toggle" id="menuBtn" aria-label="القائمة">القائمة</button>
      </div>
    </div>
    <div class="mobile-drawer" id="mobileDrawer">
      <a href="#overview">نظرة عامة</a>
      <a href="#grid">الشبكة المرنة</a>
      <a href="#metrics">القياسات</a>
    </div>
  </header>

  <main class="container">
    <section class="hero" id="overview">
      <div>
        <h1>تصميم يتكيّف بدقة مع كل شاشة من الجوال حتى سطح المكتب</h1>
        <p>هذه الصفحة التجريبية التفاعلية مدمجة لاختبار استجابة الشبكات، تباين الخطوط، وتحوّل القائمة العلوية بين العرض الضيق والعرض الواسع مباشرة.</p>
        <div class="hero-actions">
          <button class="btn-primary" onclick="switchTab('all')">عرض جميع الوحدات</button>
          <button class="btn-secondary" onclick="switchTab('mobile')">تصفية للجوال</button>
        </div>
      </div>

      <div class="viewport-card" id="metrics">
        <div style="font-size:13px;font-weight:700;">قراءة الإطار الحالي داخل هذا الجهاز</div>
        <div class="metric-row">
          <div class="metric-box">
            <div class="metric-label">عرض النافذة</div>
            <div class="metric-val" id="vpWidth">--</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">نقطة التوقف</div>
            <div class="metric-val" id="vpBp">--</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">ارتفاع النافذة</div>
            <div class="metric-val" id="vpHeight">--</div>
          </div>
          <div class="metric-box">
            <div class="metric-label">نسبة البكسل</div>
            <div class="metric-val" id="vpDpr">--</div>
          </div>
        </div>
      </div>
    </section>

    <section class="section" id="grid">
      <div class="section-head">
        <h2>نماذج البطاقات المتجاوبة</h2>
        <div class="tabs" role="tablist">
          <button class="tab-btn active" data-filter="all" onclick="switchTab('all')">الكل</button>
          <button class="tab-btn" data-filter="layout" onclick="switchTab('layout')">التخطيط</button>
          <button class="tab-btn" data-filter="typography" onclick="switchTab('typography')">الخطوط</button>
        </div>
      </div>

      <div class="cards-grid" id="cardsGrid">
        <article class="feature-card" data-cat="layout">
          <h3>شبكة أعمدة تلقائية</h3>
          <p>تتحول البطاقات من عمود واحد على الهواتف إلى عمودين على الأجهزة اللوحية وثلاثة أعمدة على الشاشات المكتبية.</p>
          <div class="card-meta"><span>التخطيط المرن</span><span>CSS Grid</span></div>
        </article>
        <article class="feature-card" data-cat="typography">
          <h3>مقياس خط متدرج</h3>
          <p>استخدام دالة clamp يضمن توازن العناوين الكبيرة على سطح المكتب وبقائها مريحة للعين في الشاشات الصغيرة.</p>
          <div class="card-meta"><span>الخطوط</span><span>Fluid Type</span></div>
        </article>
        <article class="feature-card" data-cat="layout">
          <h3>تكيّف شريط التنقل</h3>
          <p>تنكمش الروابط العلوية تلقائياً إلى زر قائمة جانبية عند انخفاض العرض دون أي تداخل أو قصّ للنصوص.</p>
          <div class="card-meta"><span>التنقل</span><span>768px Breakpoint</span></div>
        </article>
        <article class="feature-card" data-cat="typography">
          <h3>دعم الاتجاه العربي الكامل</h3>
          <p>ترتيب العناصر والتباعدات والقوائم يتبع اتجاه RTL بدقة مع محاذاة الأرقام التقنية بوضوح.</p>
          <div class="card-meta"><span>اتجاه النص</span><span>RTL Ready</span></div>
        </article>
        <article class="feature-card" data-cat="layout">
          <h3>مزامنة التمرير الحية</h3>
          <p>فعّل زر مزامنة التمرير من الشريط العلوي لتتحرك جميع الشاشات معاً أثناء التصفح والمقارنة.</p>
          <div class="card-meta"><span>التفاعل</span><span>Sync Scroll</span></div>
        </article>
        <article class="feature-card" data-cat="typography">
          <h3>جاهز للتعديل الفوري</h3>
          <p>انتقل إلى تبويب محرر الكود الحي لتجربة تعديل HTML و CSS ومشاهدة النتيجة على كافة الأجهزة فوراً.</p>
          <div class="card-meta"><span>العرض الحي</span><span>Live Edit</span></div>
        </article>
      </div>
    </section>
  </main>

  <footer>
    <div class="container" style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <span>صفحة معاينة تفاعلية مدمجة</span>
      <span id="footerStatus">جاهز للاختبار</span>
    </div>
  </footer>

  <script>
    function updateViewportMetrics() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      var bp = 'xs (<640px)';
      if (w >= 1280) bp = 'xl (>=1280px)';
      else if (w >= 1024) bp = 'lg (>=1024px)';
      else if (w >= 768) bp = 'md (>=768px)';
      else if (w >= 640) bp = 'sm (>=640px)';
      document.getElementById('vpWidth').textContent = w + 'px';
      document.getElementById('vpHeight').textContent = h + 'px';
      document.getElementById('vpBp').textContent = bp;
      document.getElementById('vpDpr').textContent = (window.devicePixelRatio || 1) + 'x';
    }
    window.addEventListener('resize', updateViewportMetrics);
    updateViewportMetrics();

    document.getElementById('menuBtn').addEventListener('click', function() {
      document.getElementById('mobileDrawer').classList.toggle('open');
    });

    function switchTab(cat) {
      var btns = document.querySelectorAll('.tab-btn');
      btns.forEach(function(b) {
        b.classList.toggle('active', b.getAttribute('data-filter') === cat);
      });
      var cards = document.querySelectorAll('#cardsGrid .feature-card');
      cards.forEach(function(c) {
        if (cat === 'all' || cat === 'mobile') {
          c.style.display = 'block';
        } else {
          c.style.display = c.getAttribute('data-cat') === cat ? 'block' : 'none';
        }
      });
      document.getElementById('footerStatus').textContent = 'التصفية النشطة: ' + cat;
    }

    function alertAction() {
      var el = document.getElementById('footerStatus');
      el.textContent = 'تم اختبار التفاعل على عرض ' + window.innerWidth + 'px';
      document.getElementById('grid').scrollIntoView({ behavior: 'smooth' });
    }
  </script>
  <script data-mirror-bridge="true">
  (function() {
    var DEVICE_ID = ${safeDeviceId};
    var isSyncingScroll = false;
    var scrollTimer = null;
    window.addEventListener('scroll', function() {
      if (isSyncingScroll) return;
      var doc = document.documentElement;
      var body = document.body;
      var maxY = Math.max(1, (doc.scrollHeight || body.scrollHeight) - window.innerHeight);
      var maxX = Math.max(1, (doc.scrollWidth || body.scrollWidth) - window.innerWidth);
      try {
        window.parent.postMessage({
          type: 'mirror-scroll',
          deviceId: DEVICE_ID,
          ratioY: Math.min(1, Math.max(0, window.scrollY / maxY)),
          ratioX: Math.min(1, Math.max(0, window.scrollX / maxX))
        }, '*');
      } catch (e) {}
    }, { passive: true });
    window.addEventListener('message', function(event) {
      var data = event.data;
      if (!data || data.type !== 'mirror-sync-scroll' || data.sourceDeviceId === DEVICE_ID) return;
      isSyncingScroll = true;
      var doc = document.documentElement;
      var body = document.body;
      var maxY = Math.max(0, (doc.scrollHeight || body.scrollHeight) - window.innerHeight);
      var maxX = Math.max(0, (doc.scrollWidth || body.scrollWidth) - window.innerWidth);
      window.scrollTo({
        top: Math.round((data.ratioY || 0) * maxY),
        left: Math.round((data.ratioX || 0) * maxX),
        behavior: 'auto'
      });
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(function() { isSyncingScroll = false; }, 60);
    });
  })();
  </script>
  <!-- v:${version} -->
</body>
</html>`;
}
