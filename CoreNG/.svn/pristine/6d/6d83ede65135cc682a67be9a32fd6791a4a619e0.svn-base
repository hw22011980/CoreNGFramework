import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

/**
 * This Service handles how the date is represented in scripts i.e. ngModel.
 */
@Injectable()
export class CustomAdapter extends NgbDateAdapter<string> {

  readonly DELIMITER = '-';
  readonly FORMAT_DELIMITER = '/';
  readonly SPACE_DELIMITER = ' ';

  fromModel(value: string | null): NgbDateStruct | null {
    if (value) {
      if (typeof value === 'object') {
        return value;
      } else {
        if (value.includes(this.FORMAT_DELIMITER)) {
          value = value.split(this.SPACE_DELIMITER)[0];
          console.log(value);
          value = value.replace(new RegExp(this.FORMAT_DELIMITER, 'g'), this.DELIMITER);
        }
        let date = value.split(this.DELIMITER);
        return {
          day: parseInt(date[0], 10),
          month: parseInt(date[1], 10),
          year: parseInt(date[2], 10)
        };
      }
    }
    return null;
  }

  toModel(date: NgbDateStruct | null): string | null {
    if (date) {
      const year = date.year.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const day = date.day.toString().padStart(2, '0');

      return day + this.FORMAT_DELIMITER + month + this.FORMAT_DELIMITER
        + year;
    }
    return null;
  }
}

/**
 * This Service handles how the date is rendered and parsed from keyboard i.e. in the bound input field.
 */
@Injectable()
export class CustomDateParserFormatter extends NgbDateParserFormatter {

  readonly DELIMITER = '/';
  readonly SPACE_DELIMITER = ' ';

  parse(value: string): NgbDateStruct | null {
    if (value) {
      if (value.includes(this.SPACE_DELIMITER)) {
        value = value.split(this.SPACE_DELIMITER)[0];
      }
      let date = value.split(this.DELIMITER);
      return {
        day: parseInt(date[0], 10),
        month: parseInt(date[1], 10),
        year: parseInt(date[2], 10)
      };
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (date) {
      const year = date.year.toString().padStart(2, '0');
      const month = date.month.toString().padStart(2, '0');
      const day = date.day.toString().padStart(2, '0');

      return day + this.DELIMITER + month + this.DELIMITER
        + year;
    }
    return null;
  }
}