import React from 'react';
import { Download, X } from 'lucide-react';

interface ShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { keys: 'Ctrl / Cmd + B', label: 'إظهار أو إخفاء إطارات الأجهزة' },
  { keys: 'Ctrl / Cmd + E', label: 'التبديل إلى محرر الكود الحي' },
  { keys: 'Ctrl / Cmd + M', label: 'التبديل بين العرض المتعدد والتركيز الفردي' },
  { keys: 'Enter', label: 'تحميل الرابط المدخل في شريط العنوان' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ open, onClose }) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">اختصارات وإرشادات العرض الحي</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {SHORTCUTS.map((item) => (
              <div key={item.keys} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                <span className="text-slate-700 dark:text-slate-300">{item.label}</span>
                <kbd
                  dir="ltr"
                  className="font-mono text-[11px] px-2 py-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-800 dark:text-slate-200 whitespace-nowrap"
                >
                  {item.keys}
                </kbd>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            نصيحة: عند معاينة روابط خارجية تمنع العرض داخل الإطارات، فعّل خيار <strong>الوكيل الذكي</strong> من شريط
            الأدوات لجلب الصفحة بأمان وتفعيل مزامنة التمرير والتنقل الداخلي بين الروابط.
          </div>

          <a
            href="/api/download-bundle"
            download="mirat-cloudflare-bundle.zip"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>تنزيل حزمة Cloudflare + Blogger كاملة (ZIP)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
