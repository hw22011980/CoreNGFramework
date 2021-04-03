import { NgbDateStruct, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

export interface NgbDateTimeStruct extends NgbDateStruct, NgbTimeStruct { }

export class DateTimeModel implements NgbDateTimeStruct {
    private static FORMAT_DELIMITER = '/';
    private static SPACE_DELIMITER = ' ';

    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;

    public constructor(init?: Partial<DateTimeModel>) {
        Object.assign(this, init);
    }

    public static fromLocalString(dateString: string): DateTimeModel {
        if (dateString) {
            let dateSplit = dateString.split(this.SPACE_DELIMITER);
            let datePart = dateSplit[0];
            let timePart = dateSplit[1];
            let datePartSplit = datePart.split(this.FORMAT_DELIMITER);
            dateString = `${datePartSplit[2]}-${datePartSplit[1]}-${datePartSplit[0]}T${timePart}`;
            const date = new Date(dateString);
            return new DateTimeModel({
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes(),
                second: date.getSeconds()
            });
        }

        return null;
    }

    private isInteger(value: any): value is number {
        return typeof value === 'number' && isFinite(value)
            && Math.floor(value) === value;
    }

    public toString(): string {
        if (this.isInteger(this.year) && this.isInteger(this.month) && this.isInteger(this.day)) {
            const year = this.year.toString().padStart(2, '0');
            const month = this.month.toString().padStart(2, '0');
            const day = this.day.toString().padStart(2, '0');

            if (!this.hour) {
                this.hour = 0;
            }
            if (!this.minute) {
                this.minute = 0;
            }
            if (!this.second) {
                this.second = 0;
            }

            const hour = this.hour.toString().padStart(2, '0');
            const minute = this.minute.toString().padStart(2, '0');
            const second = this.second.toString().padStart(2, '0');

            const pad = function (num) {
                const norm = Math.floor(Math.abs(num));
                return (norm < 10 ? '0' : '') + norm;
            };

            const isoString = `${pad(day)}/${pad(month)}/${pad(year)} ${pad(hour)}:${pad(minute)}:${pad(second)}`;
            return isoString;
        }

        return null;
    }
}