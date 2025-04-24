export const locationProvider = async (sessionId: string, query: string) => {
  const result = await fetch(`http://localhost:8080/location?` + `query="${query}"` + `&sessiontoken=${sessionId}`);
  return await result.json();
};
