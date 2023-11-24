// experimentConfig.ts

export const experimentConfig = {
    slideTimings: {
      offLightbulb: 2500, // in milliseconds
      coloredLightbulb: 2500,
      receiveItem: 2500,
      none:0
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
  