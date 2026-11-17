import React, { useState } from 'react';
import { Monitor, Plus, Smartphone, Tablet, X } from 'lucide-react';
import { DeviceCategory, DevicePreset } from '../types/preview';

interface DeviceDrawerModalProps {
  open: boolean;
  devices: DevicePreset[];
  onClose: () => void;
  onToggleDevice: (id: string) => void;
  onAddCustomDevice: (name: string, width: number, height: number, category: DeviceCategory) => void;
}

export const DeviceDrawerModal: React.FC<DeviceDrawerModalProps> = ({
  open,
  devices,
  onClose,
  onToggleDevice,
  onAddCustomDevice,
}) => {
  const [customName, setCustomName] = useState('شاشة مخصصة');
  const [customWidth, setCustomWidth] = useState(412);
  const [customHeight, setCustomHeight] = useState(915);
  const [customCategory, setCustomCategory] = useState<DeviceCategory>(DeviceCategory.Custom);

  if (!open) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanWidth = Math.max(280, Math.min(2560, Number(customWidth) || 390));
    const cleanHeight = Math.max(360, Math.min(2000, Number(customHeight) || 844));
    onAddCustomDevice(customName.trim() || 'مقاس مخصص', cleanWidth, cleanHeight, customCategory);
  };

  const renderCategoryIcon = (cat: DeviceCategory) => {
    if (cat === DeviceCategory.Mobile) return <Smartphone className="w-4 h-4 text-slate-500" />;
    if (cat === DeviceCategory.Tablet) return <Tablet className="w-4 h-4 text-slate-500" />;
    return <Monitor className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">إدارة الأجهزة والشاشات</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              اختر الشاشات الظاهرة في مساحة المعاينة أو أضف مقاساً مخصصاً
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="إغلاق"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 max-h-[65vh] overflow-y-auto studio-scroll space-y-6">
          {/* Device Presets Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {devices.map((device) => (
              <button
                key={device.id}
                type="button"
                onClick={() => onToggleDevice(device.id)}
                className={`flex items-center justify-between p-3 rounded-lg border text-right transition-colors cursor-pointer ${
                  device.visible
                    ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/30 dark:border-blue-500'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {renderCategoryIcon(device.category)}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {device.name}
                    </div>
                    <div dir="ltr" className="text-[11px] font-mono text-slate-500 dark:text-slate-400 text-right">
                      {device.width} × {device.height} · {device.dpr}x
                    </div>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                    device.visible
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {device.visible ? 'مفعّل' : 'مخفي'}
                </span>
              </button>
            ))}
          </div>

          {/* Add Custom Viewport Form */}
          <form
            onSubmit={handleAddCustom}
            className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3"
          >
            <div className="text-xs font-bold text-slate-900 dark:text-slate-100">إضافة مقاس مخصص</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="اسم الشاشة"
                className="h-9 px-3 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              />
              <input
                type="number"
                dir="ltr"
                min={280}
                max={2560}
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                placeholder="العرض (px)"
                className="h-9 px-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              />
              <input
                type="number"
                dir="ltr"
                min={360}
                max={2000}
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                placeholder="الارتفاع (px)"
                className="h-9 px-3 text-xs font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              />
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value as DeviceCategory)}
                className="h-9 px-2.5 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100"
              >
                <option value={DeviceCategory.Custom}>مخصص</option>
                <option value={DeviceCategory.Mobile}>جوال</option>
                <option value={DeviceCategory.Tablet}>لوحي</option>
                <option value={DeviceCategory.Desktop}>سطح مكتب</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>إضافة للمساحة</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
