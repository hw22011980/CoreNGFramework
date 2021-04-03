import { Component, Input, ViewEncapsulation } from '@angular/core';
import { getValueInRange, isNumber } from '../util/util-helper';
import { ProgressbarConfig } from './progressbar-config';

@Component({
  selector: 'app-progressbar',
  templateUrl: './progressbar.component.html',
  styleUrls: ['./progressbar.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgressbarComponent {

  private _max: number;

  /**
   * The maximal value to be displayed in the progress bar.
   * Should be a positive number. Will default to 100.
   */
  @Input()
  set max(max: number) {
    this._max = !isNumber(max) || max <= 0 ? 100 : max;
  }

  get max(): number { return this._max; }

  /**
   * If 'true', the stripes on the progress bar are animated.
   * Take effect only for browsers supporting CSS3 animations, and if 'striped=true'.
   */
  @Input() animated: boolean;

  /**
   * If 'true', the progress bar will be displayed as striped.
   */
  @Input() striped: boolean;

  /**
   * If 'true', the current percentage will be shown in the 'xx%' format.
   */
  @Input() showValue: boolean;

  /**
   * Optional text variant type of the progress bar.
   *
   * Supports types based on Bootstrap background color variants, like:
   *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
   *
   * @since 5.2.0
   */
  @Input() textType: string;

  /**
   * The type of the progress bar.
   *
   * Supports types based on Bootstrap background color variants, like:
   *  `"success"`, `"info"`, `"warning"`, `"danger"`, `"primary"`, `"secondary"`, `"dark"` and so on.
   */
  @Input() type: string;

  /**
   * The current value for the progress bar.
   *
   * Should be in the `[0, max]` range.
   */
  @Input() value = 0;

  /**
   * The height of the progress bar.
   *
   * Accepts any valid CSS height values, ex. `"2rem"`
   */
  @Input() height: string;

  constructor(config: ProgressbarConfig) {
    this.max = config.max;
    this.animated = config.animated;
    this.striped = config.striped;
    this.textType = config.textType;
    this.type = config.type;
    this.showValue = config.showValue;
    this.height = config.height;
  }

  getValue() { return getValueInRange(this.value, this.max); }

  getPercentValue() { return 100 * this.getValue() / this.max; }
}
