// experimentConfig.ts

export const experimentConfig = {
    slideTimings: {
      offLightbulb: 250, // in milliseconds
      coloredLightbulb: 250,
      receiveItem: 250,
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
  