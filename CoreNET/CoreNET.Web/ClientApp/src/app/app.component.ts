import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UiStateQuery } from './state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [
    `
      :host::ng-deep .ant-spin-nested-loading {
        height: 100%;
      }

      :host::ng-deep .ant-spin-container {
        height: inherit;
      }

      :host::ng-deep
        .ant-spin.ant-spin-spinning.ant-spin-lg.ant-spin-show-text {
        margin: 0;
        position: absolute;
        top: 50%;
        -ms-transform: translateY(-50%);
        transform: translateY(-50%);
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private uiStateQuery: UiStateQuery) {}

  ngOnInit(): void {
    this.isLoading$ = this.uiStateQuery.selectLoading();
  }
}
