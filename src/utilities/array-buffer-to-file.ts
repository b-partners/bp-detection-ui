export const arrayBuffeToFile = (arrayBuffer: ArrayBuffer, fileName: string, typeMime: string) => {
  return new File([arrayBuffer], fileName, { type: typeMime });
};
