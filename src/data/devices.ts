import { CodeTemplate, DeviceCategory, DevicePreset } from '../types/preview';

export const DEFAULT_DEVICES: DevicePreset[] = [
  {
    id: 'iphone-16-pro',
    name: 'iPhone 16 Pro',
    width: 393,
    height: 852,
    dpr: 3,
    category: DeviceCategory.Mobile,
    visible: true,
  },
  {
    id: 'galaxy-s24',
    name: 'Galaxy S24',
    width: 360,
    height: 780,
    dpr: 3,
    category: DeviceCategory.Mobile,
    visible: false,
  },
  {
    id: 'iphone-se',
    name: 'iPhone SE',
    width: 375,
    height: 667,
    dpr: 2,
    category: DeviceCategory.Mobile,
    visible: false,
  },
  {
    id: 'ipad-mini',
    name: 'iPad Mini',
    width: 768,
    height: 1024,
    dpr: 2,
    category: DeviceCategory.Tablet,
    visible: true,
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro 12.9',
    width: 1024,
    height: 1366,
    dpr: 2,
    category: DeviceCategory.Tablet,
    visible: false,
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air 13',
    width: 1280,
    height: 800,
    dpr: 2,
    category: DeviceCategory.Desktop,
    visible: false,
  },
  {
    id: 'desktop-1440',
    name: 'Desktop Standard',
    width: 1440,
    height: 900,
    dpr: 1,
    category: DeviceCategory.Desktop,
    visible: true,
  },
  {
    id: 'desktop-fhd',
    name: 'Full HD 1080p',
    width: 1920,
    height: 1080,
    dpr: 1,
    category: DeviceCategory.Desktop,
    visible: false,
  },
];

export const QUICK_SAMPLE_URLS = [
  { label: 'مثال ويكيبيديا العربية', url: 'https://ar.wikipedia.org' },
  { label: 'Example.com', url: 'https://example.com' },
  { label: 'MDN Web Docs', url: 'https://developer.mozilla.org' },
  { label: 'Tailwind CSS', url: 'https://tailwindcss.com' },
];

export const LIVE_CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: 'landing-arabic',
    name: 'صفحة هبوط متجاوبة',
    description: 'تصميم عربي متجاوب بشبكة مرنة وقائمة علوية تتكيف مع العرض.',
    html: `<header class="topbar">
  <div class="brand">منصة أفق</div>
  <nav class="links">
    <a href="#features">المزايا</a>
    <a href="#pricing">الباقات</a>
    <a href="#faq">الأسئلة</a>
  </nav>
  <button class="cta" id="ctaBtn">ابدأ الآن</button>
</header>

<main class="wrap">
  <section class="hero">
    <h1>واجهة عربية تنساب بسلاسة على جميع المقاسات</h1>
    <p>عدّل أي سطر في HTML أو CSS وشاهد التغيير يظهر فوراً على الجوال والتابلت وسطح المكتب في نفس اللحظة.</p>
    <div class="actions">
      <button class="cta" onclick="incrementClicks()">تجربة التفاعل (<span id="counter">0</span>)</button>
    </div>
  </section>

  <section class="grid" id="features">
    <article class="card">
      <h3>تجاوب فوري</h3>
      <p>تتحول الشبكة تلقائياً من عمود واحد إلى ثلاثة أعمدة حسب عرض الشاشة.</p>
    </article>
    <article class="card">
      <h3>خطوط واضحة</h3>
      <p>أحجام الخطوط تتناسب مع حجم كل جهاز لضمان أقصى درجات القراءة.</p>
    </article>
    <article class="card">
      <h3>دعم كامل للاتجاه</h3>
      <p>توزيع متوازن للعناصر بالاتجاه من اليمين إلى اليسار.</p>
    </article>
  </section>
</main>`,
    css: `* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #f8fafc;
  color: #0f172a;
  direction: rtl;
}
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
}
.brand { font-weight: 700; font-size: 16px; }
.links { display: none; gap: 20px; font-size: 14px; color: #475569; }
.links a { color: inherit; text-decoration: none; }
.cta {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-weight: 600;
  cursor: pointer;
}
.wrap { max-width: 1040px; margin: 0 auto; padding: 32px 20px; }
.hero { margin-bottom: 32px; }
.hero h1 { font-size: clamp(24px, 4vw, 40px); margin: 0 0 12px; line-height: 1.25; }
.hero p { color: #475569; max-width: 55ch; margin: 0 0 20px; line-height: 1.7; }
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 20px;
}
.card h3 { margin: 0 0 8px; font-size: 16px; }
.card p { margin: 0; font-size: 14px; color: #475569; line-height: 1.6; }

@media (min-width: 640px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 768px) {
  .links { display: flex; }
}
@media (min-width: 1024px) {
  .grid { grid-template-columns: repeat(3, 1fr); }
}`,
    js: `let count = 0;
function incrementClicks() {
  count += 1;
  document.getElementById('counter').textContent = String(count);
}`,
  },
  {
    id: 'product-grid',
    name: 'شبكة متجر إلكتروني',
    description: 'معرض منتجات متجاوب يوضح انتقال البطاقات من 1 إلى 4 أعمدة.',
    html: `<div class="store">
  <div class="store-head">
    <h1>أحدث المنتجات المختارة</h1>
    <span class="count">4 منتجات</span>
  </div>
  <div class="products">
    <div class="item">
      <div class="thumb">01</div>
      <h2>سماعة مكتبية احترافية</h2>
      <p class="price">490 ر.س</p>
      <button onclick="addCart(this)">إضافة للسلة</button>
    </div>
    <div class="item">
      <div class="thumb">02</div>
      <h2>لوحة مفاتيح ميكانيكية</h2>
      <p class="price">620 ر.س</p>
      <button onclick="addCart(this)">إضافة للسلة</button>
    </div>
    <div class="item">
      <div class="thumb">03</div>
      <h2>حامل شاشة ألمنيوم</h2>
      <p class="price">310 ر.س</p>
      <button onclick="addCart(this)">إضافة للسلة</button>
    </div>
    <div class="item">
      <div class="thumb">04</div>
      <h2>إضاءة مكتب ذكية</h2>
      <p class="price">240 ر.س</p>
      <button onclick="addCart(this)">إضافة للسلة</button>
    </div>
  </div>
</div>`,
    css: `* { box-sizing: border-box; }
body {
  margin: 0;
  font-family: system-ui, -apple-system, sans-serif;
  background: #ffffff;
  color: #0f172a;
  direction: rtl;
}
.store { max-width: 1120px; margin: 0 auto; padding: 24px 18px; }
.store-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 14px;
  margin-bottom: 20px;
}
.store-head h1 { font-size: 20px; margin: 0; }
.count { font-size: 13px; color: #64748b; }
.products {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
.item {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.thumb {
  height: 120px;
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: monospace;
  font-size: 20px;
  font-weight: 700;
  color: #64748b;
}
.item h2 { font-size: 15px; margin: 0; }
.price { margin: 0; font-weight: 700; color: #2563eb; }
.item button {
  margin-top: auto;
  background: #0f172a;
  color: #ffffff;
  border: none;
  border-radius: 7px;
  padding: 9px 12px;
  font-size: 13px;
  cursor: pointer;
}
@media (min-width: 640px) {
  .products { grid-template-columns: repeat(2, 1fr); }
}
@media (min-width: 1024px) {
  .products { grid-template-columns: repeat(4, 1fr); }
}`,
    js: `function addCart(btn) {
  btn.textContent = 'تمت الإضافة ✓';
  btn.style.background = '#16a34a';
}`,
  },
];
