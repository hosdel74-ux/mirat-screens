import React, { useState } from 'react';
import {
  Code2,
  Columns3,
  Globe,
  Link2,
  Maximize2,
  Moon,
  RefreshCw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
} from 'lucide-react';
import { PreviewSource, ViewMode } from '../types/preview';
import { QUICK_SAMPLE_URLS } from '../data/devices';

interface WorkspaceToolbarProps {
  previewSource: PreviewSource;
  onChangeSource: (source: PreviewSource) => void;
  urlInput: string;
  onChangeUrlInput: (val: string) => void;
  onSubmitUrl: (url?: string) => void;
  useProxy: boolean;
  onToggleProxy: () => void;
  autoRefreshSec: number;
  onChangeAutoRefreshSec: (sec: number) => void;
  onReloadAll: () => void;
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  syncScroll: boolean;
  onToggleSyncScroll: () => void;
  showBezels: boolean;
  onToggleBezels: () => void;
  zoomMode: 'auto' | number;
  onChangeZoomMode: (zoom: 'auto' | number) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  previewSource,
  onChangeSource,
  urlInput,
  onChangeUrlInput,
  onSubmitUrl,
  useProxy,
  onToggleProxy,
  autoRefreshSec,
  onChangeAutoRefreshSec,
  onReloadAll,
  viewMode,
  onChangeViewMode,
  syncScroll,
  onToggleSyncScroll,
  showBezels,
  onToggleBezels,
  zoomMode,
  onChangeZoomMode,
  isDark,
  onToggleDark,
}) => {
  const [samplesOpen, setSamplesOpen] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitUrl();
  };

  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/95 dark:bg-slate-900/95 px-3 sm:px-4 lg:px-6 py-2 flex flex-col gap-2 shrink-0">
      {/* Top Row: Sources & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Source Switcher */}
        <div
          className="inline-flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg shrink-0"
          role="tablist"
          aria-label="مصدر المعاينة"
        >
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Demo)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              previewSource === PreviewSource.Demo
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">نموذج تفاعلي</span>
            <span className="sm:hidden">نموذج</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Url)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              previewSource === PreviewSource.Url
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">رابط حي</span>
            <span className="sm:hidden">رابط</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Code)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              previewSource === PreviewSource.Code
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">محرر كود</span>
            <span className="sm:hidden">كود</span>
          </button>
        </div>

        {/* View Mode & Canvas Actions */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          {/* Multi / Focus view mode toggle */}
          <div className="inline-flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg shrink-0">
            <button
              type="button"
              onClick={() => onChangeViewMode(ViewMode.Multi)}
              title="عرض متعدد"
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === ViewMode.Multi
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">متعدد</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode(ViewMode.Focus)}
              title="تركيز فردي"
              className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                viewMode === ViewMode.Focus
                  ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">تركيز</span>
            </button>
          </div>

          {/* Sync Scroll */}
          <button
            type="button"
            onClick={onToggleSyncScroll}
            title="تفعيل أو تعطيل التمرير المتزامن بين الشاشات"
            className={`inline-flex items-center gap-1 h-7 px-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              syncScroll
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <span>مزامنة</span>
          </button>

          {/* Bezels */}
          <button
            type="button"
            onClick={onToggleBezels}
            title="إظهار أو إخفاء هيكل الأجهزة"
            className={`inline-flex items-center gap-1 h-7 px-2 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              showBezels
                ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">إطار</span>
          </button>

          {/* Zoom scale select */}
          <select
            value={zoomMode === 'auto' ? 'auto' : String(zoomMode)}
            onChange={(e) => onChangeZoomMode(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
            aria-label="المقياس"
            className="h-7 px-2 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
          >
            <option value="auto">تلقائي</option>
            <option value="1">100%</option>
            <option value="0.75">75%</option>
            <option value="0.5">50%</option>
          </select>

          {/* Reload All */}
          <button
            type="button"
            onClick={onReloadAll}
            title="تحديث جميع الشاشات"
            className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          {/* Theme Switch */}
          <button
            type="button"
            onClick={onToggleDark}
            title={isDark ? 'الوضع الفاتح' : 'الوضع الداكن'}
            className="h-7 w-7 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 cursor-pointer"
          >
            {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Bottom Row: URL Input, Samples, Proxy & Live Watch */}
      <div className="flex flex-wrap items-center gap-2">
        <form onSubmit={handleFormSubmit} className="relative flex-1 min-w-[240px] max-w-2xl">
          <div className="flex items-center w-full h-8 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg focus-within:border-blue-600 dark:focus-within:border-blue-500 transition-colors overflow-hidden">
            <span className="pr-2.5 pl-1.5 text-slate-400 shrink-0 flex items-center">
              <Link2 className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              dir="ltr"
              value={urlInput}
              onChange={(e) => onChangeUrlInput(e.target.value)}
              placeholder="https://example.com"
              aria-label="رابط الموقع للمعاينة"
              className="flex-1 min-w-0 h-full px-1.5 text-xs font-mono bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
            />
            <div className="flex items-center gap-1 px-1 shrink-0">
              <button
                type="button"
                onClick={() => setSamplesOpen((prev) => !prev)}
                className="px-2 py-1 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded cursor-pointer whitespace-nowrap"
              >
                أمثلة
              </button>
              <button
                type="submit"
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-700 rounded cursor-pointer whitespace-nowrap"
              >
                معاينة
              </button>
            </div>
          </div>

          {samplesOpen && (
            <div className="absolute top-10 right-0 left-0 z-30 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg p-1.5 grid gap-0.5">
              {QUICK_SAMPLE_URLS.map((sample) => (
                <button
                  key={sample.url}
                  type="button"
                  onClick={() => {
                    onChangeUrlInput(sample.url);
                    onChangeSource(PreviewSource.Url);
                    onSubmitUrl(sample.url);
                    setSamplesOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-1.5 text-xs rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  <span className="font-medium">{sample.label}</span>
                  <span dir="ltr" className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                    {sample.url}
                  </span>
                </button>
              ))}
            </div>
          )}
        </form>

        {/* Proxy Toggle & Auto-refresh */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={onToggleProxy}
            title="تفعيل الوكيل الذكي لتجاوز حظر الإطارات ومزامنة التمرير"
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
              useProxy
                ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{useProxy ? 'الوكيل: مفعّل' : 'إطار مباشر'}</span>
          </button>

          <label className="inline-flex items-center gap-1 h-8 px-2 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 shrink-0">
            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap hidden sm:inline">مراقبة:</span>
            <select
              value={autoRefreshSec}
              onChange={(e) => onChangeAutoRefreshSec(Number(e.target.value))}
              aria-label="التحديث التلقائي"
              className="bg-transparent font-mono text-xs focus:outline-none cursor-pointer text-slate-900 dark:text-slate-100"
            >
              <option value={0}>إيقاف</option>
              <option value={3}>3 ث</option>
              <option value={5}>5 ث</option>
              <option value={10}>10 ث</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
};
