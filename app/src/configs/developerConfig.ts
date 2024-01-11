export const dataEntryConfig = {

}

export const shopConfigDev = {

    initialTime: 15*60,
};

export const experimentConfigDev = {

    trialSequence: [
        {trialType: "nonDegraded", numberOfTrials: {self: 3, other: 3}},
        {trialType: "nonDegraded", numberOfTrials: {self: 3, other: 3}},
        {trialType: "nonDegraded", numberOfTrials: {self: 3, other: 3}},
        {trialType: "partiallyDegraded", numberOfTrials: {self: 3, other: 3}},
        {trialType: "fullyDegraded", numberOfTrials: {self: 3, other: 3}}
    ],
};
