export enum DeviceCategory {
  Mobile = 'mobile',
  Tablet = 'tablet',
  Desktop = 'desktop',
  Custom = 'custom',
}

export enum PreviewSource {
  Demo = 'demo',
  Url = 'url',
  Code = 'code',
}

export enum ViewMode {
  Multi = 'multi',
  Focus = 'focus',
}

export interface DevicePreset {
  id: string;
  name: string;
  width: number;
  height: number;
  dpr: number;
  category: DeviceCategory;
  rotated?: boolean;
  visible: boolean;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
}
