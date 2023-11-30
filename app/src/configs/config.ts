import TimingObject from "../util/TimingObject";

export const config = {
    IMAGE_BASE_PATH: '/assets/categories/',
    SLIDE_PATH: '/assets/slides/',

    server_mode: false
  };

export const shopConfig = {
    initialBudget: 1000,
    repeatCategories: 10,
    repeatItems: 10,
};

export const experimentConfig = {
slideTimings: {
    offLightbulb: new TimingObject({ minValue: 300, maxValue: 500 }), // in milliseconds
    coloredLightbulb: new TimingObject({ minValue: 700, maxValue: 700 }),
    receiveItem: new TimingObject({ minValue: 1000, maxValue: 1000 }),
    offLightbulbNoItem: new TimingObject({ minValue: 1000, maxValue: 1000 }),
},
inputKey: 'Space', // The key code for the input
probabilities: {
    nonDegraded: {
    pressButton: 0.60,
    noPressButton: 0
    },
    partiallyDegraded: {
    pressButton: 0.60,
    noPressButton: 0.30
    },
    fullyDegraded: {
    pressButton: 0.60,
    noPressButton: 0.60
    }
}
};
