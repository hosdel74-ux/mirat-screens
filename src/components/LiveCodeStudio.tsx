import React, { useState } from 'react';
import { Check, Copy, RotateCcw } from 'lucide-react';
import { LIVE_CODE_TEMPLATES } from '../data/devices';

interface LiveCodeStudioProps {
  html: string;
  css: string;
  js: string;
  onChangeHtml: (val: string) => void;
  onChangeCss: (val: string) => void;
  onChangeJs: (val: string) => void;
  onApplyTemplate: (templateId: string) => void;
  onResetTemplate: () => void;
}

export const LiveCodeStudio: React.FC<LiveCodeStudioProps> = ({
  html,
  css,
  js,
  onChangeHtml,
  onChangeCss,
  onChangeJs,
  onApplyTemplate,
  onResetTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const handleCopyFullHtml = async () => {
    const full = `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
${css}
  </style>
</head>
<body>
${html}
  <script>
${js}
  </script>
</body>
</html>`;
    try {
      await navigator.clipboard.writeText(full);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard may be restricted in some environments
    }
  };

  return (
    <aside className="w-full lg:w-[400px] xl:w-[440px] border-b lg:border-b-0 lg:border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col shrink-0 h-[340px] lg:h-auto">
      {/* Editor Header */}
      <div className="px-3.5 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-lg">
          {(['html', 'css', 'js'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 text-xs font-mono font-semibold uppercase rounded-md transition-colors cursor-pointer ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <select
            aria-label="قالب جاهز"
            onChange={(e) => {
              if (e.target.value) onApplyTemplate(e.target.value);
            }}
            defaultValue={LIVE_CODE_TEMPLATES[0].id}
            className="h-7 px-2 text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
          >
            {LIVE_CODE_TEMPLATES.map((tpl) => (
              <option key={tpl.id} value={tpl.id}>
                {tpl.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onResetTemplate}
            title="استعادة القالب"
            aria-label="استعادة القالب"
            className="h-7 w-7 inline-flex items-center justify-center rounded-md border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleCopyFullHtml}
            title="نسخ ملف HTML كامل"
            aria-label="نسخ الكود الكامل"
            className="h-7 px-2 inline-flex items-center gap-1 rounded-md border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'تم النسخ' : 'نسخ'}</span>
          </button>
        </div>
      </div>

      {/* Code Textarea */}
      <div className="flex-1 relative min-h-0">
        {activeTab === 'html' && (
          <textarea
            dir="ltr"
            spellCheck={false}
            value={html}
            onChange={(e) => onChangeHtml(e.target.value)}
            aria-label="محرر HTML"
            className="w-full h-full p-3.5 font-mono text-xs leading-6 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none focus:outline-none studio-scroll"
          />
        )}
        {activeTab === 'css' && (
          <textarea
            dir="ltr"
            spellCheck={false}
            value={css}
            onChange={(e) => onChangeCss(e.target.value)}
            aria-label="محرر CSS"
            className="w-full h-full p-3.5 font-mono text-xs leading-6 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none focus:outline-none studio-scroll"
          />
        )}
        {activeTab === 'js' && (
          <textarea
            dir="ltr"
            spellCheck={false}
            value={js}
            onChange={(e) => onChangeJs(e.target.value)}
            aria-label="محرر JavaScript"
            className="w-full h-full p-3.5 font-mono text-xs leading-6 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 resize-none focus:outline-none studio-scroll"
          />
        )}
      </div>

      {/* Quiet Footer Hint */}
      <div className="px-3.5 py-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
        <span>يتم تحديث جميع الشاشات فورياً مع كل تعديل</span>
        <span className="font-mono uppercase">{activeTab}</span>
      </div>
    </aside>
  );
};
