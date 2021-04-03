import { Component, forwardRef, ViewEncapsulation, OnChanges, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NG_VALIDATORS, FormControl } from '@angular/forms';
import { Time, TimeStruct } from './time.model';
import { isNumber, toInteger, padNumber } from '../util/util-helper';

const TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TimepickerComponent),
  multi: true
};

const TIMEPICKER_VALIDATOR = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => TimepickerComponent),
  multi: true
};

@Component({
  selector: 'app-timepicker',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.css'],
  providers: [TIMEPICKER_VALUE_ACCESSOR, TIMEPICKER_VALIDATOR]
})
export class TimepickerComponent implements ControlValueAccessor {

  static ngAcceptInputType_size: string;
  model: Time;

  /**
   * If true, the timepicker is disabled.
   */
  @Input() disabled: boolean;
 
  /**
   * If `true`, it is possible to select seconds.
   */
  @Input() seconds: boolean;

  /**
   * If `true`, the timepicker is readonly and can't be changed.
   */
  @Input() readonlyInputs: boolean;

  /**
   * To show value if prefix unit exist.
   */
  @Input() prefixUnit: string;

  /**
   * To show value if postfix unit exist.
   */
  @Input() postfixUnit: string;

  /**
   * To show clear button
   */
  @Input() clear: boolean;

  selectedTimeStr: string;

  constructor(private _cd: ChangeDetectorRef) {
    this.seconds = true;
    this.disabled = false;
    this.readonlyInputs = false;
    this.clear = true;
  }

  onChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value) {
    const structValue = this.fromModel(value);
    this.model = structValue ? new Time(structValue.hour, structValue.minute, structValue.second) : new Time();
    if (!this.seconds && (!structValue || !isNumber(structValue.second))) {
      this.model.second = 0;
    }
    this._cd.markForCheck();
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  updateHour(newVal: string) {
    const enteredHour = toInteger(newVal);
    this.model.updateHour(enteredHour)
    this.propagateModelChange();
  }

  updateMinute(newVal: string) {
    this.model.updateMinute(toInteger(newVal));
    this.propagateModelChange();
  }

  updateSecond(newVal: string) {
    this.model.updateSecond(toInteger(newVal));
    this.propagateModelChange();
  }

  private propagateModelChange(touched = true) {
    if (touched) {
      this.onTouched();
    }
    if (this.model.isValid(this.seconds)) {
      this.selectedTimeStr = this.toModel({ hour: this.model.hour, minute: this.model.minute, second: this.model.second })
    } else {
      this.selectedTimeStr = this.toModel(null)
    }

    this.onChange(this.selectedTimeStr);
  }

  fromModel(value: string | null): TimeStruct | null {
    if (value) {
      const split = value.split(':');
      return {
        hour: parseInt(split[0], 10),
        minute: parseInt(split[1], 10),
        second: parseInt(split[2], 10)
      };
    }
    return null;
  }

  toModel(time: TimeStruct | null): string | null {
    return (time != null && !this.model.isAllNaN()) ? `${padNumber(time.hour)}:${padNumber(time.minute)}:${padNumber(time.second)}` : "";
  }

  clearTime() {
    this.model = new Time();
    this.propagateModelChange();
  }

  _range(start, end, step = 1) {
    const len = Math.floor((end - start) / step) + 1
    return Array(len).fill(end).map((_, idx) => start + (idx * step));
  }

  createSelectHours(step = 1) {
    let hours = this._range(0, 23, step);
    hours.unshift(NaN);
    return hours;
  }

  createSelectMinutes(step = 1) {
    let minutes = this._range(0, 59, step);
    minutes.unshift(NaN);
    return minutes;
  }

  createSelectSeconds(step = 1) {
    let secs = this._range(0, 59, step);
    secs.unshift(NaN);
    return secs;
  }

  formatSelectHour(value?: number) {
    if (isNumber(value)) {
      return padNumber(value);
    } else {
      return 'HH';
    }
  }

  formatSelectMin(value?: number) {
    if (isNumber(value)) {
      return padNumber(value);
    } else {
      return 'MM'
    }
  }

  formatSelectSec(value?: number) {
    if (isNumber(value)) {
      return padNumber(value);
    } else {
      return 'SS'
    }
  }

  validate({ value }: FormControl) {
    const isNotValid = !this.model.isValid();
    return isNotValid && {
      required: true
    }
  }
}
