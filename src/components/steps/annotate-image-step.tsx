import { useStep } from '@/hooks';
import { AnnotatorSection } from '../annotator-section';

export const AnnotateImageStep = () => {
  const { areaPictureDetails, imageSrc } = useStep(({ params }) => params);

  return imageSrc && areaPictureDetails ? <AnnotatorSection areaPictureDetails={areaPictureDetails} imageSrc={imageSrc} /> : <div></div>;
};
