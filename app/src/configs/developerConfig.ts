export const dataEntryConfig = {

}

export const shopConfigDev = {

    // initialTime: 3*60,
    initialTime: 0.2*60,
    secondTime: 5*60
};

export const experimentConfigDev = {

    // trialSequence: [
    //     {trialType: "nonDegraded", numberOfTrials: {self: 10, other: 10}},
    //     {trialType: "nonDegraded", numberOfTrials: {self: 10, other: 10}},
    //     {trialType: "nonDegraded", numberOfTrials: {self: 10, other: 10}},
    //     {trialType: "partiallyDegraded", numberOfTrials: {self: 10, other: 10}},
    //     {trialType: "fullyDegraded", numberOfTrials: {self: 10, other: 10}}
    // ],
    trialSequence: [
        {trialType: "nonDegraded", numberOfTrials: {self: 2, other: 2}},
        {trialType: "nonDegraded", numberOfTrials: {self: 2, other: 2}},
        {trialType: "nonDegraded", numberOfTrials: {self: 2, other: 2}},
        {trialType: "partiallyDegraded", numberOfTrials: {self: 2, other: 2}},
        {trialType: "fullyDegraded", numberOfTrials: {self: 2, other: 2}}
    ],
};
