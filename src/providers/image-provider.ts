export const getImageFromAddress = async () => {
  const result = await fetch(`${process.env.API_URL}/image`);
  const { imageUrl } = await result.json();
  return imageUrl;
};
