import { RefObject } from 'react';
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf';

export const generateLocalPdf = async (ref: RefObject<HTMLDivElement | null>, address: string) => {
  const options: Options = {
    filename: 'res.pdf',
    method: 'build',
    resolution: Resolution.MEDIUM,
    page: { orientation: 'landscape', margin: Margin.MEDIUM },
    canvas: { mimeType: 'image/png', qualityRatio: 1 },
    overrides: {
      pdf: {
        compress: true,
      },
    },
  };
  // wait fo the image in the annotator board to load before geenrate the pdf
  await new Promise(resolve => {
    const timeoutId = setTimeout(() => {
      clearTimeout(timeoutId);
      resolve(timeoutId);
    }, 1000);
  });
  const res = await generatePDF(ref, options);
  const blob = res.output('blob');
  return new File([blob], `${address}.pdf`, { lastModified: Date.now(), type: 'application/pdf' });
};