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
    <div className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/90 px-4 lg:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
      {/* Right Section (Start in RTL): Source Tabs & URL Bar */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
        <div
          className="inline-flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg shrink-0"
          role="tablist"
          aria-label="مصدر المعاينة"
        >
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Demo)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              previewSource === PreviewSource.Demo
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نموذج تفاعلي</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Url)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              previewSource === PreviewSource.Url
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>رابط حي</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeSource(PreviewSource.Code)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              previewSource === PreviewSource.Code
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>كود حي</span>
          </button>
        </div>

        {/* URL Input Bar */}
        <form onSubmit={handleFormSubmit} className="relative flex items-center flex-1 min-w-[260px] max-w-xl">
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

        {/* Proxy & Live Watch controls when viewing URL */}
        {previewSource === PreviewSource.Url && (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={onToggleProxy}
              title="تفعيل الوكيل الذكي لتجاوز قيود X-Frame-Options ودعم مزامنة التمرير"
              className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                useProxy
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{useProxy ? 'الوكيل الذكي: مفعل' : 'إطار مباشر'}</span>
            </button>

            <label className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300 shrink-0">
              <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">مراقبة حية:</span>
              <select
                value={autoRefreshSec}
                onChange={(e) => onChangeAutoRefreshSec(Number(e.target.value))}
                aria-label="فترة التحديث الحي التلقائي"
                className="bg-transparent font-mono text-xs focus:outline-none cursor-pointer text-slate-900 dark:text-slate-100"
              >
                <option value={0}>إيقاف</option>
                <option value={3}>3 ث</option>
                <option value={5}>5 ث</option>
                <option value={10}>10 ث</option>
                <option value={30}>30 ث</option>
              </select>
            </label>
          </div>
        )}
      </div>

      {/* Left Section (End in RTL): Canvas & Device Controls */}
      <div className="flex flex-wrap items-center gap-2 shrink-0">
        {/* View Mode Switcher */}
        <div className="inline-flex items-center p-0.5 bg-slate-200/70 dark:bg-slate-800 rounded-lg shrink-0">
          <button
            type="button"
            onClick={() => onChangeViewMode(ViewMode.Multi)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === ViewMode.Multi
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span>متعدد</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeViewMode(ViewMode.Focus)}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              viewMode === ViewMode.Focus
                ? 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>تركيز</span>
          </button>
        </div>

        {/* Sync Scroll */}
        <button
          type="button"
          onClick={onToggleSyncScroll}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            syncScroll
              ? 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <span>مزامنة التمرير</span>
        </button>

        {/* Device Bezels */}
        <button
          type="button"
          onClick={onToggleBezels}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
            showBezels
              ? 'bg-slate-900 dark:bg-slate-100 border-slate-900 dark:border-slate-100 text-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>إطار الأجهزة</span>
        </button>

        {/* Zoom Selector */}
        <select
          value={zoomMode === 'auto' ? 'auto' : String(zoomMode)}
          onChange={(e) => onChangeZoomMode(e.target.value === 'auto' ? 'auto' : Number(e.target.value))}
          aria-label="مقياس تكبير المعاينة"
          className="h-8 px-2.5 text-xs font-mono bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
        >
          <option value="auto">ملائمة تلقائية</option>
          <option value="1">100%</option>
          <option value="0.75">75%</option>
          <option value="0.5">50%</option>
          <option value="0.35">35%</option>
        </select>

        {/* Reload All */}
        <button
          type="button"
          onClick={onReloadAll}
          title="تحديث جميع الشاشات"
          aria-label="تحديث جميع الشاشات"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Dark/Light Theme */}
        <button
          type="button"
          onClick={onToggleDark}
          title={isDark ? 'التبديل للوضع الفاتح' : 'التبديل للوضع الداكن'}
          aria-label="تبديل مظهر التطبيق"
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 cursor-pointer transition-colors"
        >
          {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
