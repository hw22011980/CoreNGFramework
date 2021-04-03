import { isNumber, toInteger } from '../util/util-helper';

/**
 * An interface for the time model used by the timepicker.
 */
export interface TimeStruct {
    /**
     * The hour in the `[0, 23]` range.
     */
    hour: number;

    /**
     * The minute in the `[0, 59]` range.
     */
    minute: number;

    /**
     * The second in the `[0, 59]` range.
     */
    second: number;
}

export class Time {
    hour: number;
    minute: number;
    second: number;

    constructor(hour?: number, minute?: number, second?: number) {
        this.hour = toInteger(hour);
        this.minute = toInteger(minute);
        this.second = toInteger(second);
    }

    updateHour(hour: number) {
        if (isNumber(hour)) {
            this.hour = hour;
            if (isNaN(this.minute)) this.minute = 0;
            if (isNaN(this.second)) this.second = 0;
        } else {
            this.hour = NaN;
        }
    }

    updateMinute(minute: number) {
        if (isNumber(minute)) {
            this.minute = minute;
            if (isNaN(this.hour)) this.hour = 0;
            if (isNaN(this.second)) this.second = 0;
        } else {
            this.minute = NaN;
        }
    }

    updateSecond(second: number) {
        if (isNumber(second)) {
            this.second = second;
            if (isNaN(this.hour)) this.hour = 0;
            if (isNaN(this.minute)) this.minute = 0;
        } else {
            this.second = NaN;
        }
    }

    isValid(checkSecs = true) {
        let valid = true;
        valid = isNaN(this.hour) && isNaN(this.minute) && (checkSecs ? isNaN(this.second) : true);
        valid = valid || (isNumber(this.hour) && isNumber(this.minute) && (checkSecs ? isNumber(this.second) : true));
        return valid;
    }

    isAllNaN(checkSecs = true) {
        return isNaN(this.hour) && isNaN(this.minute) && (checkSecs ? isNaN(this.second) : true);
    }

    toString() { return `${this.hour || 0}:${this.minute || 0}:${this.second || 0}`; }
}
