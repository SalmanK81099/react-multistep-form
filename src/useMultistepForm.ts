import { useMemo, useState } from "react";

interface Step {
  type: React.ElementType;
  props: any;
}

interface ReturnType {
  currentStepIndex: number;
  step: React.ReactElement;
  steps: React.ReactElement[];
  isFirstStep: boolean;
  isLastStep: boolean;
  goTo: (index: number) => void;
  next: () => void;
  back: () => void;
}

export function useMultistepForm(
  steps: Step[],
  globalProps = {}
): ReturnType {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const next = () => {
    setCurrentStepIndex((i) => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };

  const back = () => {
    setCurrentStepIndex((i) => {
      if (i <= 0) return i;
      return i - 1;
    });
  };

  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };

  const enhancedSteps = useMemo(
    () =>
      steps.map((step, index) => (
        <step.type
          {...{ ...step.props, ...globalProps }}
          goTo={goTo}
          next={next}
          back={back}
          key={index}
          currentStepIndex={currentStepIndex}
        />
      )),
    [currentStepIndex, steps, goTo, next, back]
  );

  return {
    currentStepIndex,
    step: enhancedSteps[currentStepIndex],
    steps: enhancedSteps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  };
}
