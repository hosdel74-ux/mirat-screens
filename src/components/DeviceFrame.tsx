import React, { useEffect, useMemo, useState } from 'react';
import {
  ExternalLink,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCw,
  ShieldAlert,
  X,
} from 'lucide-react';
import { DeviceCategory, DevicePreset, PreviewSource } from '../types/preview';
import { buildDemoPreviewHtml } from '../data/demoHtml';

interface DeviceFrameProps {
  device: DevicePreset;
  scale: number;
  showBezels: boolean;
  isFocusMode: boolean;
  previewSource: PreviewSource;
  activeUrl: string;
  useProxy: boolean;
  liveSrcDoc: string;
  reloadVersion: number;
  registerIframeRef: (deviceId: string, el: HTMLIFrameElement | null) => void;
  onRotate: (deviceId: string) => void;
  onToggleFocus: (deviceId: string) => void;
  onRemove: (deviceId: string) => void;
  onEnableProxyFallback: () => void;
  onResizeCustom?: (width: number, height: number) => void;
}

function getBreakpointLabel(width: number): string {
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  if (width >= 640) return 'sm';
  return 'xs';
}

function getApiBase(): string {
  if (typeof window === 'undefined') return '';
  const custom = (window as unknown as { __MIRROR_API_BASE__?: string }).__MIRROR_API_BASE__;
  return typeof custom === 'string' ? custom.replace(/\/+$/, '') : '';
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  device,
  scale,
  showBezels,
  isFocusMode,
  previewSource,
  activeUrl,
  useProxy,
  liveSrcDoc,
  reloadVersion,
  registerIframeRef,
  onRotate,
  onToggleFocus,
  onRemove,
  onEnableProxyFallback,
  onResizeCustom,
}) => {
  const [localReload, setLocalReload] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const effectiveWidth = device.rotated ? device.height : device.width;
  const effectiveHeight = device.rotated ? device.width : device.height;
  const breakpoint = getBreakpointLabel(effectiveWidth);

  const scaledWidth = Math.round(effectiveWidth * scale);
  const scaledHeight = Math.round(effectiveHeight * scale);

  useEffect(() => {
    setIsLoading(true);
  }, [previewSource, activeUrl, useProxy, liveSrcDoc, reloadVersion, localReload]);

  const demoSrcDoc = useMemo(() => {
    if (previewSource !== PreviewSource.Demo) return undefined;
    return buildDemoPreviewHtml(device.id, reloadVersion + localReload);
  }, [previewSource, device.id, reloadVersion, localReload]);

  const computeIframeSrc = (): string | undefined => {
    if (previewSource === PreviewSource.Code || previewSource === PreviewSource.Demo) return undefined;
    if (!activeUrl) return undefined;
    if (useProxy) {
      const apiBase = getApiBase();
      return `${apiBase}/api/proxy?url=${encodeURIComponent(activeUrl)}&deviceId=${encodeURIComponent(device.id)}&v=${reloadVersion + localReload}`;
    }
    return activeUrl;
  };

  const iframeSrc = computeIframeSrc();
  const iframeSrcDoc =
    previewSource === PreviewSource.Code
      ? liveSrcDoc
      : previewSource === PreviewSource.Demo
      ? demoSrcDoc
      : undefined;
  const isMobile = device.category === DeviceCategory.Mobile;
  const isTablet = device.category === DeviceCategory.Tablet;
  const isDesktop = device.category === DeviceCategory.Desktop || device.category === DeviceCategory.Custom;

  const bezelPaddingX = showBezels ? (isMobile ? 12 : isTablet ? 14 : 10) : 0;
  const bezelPaddingTop = showBezels ? (isMobile ? 28 : isTablet ? 20 : 32) : 0;
  const bezelPaddingBottom = showBezels ? (isMobile ? 22 : isTablet ? 18 : 10) : 0;

  return (
    <div className="flex flex-col items-start shrink-0">
      {/* Device Metadata & Per-Screen Controls (Zero-Pill Rule: clean unboxed text with separators) */}
      <div
        className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 mb-2.5 w-full min-w-0"
        style={{ width: Math.max(scaledWidth + bezelPaddingX * 2, 260) }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
            {device.name}
          </span>
          <span className="text-slate-300 dark:text-slate-700" aria-hidden="true">
            ·
          </span>
          <span dir="ltr" className="text-[11px] font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
            {effectiveWidth} × {effectiveHeight}
          </span>
          <span className="text-slate-300 dark:text-slate-700 hidden sm:inline" aria-hidden="true">
            ·
          </span>
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 hidden sm:inline whitespace-nowrap">
            {breakpoint} · {device.dpr}x
          </span>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => onRotate(device.id)}
            title="تدوير الشاشة"
            aria-label={`تدوير ${device.name}`}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setLocalReload((v) => v + 1)}
            title="تحديث هذه الشاشة"
            aria-label={`تحديث ${device.name}`}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => onToggleFocus(device.id)}
            title={isFocusMode ? 'العودة للعرض المتعدد' : 'التركيز على هذه الشاشة'}
            aria-label={`تركيز ${device.name}`}
            className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {isFocusMode ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
          {!isFocusMode && (
            <button
              type="button"
              onClick={() => onRemove(device.id)}
              title="إخفاء الشاشة"
              aria-label={`إخفاء ${device.name}`}
              className="p-1.5 rounded-md text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Interactive Custom Resize Controls in Focus Mode */}
      {isFocusMode && onResizeCustom && (
        <div
          className="mb-3 p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg flex flex-wrap items-center gap-4 text-xs"
          style={{ width: Math.max(scaledWidth + bezelPaddingX * 2, 340) }}
        >
          <label className="flex items-center gap-2 flex-1 min-w-[160px]">
            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">العرض:</span>
            <input
              type="range"
              min={280}
              max={1920}
              value={effectiveWidth}
              onChange={(e) => onResizeCustom(Number(e.target.value), effectiveHeight)}
              className="flex-1 accent-blue-600 cursor-pointer"
            />
            <span dir="ltr" className="font-mono text-slate-800 dark:text-slate-200 w-12 text-left">
              {effectiveWidth}px
            </span>
          </label>
          <label className="flex items-center gap-2 flex-1 min-w-[160px]">
            <span className="text-slate-500 dark:text-slate-400 whitespace-nowrap">الارتفاع:</span>
            <input
              type="range"
              min={420}
              max={1400}
              value={effectiveHeight}
              onChange={(e) => onResizeCustom(effectiveWidth, Number(e.target.value))}
              className="flex-1 accent-blue-600 cursor-pointer"
            />
            <span dir="ltr" className="font-mono text-slate-800 dark:text-slate-200 w-12 text-left">
              {effectiveHeight}px
            </span>
          </label>
        </div>
      )}

      {/* Device Outer Hardware Chassis */}
      <div
        className={`relative transition-shadow duration-200 ${
          showBezels
            ? isMobile
              ? 'bg-slate-900 dark:bg-slate-800 rounded-[28px] shadow-xl ring-1 ring-slate-950/20 dark:ring-white/10'
              : isTablet
              ? 'bg-slate-900 dark:bg-slate-800 rounded-[22px] shadow-xl ring-1 ring-slate-950/20 dark:ring-white/10'
              : 'bg-slate-800 dark:bg-slate-800 rounded-xl shadow-xl ring-1 ring-slate-950/20 dark:ring-white/10'
            : 'bg-white dark:bg-slate-950 rounded-lg border border-slate-300 dark:border-slate-700 shadow-sm'
        }`}
        style={{
          paddingLeft: bezelPaddingX,
          paddingRight: bezelPaddingX,
          paddingTop: bezelPaddingTop,
          paddingBottom: bezelPaddingBottom,
        }}
      >
        {/* Hardware Bezel Details */}
        {showBezels && isMobile && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-16 h-3.5 bg-black rounded-full flex items-center justify-end px-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
          </div>
        )}
        {showBezels && isTablet && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-slate-700" />
        )}
        {showBezels && isDesktop && (
          <div className="absolute top-0 left-0 right-0 h-8 px-3 flex items-center justify-between border-b border-slate-700/60">
            <div className="flex items-center gap-1.5" dir="ltr">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            </div>
            <div
              dir="ltr"
              className="text-[11px] font-mono text-slate-300 bg-slate-900/70 px-3 py-0.5 rounded max-w-[60%] truncate"
            >
              {previewSource === PreviewSource.Code
                ? 'live-code://preview'
                : previewSource === PreviewSource.Demo
                ? 'demo://responsive-studio'
                : activeUrl || 'about:blank'}
            </div>
            <div className="w-10" />
          </div>
        )}

        {/* Scaled Viewport Wrapper */}
        <div
          className={`relative overflow-hidden bg-white ${
            showBezels ? (isMobile ? 'rounded-[18px]' : isTablet ? 'rounded-[10px]' : 'rounded-b-md') : 'rounded-lg'
          }`}
          style={{
            width: scaledWidth,
            height: scaledHeight,
          }}
        >
          {/* Thin Loading Progress Strip */}
          {isLoading && (
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-blue-600/20 z-10 overflow-hidden">
              <div className="h-full w-1/2 bg-blue-600 animate-pulse" />
            </div>
          )}

          <iframe
            ref={(el) => registerIframeRef(device.id, el)}
            title={`${device.name} (${effectiveWidth}x${effectiveHeight})`}
            src={iframeSrc}
            srcDoc={iframeSrcDoc}
            onLoad={() => setIsLoading(false)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: effectiveWidth,
              height: effectiveHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              border: 'none',
              display: 'block',
            }}
          />
        </div>

        {/* Bottom Home Indicator on Mobile Bezels */}
        {showBezels && isMobile && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-600 rounded-full" />
        )}
      </div>

      {/* Helpful Direct-Iframe Notice when using URL without Smart Proxy */}
      {previewSource === PreviewSource.Url && !useProxy && (
        <div
          className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400"
          style={{ width: Math.max(scaledWidth + bezelPaddingX * 2, 240) }}
        >
          <span className="inline-flex items-center gap-1 truncate">
            <ShieldAlert className="w-3 h-3 shrink-0 text-amber-600 dark:text-amber-500" />
            <span className="truncate">بعض المواقع تمنع العرض المباشر</span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onEnableProxyFallback}
              className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer whitespace-nowrap"
            >
              تفعيل الوكيل الذكي
            </button>
            {activeUrl && (
              <a
                href={activeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 inline-flex items-center gap-0.5"
                title="فتح في نافذة جديدة"
              >
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
