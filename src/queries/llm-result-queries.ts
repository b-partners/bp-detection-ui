import { fromAnalyseResultToDomain } from '@/components/steps';
import { cache, getCached } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { Properties } from './types';

const baseUrl = `${process.env.LLM_ANALYSE_RESULT}`;
const apiKey = `${process.env.LLM_API_KEY}`;

export const useLlmResultQuery = (roofAnnotatorProperties: Properties & { obstacle: boolean }) => {
  const { moisissure_rate, usure_rate, humidite_rate, roof_area_in_m2, revetement_1, global_rate_value, obstacle, global_rate_type } =
    roofAnnotatorProperties || {};
  const queryFn = async () => {
    let llmResult = getCached.llmResult();
    if (llmResult) return llmResult;

    const result = await fetch(
      `${baseUrl}?surfaceEnM2=${roof_area_in_m2}&revetement=${fromAnalyseResultToDomain(revetement_1)}&moisissure=${moisissure_rate}&usure=${usure_rate}&obstacles=${JSON.stringify(obstacle)}&risqueFeu=false&fissureCassure=false&noteDegradationGlobale=${global_rate_value}&category=${global_rate_type}&humidit%C3%A9=${humidite_rate}&x-api-key=${apiKey}`
    );

    const _htmlResult = await result.text();
    const htmlResult = _htmlResult.split('</head>')[1];
    cache.llmResult(htmlResult || '');
    return htmlResult;
  };

  return useQuery({ queryFn, queryKey: [roofAnnotatorProperties] });
};
