export const tooBigPolygonResponse_mock = {
  statusCode: 501,
  body: { message: 'Provided geojson polygon is too large to be processed synchronously' },
};

export const roofAnalyseLimitExceededResponse_Mock = {
  statusCode: 400,
  body: { message: 'Roof analysis consumption 13 limit exceeded for free trial period for User.id=' + 'mock-id' },
};
