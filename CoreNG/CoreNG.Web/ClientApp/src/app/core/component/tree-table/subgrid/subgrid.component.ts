import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TreeDataInput } from '../tree-data-input';
import { Configs } from '../tree-data.model';

@Component({
  selector: '[app-subgrid]',
  templateUrl: './subgrid.component.html',
  styleUrls: ['./subgrid.component.css']
})
export class SubgridComponent implements OnInit {

  @Input()
  store: TreeDataInput;

  @Input()
  configs: Configs;

  @Input()
  expand_tracker: any;

  @Input()
  internal_configs: any;

  @Input()
  row_data: any;

  @Input()
  cellclick: EventEmitter<any>;

  @Input()
  expand: EventEmitter<any>;

  @Input()
  rowselect: EventEmitter<any>;

  @Input()
  rowdeselect: EventEmitter<any>;

  constructor() { }

  ngOnInit() { }

  refreshData(element) {   
    element[this.configs.parent_id_field] = parseInt(element[this.configs.parent_id_field], 10);
    this.expand_tracker = {};
    this.store.processData(
      this.store.getRawData(),
      this.expand_tracker,
      this.configs,
      this.internal_configs
    );
  }

  onRowExpand(event) {
    const row_data = event.data;

    const promise = new Promise((resolve, reject) => {
      this.expand.emit({
        data: row_data,
        resolve: resolve
      });
    });

    this.expand_tracker[row_data.pathx] = true;
    const blank_row: any = this.store.showBlankRow(row_data);
    blank_row.loading_children = true;

    // Add Child rows to the table.
    promise.then((child_rows: any) => {
      blank_row.loading_children = false;

      if (child_rows) {
        child_rows.map(child => {
          child.leaf = true;
        });
        blank_row.children = child_rows;
      } else {

        // Persist old children. If didn't exist then assign blank array.
        if (!blank_row.children) {
          blank_row.children = [];
        }
      }

    }).catch((err) => { });
  }

  onRowCollapse(event) {
    const row_data = event.data;
    this.expand_tracker[row_data.pathx] = false;
  }

  selectRowOnCheck(row_data, event) {
    if (event.target.checked) {
      row_data.row_selected = true;
      this.rowselect.emit({ data: row_data, event: event });
    } else {
      row_data.row_selected = false;
      this.rowdeselect.emit({ data: row_data, event: event });
    }

    this.setSelectAllConfig();
  }

  /**
   * Set Select All config on Select change.
   *
   */
  setSelectAllConfig() {
    let select_all = true;

    this.store.getDisplayData().forEach(data => {
      if (!data.row_selected) {
        select_all = false;
      }
    });

    this.internal_configs.all_selected = select_all;

  }

}
