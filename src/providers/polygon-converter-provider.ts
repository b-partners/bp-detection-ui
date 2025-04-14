import { Geojson, GeojsonReturn } from '@bpartners/annotator-component';

export const pointsToGeoPoints = async (body: Geojson) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ANNOTATOR_GEO_REFERENCER_API_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return (await res.json()) as GeojsonReturn[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const geoPointsToPoins = async (geoJson: any) => {
  try {
    const res = await fetch(`${process.env.REACT_APP_ANNOTATOR_GEO_PIXEL_API_URL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'user-agent': 'postman' },
      body: JSON.stringify(geoJson),
    });

    return await res.json();
  } catch (error) {
    console.log(error);
  }
};
