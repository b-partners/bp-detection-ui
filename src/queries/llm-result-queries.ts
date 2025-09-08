import { fromAnalyseResultToDomain } from '@/components/steps';
import { useQuery } from '@tanstack/react-query';
import { Properties } from './types';

const baseUrl = `${process.env.LLM_ANALYSE_RESULT}`;
const apiKey = `${process.env.LLM_API_KEY}`;

export const useLlmResultQuery = (roofAnnotatorProperties: Properties) => {
  const { moisissure_rate, usure_rate, humidite_rate, roof_area_in_m2, revetement_1 } = roofAnnotatorProperties || {};
  const queryFn = async () => {
    const result = await fetch(
      `${baseUrl}?revetement=${fromAnalyseResultToDomain(revetement_1).value}&humidit%C3%A9=${humidite_rate}&usure=${usure_rate}&moisissure=${moisissure_rate}&surfaceEnM2=${roof_area_in_m2}&x-api-key=${apiKey}`
    );

    const htmlResult = await result.text();

    const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
    return htmlResult.match(bodyRegex)?.[0]?.replace(/\:/g, '');
  };

  return useQuery({ queryFn, queryKey: [roofAnnotatorProperties] });
};
