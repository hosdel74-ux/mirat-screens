import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Monitor, RotateCcw } from 'lucide-react';
import { DeviceCategory, DevicePreset, PreviewSource, ViewMode } from './types/preview';
import { DEFAULT_DEVICES, LIVE_CODE_TEMPLATES } from './data/devices';
import { TopBar } from './components/TopBar';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { DeviceFrame } from './components/DeviceFrame';
import { LiveCodeStudio } from './components/LiveCodeStudio';
import { DeviceDrawerModal } from './components/DeviceDrawerModal';
import { ShortcutsModal } from './components/ShortcutsModal';

function normalizeUrlInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function App() {
  const [devices, setDevices] = useState<DevicePreset[]>(DEFAULT_DEVICES);
  const [previewSource, setPreviewSource] = useState<PreviewSource>(PreviewSource.Demo);
  const hasManualViewModeRef = useRef<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      return ViewMode.Focus;
    }
    return ViewMode.Multi;
  });
  const [focusedDeviceId, setFocusedDeviceId] = useState<string>('iphone-16-pro');

  const handleUserChangeViewMode = useCallback((mode: ViewMode) => {
    hasManualViewModeRef.current = true;
    setViewMode(mode);
  }, []);

  const [urlInput, setUrlInput] = useState<string>('https://ar.wikipedia.org');
  const [activeUrl, setActiveUrl] = useState<string>('https://ar.wikipedia.org');
  const [useProxy, setUseProxy] = useState<boolean>(true);
  const [autoRefreshSec, setAutoRefreshSec] = useState<number>(0);
  const [reloadVersion, setReloadVersion] = useState<number>(1);

  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [showBezels, setShowBezels] = useState<boolean>(true);
  const [zoomMode, setZoomMode] = useState<'auto' | number>('auto');
  const [isDark, setIsDark] = useState<boolean>(false);

  const [devicesModalOpen, setDevicesModalOpen] = useState<boolean>(false);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState<boolean>(false);

  // Live Code State
  const [activeTemplateId, setActiveTemplateId] = useState<string>(LIVE_CODE_TEMPLATES[0].id);
  const [codeHtml, setCodeHtml] = useState<string>(LIVE_CODE_TEMPLATES[0].html);
  const [codeCss, setCodeCss] = useState<string>(LIVE_CODE_TEMPLATES[0].css);
  const [codeJs, setCodeJs] = useState<string>(LIVE_CODE_TEMPLATES[0].js);
  const [debouncedCode, setDebouncedCode] = useState({
    html: LIVE_CODE_TEMPLATES[0].html,
    css: LIVE_CODE_TEMPLATES[0].css,
    js: LIVE_CODE_TEMPLATES[0].js,
  });

  // Canvas measurement for smart Auto-Fit scaling
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight - 140 : 700,
  });

  const iframeRefs = useRef<Map<string, HTMLIFrameElement>>(new Map());
  const registerIframeRef = useCallback((deviceId: string, el: HTMLIFrameElement | null) => {
    if (el) {
      iframeRefs.current.set(deviceId, el);
    } else {
      iframeRefs.current.delete(deviceId);
    }
  }, []);

  // Sync dark mode class on <html>
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  // Measure canvas container with hysteresis threshold and adapt viewMode for small/medium screens
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    let frameId: number | null = null;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;

      const newWidth = Math.round(entry.contentRect.width);
      const newHeight = Math.round(entry.contentRect.height);

      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        if (!hasManualViewModeRef.current && typeof window !== 'undefined') {
          setViewMode(window.innerWidth < 1024 ? ViewMode.Focus : ViewMode.Multi);
        }
        setCanvasSize((prev) => {
          if (Math.abs(prev.width - newWidth) < 24 && Math.abs(prev.height - newHeight) < 24) {
            return prev;
          }
          return { width: newWidth, height: newHeight };
        });
      });
    });

    observer.observe(el);
    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

  // Debounce Live Code edits (150ms) for smooth instant preview
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedCode({ html: codeHtml, css: codeCss, js: codeJs });
    }, 150);
    return () => window.clearTimeout(timer);
  }, [codeHtml, codeCss, codeJs]);

  // Auto-Refresh Live Watch interval
  useEffect(() => {
    if (previewSource !== PreviewSource.Url || autoRefreshSec <= 0) return;
    const id = window.setInterval(() => {
      setReloadVersion((v) => v + 1);
    }, autoRefreshSec * 1000);
    return () => window.clearInterval(id);
  }, [previewSource, autoRefreshSec]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      if (key === 'b') {
        e.preventDefault();
        setShowBezels((prev) => !prev);
      } else if (key === 'e') {
        e.preventDefault();
        setPreviewSource((prev) => (prev === PreviewSource.Code ? PreviewSource.Demo : PreviewSource.Code));
      } else if (key === 'm') {
        e.preventDefault();
        hasManualViewModeRef.current = true;
        setViewMode((prev) => (prev === ViewMode.Multi ? ViewMode.Focus : ViewMode.Multi));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Listen to iframe scroll sync & proxied link navigation messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== 'object') return;

      if (data.type === 'mirror-scroll' && syncScroll) {
        iframeRefs.current.forEach((iframe, id) => {
          if (iframe.contentWindow && iframe.contentWindow !== event.source) {
            iframe.contentWindow.postMessage(
              {
                type: 'mirror-sync-scroll',
                sourceDeviceId: id === data.deviceId ? id : data.deviceId,
                ratioY: data.ratioY,
                ratioX: data.ratioX,
              },
              '*'
            );
          }
        });
      } else if (data.type === 'mirror-navigate' && typeof data.url === 'string') {
        setUrlInput(data.url);
        setActiveUrl(data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [syncScroll]);

  const liveSrcDoc = useMemo(() => {
    const bridgeScript = `<script>
(function() {
  var isSyncing = false;
  var timer = null;
  window.addEventListener('scroll', function() {
    if (isSyncing) return;
    var doc = document.documentElement;
    var maxY = Math.max(1, doc.scrollHeight - window.innerHeight);
    var maxX = Math.max(1, doc.scrollWidth - window.innerWidth);
    window.parent.postMessage({
      type: 'mirror-scroll',
      deviceId: 'code',
      ratioY: Math.min(1, Math.max(0, window.scrollY / maxY)),
      ratioX: Math.min(1, Math.max(0, window.scrollX / maxX))
    }, '*');
  }, { passive: true });
  window.addEventListener('message', function(e) {
    if (!e.data || e.data.type !== 'mirror-sync-scroll') return;
    isSyncing = true;
    var doc = document.documentElement;
    var maxY = Math.max(0, doc.scrollHeight - window.innerHeight);
    var maxX = Math.max(0, doc.scrollWidth - window.innerWidth);
    window.scrollTo({ top: Math.round((e.data.ratioY || 0) * maxY), left: Math.round((e.data.ratioX || 0) * maxX) });
    clearTimeout(timer);
    timer = setTimeout(function() { isSyncing = false; }, 60);
  });
})();
</script>`;

    return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>${debouncedCode.css}</style>
</head>
<body>
${debouncedCode.html}
<script>${debouncedCode.js}</script>
${bridgeScript}
</body>
</html>`;
  }, [debouncedCode]);

  const visibleDevices = useMemo(() => devices.filter((d) => d.visible), [devices]);

  const focusedDevice = useMemo(() => {
    return devices.find((d) => d.id === focusedDeviceId) || visibleDevices[0] || devices[0];
  }, [devices, focusedDeviceId, visibleDevices]);

  const calculateScale = useCallback(
    (device: DevicePreset): number => {
      if (zoomMode !== 'auto') return zoomMode;
      const effW = device.rotated ? device.height : device.width;
      const effH = device.rotated ? device.width : device.height;
      const availH = Math.max(320, canvasSize.height - 120);
      const availW = Math.max(280, canvasSize.width - 64);

      if (viewMode === ViewMode.Focus) {
        const fitH = availH / effH;
        const fitW = availW / effW;
        return Number(Math.max(0.2, Math.min(1, fitH, fitW)).toFixed(2));
      }

      // Multi-device canvas auto-scale: fit height AND fit total horizontal width when reasonable
      const targetHeightScale = availH / effH;
      const capByCategory = effW >= 1200 ? 0.56 : effW >= 700 ? 0.62 : 0.72;
      const baseScale = Math.min(capByCategory, targetHeightScale);

      const totalNominalWidth = visibleDevices.reduce((acc, d) => {
        const w = d.rotated ? d.height : d.width;
        const h = d.rotated ? d.width : d.height;
        const cap = w >= 1200 ? 0.56 : w >= 700 ? 0.62 : 0.72;
        const s = Math.min(cap, availH / h);
        return acc + w * s + 28;
      }, 0);
      const gapTotal = Math.max(0, visibleDevices.length - 1) * 32;
      const widthCorrection =
        totalNominalWidth + gapTotal > availW && visibleDevices.length <= 4
          ? availW / (totalNominalWidth + gapTotal)
          : 1;

      return Number(Math.max(0.28, Math.min(1, baseScale * Math.min(1, widthCorrection))).toFixed(2));
    },
    [zoomMode, canvasSize, viewMode, visibleDevices]
  );

  const handleSubmitUrl = (explicitUrl?: string) => {
    const normalized = normalizeUrlInput(explicitUrl ?? urlInput);
    if (!normalized) return;
    setUrlInput(normalized);
    setActiveUrl(normalized);
    setPreviewSource(PreviewSource.Url);
    setReloadVersion((v) => v + 1);
  };

  const handleRotateDevice = (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, rotated: !d.rotated } : d)));
  };

  const handleToggleFocus = (id: string) => {
    if (viewMode === ViewMode.Focus && focusedDeviceId === id) {
      setViewMode(ViewMode.Multi);
    } else {
      setFocusedDeviceId(id);
      setViewMode(ViewMode.Focus);
    }
  };

  const handleToggleDeviceVisibility = (id: string) => {
    setDevices((prev) => prev.map((d) => (d.id === id ? { ...d, visible: !d.visible } : d)));
  };

  const handleAddCustomDevice = (name: string, width: number, height: number, category: DeviceCategory) => {
    const newDevice: DevicePreset = {
      id: `custom-${Date.now()}`,
      name,
      width,
      height,
      dpr: 1,
      category,
      visible: true,
    };
    setDevices((prev) => [...prev, newDevice]);
    setFocusedDeviceId(newDevice.id);
    setDevicesModalOpen(false);
  };

  const handleResizeFocusedDevice = (width: number, height: number) => {
    if (!focusedDevice) return;
    setDevices((prev) =>
      prev.map((d) => {
        if (d.id !== focusedDevice.id) return d;
        return d.rotated ? { ...d, height: width, width: height } : { ...d, width, height };
      })
    );
  };

  const handleApplyTemplate = (templateId: string) => {
    const found = LIVE_CODE_TEMPLATES.find((t) => t.id === templateId);
    if (!found) return;
    setActiveTemplateId(found.id);
    setCodeHtml(found.html);
    setCodeCss(found.css);
    setCodeJs(found.js);
  };

  const handleResetTemplate = () => {
    handleApplyTemplate(activeTemplateId);
  };

  const handleRestoreDefaults = () => {
    setDevices(DEFAULT_DEVICES);
    setViewMode(ViewMode.Multi);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden">
      <TopBar
        viewMode={viewMode}
        previewSource={previewSource}
        onSelectMulti={() => {
          if (previewSource === PreviewSource.Code) setPreviewSource(PreviewSource.Demo);
          handleUserChangeViewMode(ViewMode.Multi);
        }}
        onSelectFocus={() => {
          if (previewSource === PreviewSource.Code) setPreviewSource(PreviewSource.Demo);
          handleUserChangeViewMode(ViewMode.Focus);
        }}
        onSelectLiveCode={() => setPreviewSource(PreviewSource.Code)}
        onOpenShortcuts={() => setShortcutsModalOpen(true)}
        onOpenDevices={() => setDevicesModalOpen(true)}
      />

      <WorkspaceToolbar
        previewSource={previewSource}
        onChangeSource={setPreviewSource}
        urlInput={urlInput}
        onChangeUrlInput={setUrlInput}
        onSubmitUrl={handleSubmitUrl}
        useProxy={useProxy}
        onToggleProxy={() => setUseProxy((p) => !p)}
        autoRefreshSec={autoRefreshSec}
        onChangeAutoRefreshSec={setAutoRefreshSec}
        onReloadAll={() => setReloadVersion((v) => v + 1)}
        viewMode={viewMode}
        onChangeViewMode={handleUserChangeViewMode}
        syncScroll={syncScroll}
        onToggleSyncScroll={() => setSyncScroll((s) => !s)}
        showBezels={showBezels}
        onToggleBezels={() => setShowBezels((b) => !b)}
        zoomMode={zoomMode}
        onChangeZoomMode={setZoomMode}
        isDark={isDark}
        onToggleDark={() => setIsDark((d) => !d)}
      />

      {/* Main Studio Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        {previewSource === PreviewSource.Code && (
          <LiveCodeStudio
            html={codeHtml}
            css={codeCss}
            js={codeJs}
            onChangeHtml={setCodeHtml}
            onChangeCss={setCodeCss}
            onChangeJs={setCodeJs}
            onApplyTemplate={handleApplyTemplate}
            onResetTemplate={handleResetTemplate}
          />
        )}

        {/* Device Preview Canvas */}
        <main
          ref={canvasRef}
          className="flex-1 studio-canvas-bg overflow-x-auto overflow-y-auto studio-scroll p-4 sm:p-6 lg:p-8"
        >
          {viewMode === ViewMode.Focus && focusedDevice ? (
            <div className="w-full flex flex-col items-center justify-start gap-4">
              {/* Quick Device Switcher Strip in Focus Mode */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-lg">
                {devices.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setFocusedDeviceId(d.id)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                      focusedDevice.id === d.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {d.name}
                  </button>
                ))}
              </div>

              <DeviceFrame
                device={focusedDevice}
                scale={calculateScale(focusedDevice)}
                showBezels={showBezels}
                isFocusMode={true}
                previewSource={previewSource}
                activeUrl={activeUrl}
                useProxy={useProxy}
                liveSrcDoc={liveSrcDoc}
                reloadVersion={reloadVersion}
                registerIframeRef={registerIframeRef}
                onRotate={handleRotateDevice}
                onToggleFocus={handleToggleFocus}
                onRemove={handleToggleDeviceVisibility}
                onEnableProxyFallback={() => setUseProxy(true)}
                onResizeCustom={handleResizeFocusedDevice}
              />
            </div>
          ) : visibleDevices.length > 0 ? (
            <div className="w-max min-w-full flex items-start justify-center gap-6 lg:gap-8 pb-6">
              {visibleDevices.map((device) => (
                <DeviceFrame
                  key={device.id}
                  device={device}
                  scale={calculateScale(device)}
                  showBezels={showBezels}
                  isFocusMode={false}
                  previewSource={previewSource}
                  activeUrl={activeUrl}
                  useProxy={useProxy}
                  liveSrcDoc={liveSrcDoc}
                  reloadVersion={reloadVersion}
                  registerIframeRef={registerIframeRef}
                  onRotate={handleRotateDevice}
                  onToggleFocus={handleToggleFocus}
                  onRemove={handleToggleDeviceVisibility}
                  onEnableProxyFallback={() => setUseProxy(true)}
                />
              ))}
            </div>
          ) : (
            <div className="m-auto max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center space-y-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-600 dark:text-slate-300">
                <Monitor className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">لا توجد شاشات نشطة حالياً</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                أعد تفعيل الأجهزة الافتراضية أو اختر شاشات جديدة من قائمة إدارة الشاشات لبدء المعاينة الحية.
              </p>
              <div className="pt-2 flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleRestoreDefaults}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة الشاشات الافتراضية</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDevicesModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  إدارة الشاشات
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <DeviceDrawerModal
        open={devicesModalOpen}
        devices={devices}
        onClose={() => setDevicesModalOpen(false)}
        onToggleDevice={handleToggleDeviceVisibility}
        onAddCustomDevice={handleAddCustomDevice}
      />

      <ShortcutsModal open={shortcutsModalOpen} onClose={() => setShortcutsModalOpen(false)} />
    </div>
  );
}
