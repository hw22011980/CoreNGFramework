import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModule, NgbTimeAdapter, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { DatetimePickerComponent } from './datetimepicker/datetimepicker.component';
import { NgbTimeStringAdapter } from './datetimepicker/ngbtimestring-adapter';
import { CustomAdapter, CustomDateParserFormatter } from './datetimepicker/ngbdatestring-adapter';
import { TableSelectorComponent } from './table-selector/table-selector.component';
import { NavTreeComponent } from './nav-tree/nav-tree.component';
import { TimepickerComponent } from './timepicker/timepicker.component';
import { TreeTableComponent } from './tree-table/tree-table.component';
import { TreeHeadComponent } from './tree-table/tree-head/tree-head.component';
import { TreeCellComponent } from './tree-table/tree-cell/tree-cell.component';
import { TreeCellViewComponent } from './tree-table/tree-cell/components/tree-cell-view/tree-cell-view.component';
import { CustomCellViewComponent } from './tree-table/tree-cell/components/tree-cell-view/custom/custom-tree-cell.component';
import { TreeCellActionsComponent } from './tree-table/tree-cell/components/tree-cell-actions/tree-cell-actions.component';
import { TreeBodyComponent } from './tree-table/tree-body/tree-body.component';
import { FilterRowComponent } from './tree-table/tree-body/components/filter-row/filter-row.component';
import { SubgridComponent } from './tree-table/subgrid/subgrid.component';
import { SubgridHeadComponent } from './tree-table/subgrid/components/subgrid-head/subgrid-head.component';
import { SubgridBodyComponent } from './tree-table/subgrid/components/subgrid-body/subgrid-body.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';

import { SpinnerComponent } from './spinner/spinner.component';
import { SpinnerSetupComponent } from './spinner/spinner-setup/spinner-setup.component';

@NgModule({
  declarations: [
    DatetimePickerComponent,
    TimepickerComponent,
    TableSelectorComponent,
    NavTreeComponent,
    TreeTableComponent,
    TreeHeadComponent,
    TreeCellComponent,
    TreeCellViewComponent,
    CustomCellViewComponent,
    TreeCellActionsComponent,
    TreeBodyComponent,
    FilterRowComponent,
    SubgridComponent,
    SubgridHeadComponent,
    SubgridBodyComponent,
    ProgressbarComponent,

    SpinnerComponent,
    SpinnerSetupComponent
  ],
  exports: [
    DatetimePickerComponent,
    TimepickerComponent,
    TableSelectorComponent,
    NavTreeComponent,
    TreeTableComponent,
    TreeHeadComponent,
    TreeCellComponent,
    TreeCellViewComponent,
    CustomCellViewComponent,
    TreeCellActionsComponent,
    TreeBodyComponent,
    FilterRowComponent,
    SubgridComponent,
    SubgridHeadComponent,
    SubgridBodyComponent,
    ProgressbarComponent,

    SpinnerComponent,
    SpinnerSetupComponent
  ],
  imports: [
    CommonModule, FormsModule, FontAwesomeModule, NgbModule
  ],
  providers: [
    {
      provide: NgbTimeAdapter,
      useClass: NgbTimeStringAdapter
    },
    {
      provide: NgbDateAdapter,
      useClass: CustomAdapter
    },
    {
      provide: NgbDateParserFormatter,
      useClass: CustomDateParserFormatter
    }
  ]
  //bootstrap: [
  //  DatetimePickerComponent,
  //  TimepickerComponent
  //]
})
export class ComponentModule { }
