import { fromAnalyseResultToDomain } from '@/components/steps';
import { cache, getCached } from '@/utilities';
import { useQuery } from '@tanstack/react-query';
import { Properties } from './types';

const baseUrl = `${process.env.LLM_ANALYSE_RESULT}`;
const apiKey = `${process.env.LLM_API_KEY}`;

export const useLlmResultQuery = (roofAnnotatorProperties: Properties) => {
  const { moisissure_rate, usure_rate, humidite_rate, roof_area_in_m2, revetement_1, global_rate_value } = roofAnnotatorProperties || {};
  const queryFn = async () => {
    let llmResult = getCached.llmResult();
    if (llmResult) return llmResult;

    const result = await fetch(
      `${baseUrl}?revetement=${fromAnalyseResultToDomain(revetement_1).value}&humidit%C3%A9=${humidite_rate}&usure=${usure_rate}&moisissure=${moisissure_rate}&surfaceEnM2=${roof_area_in_m2}&noteDegradationGlobale=${global_rate_value}&x-api-key=${apiKey}`
    );

    const htmlResult = await result.text();

    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    llmResult = htmlResult.match(bodyRegex)?.[0]?.replace(/\:/g, '') || null;
    cache.llmResult(llmResult || '');
    return llmResult;
  };

  return useQuery({ queryFn, queryKey: [roofAnnotatorProperties] });
};
