import { useStep } from '@/hooks';
import { useRoofReportQuery } from '@/queries';
import { getCached, ParamsUtilities } from '@/utilities';
import { RoofAnnotator } from '@bpartners/roof-analyser';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { ROOF_ANALYSER_CONFIG } from './roof-analyser-config';
import { AnnotateImageStepStyle as style } from './styles';

export const AnnotateImageStep = () => {
  const { geoSession } = useStep(({ params }) => params);
  const { onPdfExport } = useRoofReportQuery();
  const { apiKey } = ParamsUtilities.getQueryParams();
  const { accountId, accountHolderId, userId } = getCached.userInfo();
  // Ties the analysis project the library opens for the visit to the prospect `createGeoSession` created.
  const prospectId = geoSession?.prospect?.id ?? getCached.prospectId() ?? undefined;
  const analysisProject = useMemo(() => ({ prospectId }), [prospectId]);

  if (!geoSession) return <div></div>;

  const { sessionId, position, areaPictureDetails } = geoSession;

  return (
    <Box sx={style} data-cy='roof-annotator'>
      <RoofAnnotator
        {...ROOF_ANALYSER_CONFIG}
        apiKey={apiKey}
        accountId={accountId ?? undefined}
        accountHolderId={accountHolderId ?? undefined}
        userId={userId ?? undefined}
        sessionId={sessionId}
        latitude={position.latitude}
        longitude={position.longitude}
        address={areaPictureDetails.address}
        analysisProject={analysisProject}
        rooferButtonMode
        onPdfExport={onPdfExport}
      />
    </Box>
  );
};
