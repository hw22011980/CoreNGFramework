import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TreeDataInput } from '../tree-data-input';
import { Configs, TreeColumn } from '../tree-data.model';
import { TreeTableService } from '../tree-table.service';

@Component({
  selector: '[app-tree-head]',
  templateUrl: './tree-head.component.html',
  styleUrls: ['./tree-head.component.css']
})
export class TreeHeadComponent implements OnInit {

  @Input()
  store: TreeDataInput;

  @Input()
  configs: Configs;

  @Input()
  expand_tracker: any;

  @Input()
  edit_tracker: any;

  @Input()
  internal_configs: any;

  @Input()
  columns: TreeColumn[];

  @Input()
  rowselectall: EventEmitter<any>;

  @Input()
  rowdeselectall: EventEmitter<any>;

  @Input()
  rdo1selectall: EventEmitter<any>;

  @Input()
  rdo2selectall: EventEmitter<any>;

  @Input()
  selectedValues: EventEmitter<any>;

  constructor(private treeTableService: TreeTableService) { }

  ngOnInit() { }

  selectAll(e) {
    if (e.target.checked) {
      this.treeTableService.selectAll(this.store.getDisplayData());
      this.rowselectall.emit(this.store.getDisplayData());
    } else {
      this.treeTableService.deSelectAll(this.store.getDisplayData());
      this.rowdeselectall.emit(e);
    }
  }

  selectAllRdo1(e) {
    this.treeTableService.selectAllRdo1(this.store.getDisplayData());
    this.internal_configs.all_selected_rdo1 = true;
    this.internal_configs.all_selected_rdo2 = false;
    this.rdo1selectall.emit(this.store.getDisplayData());
    this.getSelectedValues();
  }

  selectAllRdo2(e) {
    this.treeTableService.selectAllRdo2(this.store.getDisplayData());
    this.internal_configs.all_selected_rdo1 = false;
    this.internal_configs.all_selected_rdo2 = true;
    this.rdo2selectall.emit(this.store.getDisplayData());
    this.getSelectedValues();
  }

  getSelectedValues() {
    let rdo1Nodes = this.store.getDisplayData().filter(rec => rec.leaf == true
      && (rec.rdo1_selected && rec.rdo1_selected == true));
    let rdo2Nodes = this.store.getDisplayData().filter(rec => rec.leaf == true
      && (rec.rdo2_selected && rec.rdo2_selected == true))
    this.selectedValues.emit({ rdo1Values: rdo1Nodes, rdo2Values: rdo2Nodes });
  }
}
