import RandomValueRange from "../util/RandomValueRange";

export const config = {
    IMAGE_BASE_PATH: '/assets/categories/',
    SLIDE_PATH: '/assets/slides/',
    BUTTON_PATH: '/assets/buttons/',
    SOUND_PATH: '/assets/sounds/',

    server_mode: false,

    illicitDrugCategories : [
        "Cannabis Products",
        "Cigarettes",
        "Cigars",
        "Ecstasy",
        // "Hashish",
        "Hookah",
        "Pipes",
        "Rolling Tobacco"
    ],

    alcoholCategories : [
        "Alcopops",
        "Beer",
        "Brandy",
        "Champagne",
        "Cider",
        "Cocktails",
        "Gin",
        "Prosecco",
        "Red wine",
        "Vodka",
        "Rum",
        "Whisky",
        "White wine",
    ],

    initialScreenCategories : [
        "Cocaine",
        "Crack",
        "Heroin",
    ],
  };


// ###############################################################################################
// #
// # All Modifiable Parameters for the DATA ENTRY (First slide before hitting Submit)
// #
// ###############################################################################################

export const dataEntryConfig = {
    backgroundColor:"white"
}

// ###############################################################################################
// #
// # All Modifiable Parameters for the SHOP
// #
// ###############################################################################################

export const shopConfig = {

    backgroundColor:"black",

    lineColor: "#FFB904",
    categoryTileColor: "#FFDB80",
    clickedCategoryTileColor: "#FFB904",
    itemTileColor: "#FFB904",
    
    checkboxColorInCart:"white",

    backButtonColor: "#D9D9D9",
    addToCartButtonColor: "#D9D9D9",

    initialTime: 10*60, // 10 minutes (10*60 Seconds)
    secondTime: 5*60,

    initialBudget: 1000,

    halfTimeNotificationWhenBudgetMoreThan: 500,
    halfTimeNotificationWhenItemsLessThan: 15,
    useMinimumPriceBelow:100,
    repeatCategories: 1,
    numberOfItemTiles: 301,
    shopSlidesDuration: 5000,
};

// ###############################################################################################
// #
// # All Modifiable Parameters for the EXPERIMENT
// #
// ###############################################################################################


export const experimentConfig = {

    backgroundColor:"white",

    trialSequence: [
        {trialType: "nonDegraded", numberOfTrials: {self: 60, other: 60}},
        {trialType: "nonDegraded", numberOfTrials: {self: 60, other: 60}},
        {trialType: "nonDegraded", numberOfTrials: {self: 60, other: 60}},
        {trialType: "partiallyDegraded", numberOfTrials: {self: 60, other: 60}},
        {trialType: "fullyDegraded", numberOfTrials: {self: 60, other: 60}}
    ],

    slideTimings: {
        offLightbulb: new RandomValueRange({ minValue: 0, maxValue: 0 }), // in milliseconds
        offLightbulb2: new RandomValueRange({ minValue: 1000, maxValue: 1200 }), // in milliseconds
        coloredLightbulb: new RandomValueRange({ minValue: 1000, maxValue: 1000 }),
        receiveItem: new RandomValueRange({ minValue: 1000, maxValue: 1000 }),
        offLightbulbNoItem: new RandomValueRange({ minValue: 500, maxValue: 700 }),
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
