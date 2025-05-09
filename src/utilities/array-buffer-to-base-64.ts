export const getMimeType = (base64: string) => {
  const signatures = {
    '/9j/': 'image/jpeg',
    iVBORw0KGgo: 'image/png',
    R0lGODdh: 'image/gif',
    UklGR: 'image/webp',
    AAAAIGZ0eXBpcG0: 'image/mp4',
    JVBERi0: 'application/pdf',
  };

  for (const signature in signatures) {
    if (base64.startsWith(signature)) {
      return signatures[signature as keyof typeof signatures];
    }
  }
  return 'unknown';
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  const base64 = btoa(binary);
  const typeMime = getMimeType(base64);

  return `data:${typeMime};base64,${base64}`;
};

export const base64ToArrayBuffer = (base64: string) => {
  const base64Clean = base64.replace(/^data:.*,/, '');
  const binary = atob(base64Clean);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};
