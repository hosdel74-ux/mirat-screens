import React from 'react';
import { Plus } from 'lucide-react';
import { PreviewSource, ViewMode } from '../types/preview';

interface TopBarProps {
  viewMode: ViewMode;
  previewSource: PreviewSource;
  onSelectMulti: () => void;
  onSelectFocus: () => void;
  onSelectLiveCode: () => void;
  onOpenShortcuts: () => void;
  onOpenDevices: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  viewMode,
  previewSource,
  onSelectMulti,
  onSelectFocus,
  onSelectLiveCode,
  onOpenShortcuts,
  onOpenDevices,
}) => {
  const isCodeActive = previewSource === PreviewSource.Code;
  const isMultiActive = !isCodeActive && viewMode === ViewMode.Multi;
  const isFocusActive = !isCodeActive && viewMode === ViewMode.Focus;

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 lg:px-6 flex items-center justify-between gap-8 shrink-0">
      {/* Zone 1: Single-line Brand Wordmark */}
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          onSelectMulti();
        }}
        className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0"
      >
        مِرآة الشاشات
      </a>

      {/* Zone 2: Concise single-line navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        <button
          type="button"
          onClick={onSelectMulti}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
            isMultiActive
              ? 'border-blue-600 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          المعاينة المتعددة
        </button>
        <button
          type="button"
          onClick={onSelectFocus}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
            isFocusActive
              ? 'border-blue-600 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          التركيز الفردي
        </button>
        <button
          type="button"
          onClick={onSelectLiveCode}
          className={`py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
            isCodeActive
              ? 'border-blue-600 text-slate-900 dark:text-slate-100'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          محرر الكود الحي
        </button>
        <button
          type="button"
          onClick={onOpenShortcuts}
          className="py-1 transition-colors whitespace-nowrap shrink-0 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer"
        >
          اختصارات العمل
        </button>
      </nav>

      {/* Zone 3: Single Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenDevices}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>إدارة الشاشات</span>
        </button>
      </div>
    </header>
  );
};
