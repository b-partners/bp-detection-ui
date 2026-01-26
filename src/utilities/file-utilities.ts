import { v4 } from 'uuid';

export const base64ToFile = (base64: string, fileName: string): File => {
  const [meta, data] = base64.split(',');
  const mime = meta.match(/:(.*?);/)?.[1] || '';
  const bytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  return new File([bytes], fileName, { type: mime });
};

export const jsonToFile = (data: any, filename?: string) => {
  const json = JSON.stringify(data);
  const blob = new Blob([json], { type: 'application/json' });
  return new File([blob], filename || `${v4()}.json`, { type: 'application/json' });
};
