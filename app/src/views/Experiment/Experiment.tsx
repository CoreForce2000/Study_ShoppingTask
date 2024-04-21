import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { config, shopConfig, experimentConfig } from "../../configs/config";
import { selectIsDeveloperOptions } from "../../store/configSlice";
import styles from "./Experiment.module.css";

import {
  selectBlock,
  selectExperimentSequence,
  selectTrial,
  setBlock,
  setExperimentSequence,
  setTrial,
} from "../../store/experimentSlice";
import {
  Product,
  selectItemsInCart,
  selectItemsByCategory,
  resetState,
  setTimer,
  selectCategoryClickCount,
} from "../../store/shopSlice";
import { RootState } from "../../store/store";
import { shuffleExtendArray } from "../../util/randomize";
import { preloadImage } from "../../util/imageLoading";
import { experimentConfigDev } from "../../configs/developerConfig";
import SlideView from "../../components/SlideView/SlideView";

type BlockType = "nonDegraded" | "partiallyDegraded" | "fullyDegraded";
type SlideType =
  | "offLightbulb"
  | "coloredLightbulb"
  | "receiveItem"
  | "offLightbulbNoItem"
  | "offLightbulb2";

export interface Slide {
  id: string;
  type: SlideType;
  image: string; // Background image
  itemImage?: string; // Optional item image
  allowKeyPress: boolean;
}

interface TrialData {
  slide: Slide;
  product: Product;
}

const pathToSlides = config.SLIDE_PATH + "duringPhase2/";

const offLightbulbSlide: Slide = {
  id: "offLightbulb",
  type: "offLightbulb",
  image: pathToSlides + "Slide1.PNG",
  allowKeyPress: false,
};

const offLightbulbSlide2: Slide = {
  id: "offLightbulb2",
  type: "offLightbulb2",
  image: pathToSlides + "Slide1.PNG",
  allowKeyPress: false,
};

const blueLightbulbSlide: Slide = {
  id: "blueLightbulb",
  type: "coloredLightbulb",
  image: pathToSlides + "Slide3.PNG",
  allowKeyPress: true,
};

const orangeLightbulbSlide: Slide = {
  id: "orangeLightbulb",
  type: "coloredLightbulb",
  image: pathToSlides + "Slide2.PNG",
  allowKeyPress: true,
};

const receiveItemSlide: Slide = {
  id: "receiveItem",
  type: "receiveItem",
  image: pathToSlides + "Slide4.PNG",
  allowKeyPress: false,
};

const offLightbulbNoItemSlide: Slide = {
  id: "offLightbulbNoItem",
  type: "offLightbulb",
  image: pathToSlides + "Slide1.PNG",
  allowKeyPress: false,
};

const drugCategories = [
  ...config.illicitDrugCategories,
  ...config.alcoholCategories,
  ...config.initialScreenCategories,
];

function getProductPath(product: Product): string {
  return `${config.IMAGE_BASE_PATH}${product.category}/${product.image_name}`;
}

const findCategories = (
  categories: { [key: string]: number },
  startCount: number
) => {
  let count = startCount;

  while (true) {
    const foundCategories = Object.keys(categories).filter(
      (category) => categories[category] === count
    );
    if (foundCategories.length > 0) {
      return foundCategories;
    }
    count++;
  }
};

const useOtherCategories = () => {
  // Use the selector to get the category click counts
  const categoryClickCount = useSelector((state: RootState) =>
    selectCategoryClickCount(state)
  );

  // Find other categories starting from -1
  const otherCategories = findCategories(categoryClickCount, -1);

  const otherCategoriesWithoutDrugs = otherCategories.filter(
    (category) => !drugCategories.includes(category)
  );

  return otherCategoriesWithoutDrugs;
};

const Experiment: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pressedButton, setPressedButton] = useState<boolean>(false);
  const [currentSlide, setCurrentSlide] = useState<Slide>(offLightbulbSlide);
  const [imagePath, setImagePath] = useState<string>("none");

  const totalTrials =
    experimentConfig.trialSequence.length *
    experimentConfig.trialSequence[0].numberOfTrials.self *
    2;

  const isDeveloperMode = useSelector(selectIsDeveloperOptions);

  const ratingSound = new Audio(`${config.SOUND_PATH}rating_phase_2.mp3`);
  const endOfPhase2Sound = new Audio(`${config.SOUND_PATH}End of phase2.mp3`);

  const otherCategories = useOtherCategories();
  const otherProducts = useSelector((state) =>
    otherCategories.flatMap((category) =>
      selectItemsByCategory(state, category)
    )
  );
  const selfProducts = useSelector(selectItemsInCart).map(
    (item) => item.product
  );

  function generateExperimentSequence(): TrialData[] {
    const randomizedSelf: Product[] = shuffleExtendArray(
      selfProducts,
      totalTrials / 2 + 1
    );
    const randomizedOther: Product[] = shuffleExtendArray(
      otherProducts,
      totalTrials / 2 + 1
    );

    const orderOfSelfOther = shuffleExtendArray(["self", "other"], totalTrials);
    const blueIsSelf = Math.random() < 0.5;

    return orderOfSelfOther.map((group) => {
      if (group === "self") {
        return {
          slide: blueIsSelf ? blueLightbulbSlide : orangeLightbulbSlide,
          product: randomizedSelf.pop()!,
        };
      } else {
        return {
          slide: blueIsSelf ? orangeLightbulbSlide : blueLightbulbSlide,
          product: randomizedOther.pop()!,
        };
      }
    });
  }

  let experimentSequence: TrialData[] = useSelector(selectExperimentSequence);

  useEffect(() => {
    if (experimentSequence.length === 0) {
      const newSequence = generateExperimentSequence();
      dispatch(setExperimentSequence(newSequence));
    }
    const slideImagePaths = [
      pathToSlides + "Slide1.PNG",
      pathToSlides + "Slide2.PNG",
      pathToSlides + "Slide3.PNG",
      pathToSlides + "Slide4.PNG",
    ];

    slideImagePaths.forEach((path) => {
      preloadImage(path);
    });
  }, [selfProducts, otherProducts, experimentSequence.length, dispatch]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (
        event.code === experimentConfig.inputKey &&
        currentSlide.allowKeyPress &&
        !pressedButton
      ) {
        setPressedButton(true);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [currentSlide.allowKeyPress, pressedButton]);

  useEffect(() => {
    if (pressedButton) {
      transitionSlide(experimentSequence);
    } else {
      const timer = setTimeout(() => {
        transitionSlide(experimentSequence);
      }, experimentConfig.slideTimings[currentSlide.type].getRandomValue());

      return () => clearTimeout(timer);
    }
  }, [
    currentSlide,
    experimentConfig.slideTimings,
    pressedButton,
    experimentSequence,
  ]);

  dispatch(setExperimentSequence(experimentSequence));

  const block = useSelector(selectBlock);
  const trial = useSelector(selectTrial);

  if (block === 6) {
    endOfPhase2Sound.play();
    navigate(`/slide`);
    dispatch(resetState());
    dispatch(setTimer(shopConfig.secondTime));
  }

  const transitionSlide = async (experimentSequence: TrialData[]) => {
    const currentBlockData = getBlockData(block);

    // Check if the current trial exceeds the number of trials in the current block
    const totalTrialsInCurrentBlock =
      currentBlockData.numberOfTrials.self +
      currentBlockData.numberOfTrials.other;

    const index = (block - 1) * totalTrialsInCurrentBlock + trial - 1;

    const onFinishTrial = () => {
      setPressedButton(false);

      dispatch(setTrial(trial + 1));

      if (trial >= totalTrialsInCurrentBlock) {
        if (block < 5) {
          ratingSound.play();
        }

        dispatch(setBlock(block + 1));

        dispatch(setTrial(1));

        navigate(`/slide?interSlide=vasExperiment`);
      } else {
      }
    };

    switch (currentSlide.type) {
      case "offLightbulb":
        setPressedButton(false);
        setCurrentSlide(offLightbulbSlide2);

        const localImagePath = getProductPath(
          experimentSequence[index].product
        );

        await preloadImage(localImagePath);
        setImagePath(localImagePath);

        break;

      case "offLightbulb2":
        setCurrentSlide(experimentSequence[index].slide);
        break;

      case "coloredLightbulb":
        if (
          calculateItemReceivingChance(
            currentBlockData.trialType,
            pressedButton
          )
        ) {
          setCurrentSlide({
            ...receiveItemSlide,
          });

          setPressedButton(false);
        } else {
          setCurrentSlide(offLightbulbNoItemSlide);

          onFinishTrial();
        }
        break;

      case "receiveItem":
        setCurrentSlide(offLightbulbSlide);

        onFinishTrial();
        break;
    }
  };

  const calculateItemReceivingChance = (
    blockType: BlockType,
    buttonPressed: boolean
  ): boolean => {
    let probability = 0;
    const blockProbabilities = experimentConfig.probabilities[blockType];

    probability = buttonPressed
      ? blockProbabilities.pressButton
      : blockProbabilities.noPressButton;

    return Math.random() < probability;
  };

  const getBlockData = (blockNumber: number): any => {
    return isDeveloperMode
      ? experimentConfigDev.trialSequence[blockNumber - 1]
      : experimentConfig.trialSequence[blockNumber - 1];
  };

  return (
    <div className={styles.experiment}>
      <SlideView backgroundImage={currentSlide.image}>
        <img
          src={imagePath}
          alt="Item"
          className={styles.itemImage}
          style={{
            visibility:
              currentSlide.type === "receiveItem" && imagePath
                ? "visible"
                : "hidden",
          }}
        />
      </SlideView>
    </div>
  );
};

export default Experiment;
