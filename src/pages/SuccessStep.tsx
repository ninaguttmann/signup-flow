import { getStepContent } from '../config/stepsConfig';
import { SuccessIcon } from '../components/common/Icons';

const SuccessStep = () => {
  const stepContent = getStepContent(5);

  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <SuccessIcon className="mx-auto mb-8" />
      <div className="mb-9">
        <h2 className="heading-2 mb-2.5">{stepContent.displayTitle}</h2>
        <p className="body-text max-w-[411px]">{stepContent.subtitle}</p>
      </div>
    </div>
  );
};

export default SuccessStep;
