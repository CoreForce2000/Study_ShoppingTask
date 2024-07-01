import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useTaskStore from "../store/store";

const SlideComponent = () => {
  const store = useTaskStore();

  const navigate = useNavigate();
  const location = useLocation();
  const timeoutId = useRef<number | null>(null);

  const queryParams = new URLSearchParams(location.search);
  const block = parseInt(queryParams.get("block") ?? "1");
  const trial = parseInt(queryParams.get("trial") ?? "1");

  useEffect(() => {
    if (store.block !== block || store.trial !== trial) {
      store.setBlock(block);
      store.setTrial(trial);
    }
  }, [block, trial, store]);

  const changeContingency = useCallback(
    (newBlock: number, newTrial: number) => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
      navigate(`/contingency?block=${newBlock}&trial=${newTrial}`);
    },
    [navigate]
  );

  const incrementTrial = useCallback(() => {
    changeContingency(block, trial + 1);
  }, [block, trial, changeContingency]);

  const decrementTrial = useCallback(() => {
    changeContingency(block, trial - 1);
  }, [block, trial, changeContingency]);

  const waitTimeout = (lowerBound: number, upperBound?: number) => {
    const timeout = upperBound
      ? lowerBound + Math.random() * (upperBound - lowerBound)
      : lowerBound;

    timeoutId = setTimeout(() => {
      incrementSlideIndex();
    }, timeout);
  };

  const;

  const renderSlideContent = (slide, index) => {
    if (!slide.questions) {
      return [
        {
          slide: `/duringPhase2/Slide1.PNG`,
          execute: () => {
            waitTimeout(
              config.experimentConfig.slideTimings.offLightbulb.minValue,
              config.experimentConfig.slideTimings.offLightbulb.maxValue
            );
          },
        },
        slide.color === "orange"
          ? {
              slide: `/duringPhase2/Slide2.PNG`,
              execute: () => {
                waitKeyPress("Space");
                waitTimeout(
                  config.experimentConfig.slideTimings.coloredLightbulb
                    .minValue,
                  config.experimentConfig.slideTimings.coloredLightbulb.maxValue
                );
              },
            }
          : {
              slide: `/duringPhase2/Slide3.PNG`,
              execute: () => {
                waitKeyPress("Space");
                waitTimeout(
                  config.experimentConfig.slideTimings.coloredLightbulb
                    .minValue,
                  config.experimentConfig.slideTimings.coloredLightbulb.maxValue
                );
              },
            },
        {
          slide: `/duringPhase2/Slide4.PNG`,
          execute: () => {
            waitTimeout(
              config.experimentConfig.slideTimings.receiveItem.minValue,
              config.experimentConfig.slideTimings.receiveItem.maxValue
            );
          },
        },
      ].map((slideContent, idx) => (
        <div key={`${slide.slide}-${idx}`}>
          <img src={slideContent.slide} alt={`Slide ${idx + 1}`} />
          {slideContent.execute && slideContent.execute()}
        </div>
      ));
    } else {
      return [
        {
          children: (
            <VASSlide
              key={"CoDe_VAS" + index}
              text="Please indicate on the line below, how likely your claims were successful when you pressed the SPACE BAR."
              minLabel="not at all"
              maxLabel="very much"
              setValue={(value) => {
                store.setSurveyResponse("CoDe_VAS", value);
                waitTimeout(1000);
              }}
            />
          ),
        },
        {
          slide: `/duringPhase2/SlideB2.PNG`,
          children: (
            <div className="pt-14 pl-2.5 flex w-12 gap-8 justify-center">
              <Checkbox
                key="column8"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
              <Checkbox
                key="column9"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
            </div>
          ),
        },
        {
          slide: `/duringPhase2/SlideB3.PNG`,
          children: (
            <div className="pt-14 pl-2.5 flex w-12 gap-8 justify-center">
              <Checkbox
                key="column10"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
              <Checkbox
                key="column11"
                initialOptions={[""]}
                columnLayout="single"
                allowMultiple={false}
                onChange={() => {
                  waitTimeout(1000);
                }}
              />
            </div>
          ),
        },
      ].map((slideContent, idx) => (
        <div key={`${slide.slide}-${idx}`}>{slideContent.children}</div>
      ));
    }
  };

  return (
    <div>
      {store.contingencyOrder
        .map((slide, index) => (
          <div key={index}>{renderSlideContent(slide, index)}</div>
        ))
        .flat()}
    </div>
  );
};

export default SlideComponent;
