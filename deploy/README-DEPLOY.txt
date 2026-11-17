مِرآة الشاشات — حزمة النشر لـ Cloudflare Pages و Blogger
=======================================================

محتويات هذه الحزمة:
1) dist/
   - يحتوي على الواجهة المبنية الجاهزة (index.html + assets/app.js + assets/app.css).
   - يمكنك رفعه مباشرة إلى Cloudflare Pages أو استخدامه مع Wrangler.

2) functions/api/proxy.ts
   - دالة Cloudflare Pages Functions الخاصة بالوكيل الذكي (/api/proxy).
   - تعمل تلقائياً عند النشر عبر GitHub أو عبر: npx wrangler pages deploy dist

3) deploy/blogger/
   - blogger-page-embed.html: كود تضمين الأداة داخل صفحة ثابتة في بلوجر.
   - blogger-full-template.xml: قالب بلوجر XML كامل.
   - ملاحظة: استبدل YOUR-APP.pages.dev برابط مشروعك الفعلي على Cloudflare Pages.

4) ملفات المصدر (src/, package.json, vite.config.ts, tsconfig.json, index.html):
   - للرفع إلى GitHub أو إعادة البناء محلياً عبر:
     npm install
     npm run build
