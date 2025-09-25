export const asyncWaiting = async (valueInMilliseconds: number) =>
  new Promise(resolve => {
    const timeout = setTimeout(() => {
      clearTimeout(timeout);
      resolve(undefined);
    }, valueInMilliseconds);
  });
