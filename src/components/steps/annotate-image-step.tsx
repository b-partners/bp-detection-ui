import { useStep } from '@/hooks';
import { resolveActiveWmsLayer, resolveWmsLayers } from '@/providers';
import { useRoofReportQuery } from '@/queries';
import { ParamsUtilities } from '@/utilities';
import { RoofAnnotator } from '@bpartners/roof-analyser';
import { Box } from '@mui/material';
import { ROOF_ANALYSER_CONFIG } from './roof-analyser-config';
import { AnnotateImageStepStyle as style } from './styles';

export const AnnotateImageStep = () => {
  const { geoSession } = useStep(({ params }) => params);
  const { onPdfExport } = useRoofReportQuery();
  const { apiKey } = ParamsUtilities.getQueryParams();

  if (!geoSession) return <div></div>;

  const { sessionId, position, areaPictureDetails } = geoSession;

  return (
    <Box sx={style} data-cy='roof-annotator'>
      <RoofAnnotator
        {...ROOF_ANALYSER_CONFIG}
        apiKey={apiKey}
        sessionId={sessionId}
        latitude={position.latitude}
        longitude={position.longitude}
        address={areaPictureDetails.address}
        resolveWmsLayers={resolveWmsLayers}
        resolveActiveWmsLayer={resolveActiveWmsLayer}
        show3D={false}
        onPdfExport={onPdfExport}
      />
    </Box>
  );
};
