export type SurfaceType =
  | 'RoofSurface'
  | 'WallSurface'
  | 'GroundSurface'
  | 'ClosureSurface'
  | 'OuterFloorSurface'
  | 'OuterCeilingSurface'
  | 'InteriorWallSurface'
  | 'FloorSurface'
  | 'CeilingSurface'
  | 'Unknown';

export const DEFAULT_SURFACE_COLORS: Record<SurfaceType, string> = {
  RoofSurface: '#c0392b',
  WallSurface: '#bdc3c7',
  GroundSurface: '#7f8c8d',
  ClosureSurface: '#95a5a6',
  OuterFloorSurface: '#d35400',
  OuterCeilingSurface: '#e67e22',
  InteriorWallSurface: '#ecf0f1',
  FloorSurface: '#a0856c',
  CeilingSurface: '#d5c5b2',
  Unknown: '#ffffff',
};

// The CityJSON payload is only ever consumed by the renderer below, so it stays untyped
// here rather than modelling the full spec.
export type CityJsonData = any;

export interface CityJsonRendererOptions {
  colors?: Partial<Record<SurfaceType, string>>;
  enableTexture?: boolean;
}
