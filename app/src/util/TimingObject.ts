type TimingRange = {
    minValue: number;
    maxValue: number;
};

export default class TimingObject {
    range: TimingRange;

    constructor(range: TimingRange) {
        this.range = range;
    }

    getRandomValue(): number {
        const { minValue, maxValue } = this.range;

        if (minValue === maxValue) {
            return minValue; // If min and max are equal, return the value
        }

        // Ensure minValue is less than maxValue
        const min = Math.min(minValue, maxValue);
        const max = Math.max(minValue, maxValue);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}