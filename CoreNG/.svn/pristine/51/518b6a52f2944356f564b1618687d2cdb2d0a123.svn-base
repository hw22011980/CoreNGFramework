import { Component, forwardRef, OnInit, AfterViewInit, Input, ViewChild, Injector } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl } from '@angular/forms';
import { DateTimeModel } from './date-time.model';
import { NgbDatepicker, NgbPopover, NgbPopoverConfig, NgbTimeStruct, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datetimepicker',
  templateUrl: './datetimepicker.component.html',
  styleUrls: ['./datetimepicker.component.css'],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimePickerComponent),
      multi: true
    }
  ]
})
export class DatetimePickerComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input()
  dateString: string;

  // Later, will use for improvement
  @Input()
  inputDatetimeFormat = 'M/d/yyyy H:mm:ss';

  @Input()
  hourStep = 1;
  @Input()
  minuteStep = 1;
  @Input()
  secondStep = 1;

  @Input()
  seconds = true;
  @Input()
  spinners = true;
  @Input()
  meridian = false;

  @Input()
  disabled = false;

  @Input()
  readonly = false;

  @Input()
  prefix: string;

  @Input()
  postfix: string;

  private showTimePickerToggle = false;
  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;

  @ViewChild(NgbDatepicker)
  private dp: NgbDatepicker;

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  ngControl: NgControl;

  constructor(private config: NgbPopoverConfig, private inj: Injector, private router: Router) {
    config.autoClose = 'outside';
    config.placement = 'auto';
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
  }

  // implements from ControlValueAccessor
  writeValue(newModel: string): void {
    if (newModel) {
      this.dateString = newModel;
      this.datetime = Object.assign(this.datetime, DateTimeModel.fromLocalString(newModel));
      this.setDateStringModel();
    } else {
      this.datetime = null;
    }
  }

  // implements from ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // implements from ControlValueAccessor
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // implements from ControlValueAccessor
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggleDateTimeState($event) {
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === '') {
      this.datetime = new DateTimeModel();
      this.dateString = '';
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string) {
    const date = DateTimeModel.fromLocalString($event);
    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;
    this.setDateStringModel();
  }

  onTimeChange(event: string) {
    const split = event.split(':');
    this.datetime.hour = parseInt(split[0], 10);
    this.datetime.minute = parseInt(split[1], 10);
    this.datetime.second = parseInt(split[2], 10);

    this.setDateStringModel();
  }

  setDateStringModel() {
    this.dateString = this.datetime.toString();

    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
        this.onChange(this.dateString);
      }
    }
  }

  inputBlur($event) {
    this.onTouched();
  }

}
