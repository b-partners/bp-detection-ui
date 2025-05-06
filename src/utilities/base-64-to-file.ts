/**
 * Converts a base64 string to a File object.
 * @param base64String The base64 string, can be a data URL or a plain base64 string.
 * @param filename The desired name of the output File.
 * @param mimeType Optional MIME type; if not provided, it will be inferred or defaults to "application/octet-stream".
 * @returns A File object created from the base64 string.
 */
export function base64ToFile(base64String: string, filename: string, mimeType?: string): File {
  const parts = base64String.split(',');
  let actualBase64 = base64String;

  if (parts.length > 1) {
    const header = parts[0];
    actualBase64 = parts[1];

    if (!mimeType) {
      const matches = header.match(/data:(.*?);base64/);
      if (matches && matches[1]) {
        mimeType = matches[1];
      }
    }
  }

  mimeType = mimeType || 'application/octet-stream';

  const byteString = atob(actualBase64);
  const byteNumbers = new Array(byteString.length);

  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);

  return new File([byteArray], filename, { type: mimeType });
}
