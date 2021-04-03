import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TreeDataInput } from '../tree-data-input';
import { Configs, TreeColumn } from '../tree-data.model';
import { TreeTableService } from '../tree-table.service';

@Component({
  selector: '[app-tree-body]',
  templateUrl: './tree-body.component.html',
  styleUrls: ['./tree-body.component.css']
})
export class TreeBodyComponent implements OnInit {
  parents: any[] = [];
  raw_data: any[];
  display_data: any[];

  @Input()
  store: TreeDataInput;

  @Input()
  configs: Configs;

  @Input()
  expand_tracker: any;

  @Input()
  internal_configs: any;

  @Input()
  columns: TreeColumn[];

  @Input()
  cellclick: EventEmitter<any>;

  @Input()
  expand: EventEmitter<any>;

  @Input()
  collapse: EventEmitter<any>;

  @Input()
  rowselect: EventEmitter<any>;

  @Input()
  rowdeselect: EventEmitter<any>;

  @Input()
  rdo1select: EventEmitter<any>;

  @Input()
  rdo2select: EventEmitter<any>;

  @Input()
  selectedValues: EventEmitter<any>;

  constructor(private treeTableService: TreeTableService) {
  }

  ngOnInit() {
    this.display_data = this.store.getDisplayData();
    this.treeTableService.display_data_observable$.subscribe((store) => {
      this.display_data = this.store.getDisplayData();
      this.setParents();
    });
    this.setParents();
  }

  setParents() {
    this.parents = this.store.raw_data.map(
      element => {
        return {
          'id': element[this.configs.id_field],
          'value': element[this.configs.parent_display_field]
        };
      }
    );
  }

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

    if (!this.configs.load_children_on_expand) {
      this.expand_tracker[row_data.pathx] = true;
      this.expand.emit(event);
    } else {
      this.treeTableService.emitExpandRowEvent(this.expand_tracker, this.expand, this.store, row_data, this.configs);
    }
  }

  onRowCollapse(event) {
    const row_data = event.data;
    this.expand_tracker[row_data.pathx] = false;

    // Collapse all of its children.
    const keys = Object.keys(this.expand_tracker);
    keys.forEach(key => {
      if (key.indexOf(row_data.pathx) !== -1) {
        this.expand_tracker[key] = 0;
      }
    });

    this.collapse.emit(event);
  }

  selectRow(row_data, event) {

    // Don't run if Multi select is enabled.
    if (this.configs.multi_select) {
      return;
    }

    this.store.getDisplayData().forEach(data => {
      data.row_selected = false;
    });
    row_data.row_selected = true;
    this.rowselect.emit({ data: row_data, event: event });
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

  selectRowOnRdo1(row_data, event) {
    row_data.rdo1_selected = true;
    row_data.rdo2_selected = false;
    this.rdo1select.emit({ data: row_data, event: event });
    this.setSelectRowsOnRdo1(row_data);
    this.setSelectAllRdo1Config();
    this.getSelectedValues();
  }

  selectRowOnRdo2(row_data, event) {
    row_data.rdo1_selected = false;
    row_data.rdo2_selected = true;
    this.rdo2select.emit({ data: row_data, event: event });
    this.setSelectRowsOnRdo2(row_data);
    this.setSelectAllRdo2Config();
    this.getSelectedValues();
  }

  setSelectAllRdo1Config() {
    let select_all = true;
    this.store.getDisplayData().forEach(data => {
      if (!data.rdo1_selected) {
        select_all = false;
      }
    });
    this.internal_configs.all_selected_rdo1 = select_all;
    this.internal_configs.all_selected_rdo2 = false;
  }

  setSelectAllRdo2Config() {
    let select_all = true;
    this.store.getDisplayData().forEach(data => {
      if (!data.rdo2_selected) {
        select_all = false;
      }
    });
    this.internal_configs.all_selected_rdo2 = select_all;
    this.internal_configs.all_selected_rdo1 = false;
  }

  setSelectRowsOnRdo1(row_data) {
    if (row_data[this.configs.parent_id_field] < 1) { // This is root level parent
      //Need to find all descendent(children)
      this.selectAllChildren(row_data[this.configs.id_field], 'rdo1_selected', 'rdo2_selected');
    } else if (row_data.leaf) { // This is lead
      this.selectAllParent(row_data.pathx, 'rdo1_selected', 'rdo2_selected');
    } else { // This is subchildren
      this.selectRows(row_data, 'rdo1_selected', 'rdo2_selected');
    }
  }

  setSelectRowsOnRdo2(row_data) {
    if (row_data[this.configs.parent_id_field] < 1) { // This is root level parent
      //Need to find all descendent(children)
      this.selectAllChildren(row_data[this.configs.id_field], 'rdo2_selected', 'rdo1_selected');
    } else if (row_data.leaf) { // This is lead
      this.selectAllParent(row_data.pathx, 'rdo2_selected', 'rdo1_selected');
    } else { // This is subchildren
      this.selectRows(row_data, 'rdo2_selected', 'rdo1_selected');
    }
  }

  selectRows(row_data, field1, field2){
    this.selectAllChildren(row_data[this.configs.id_field], field1, field2);
    this.selectAllParent(row_data.pathx, field1, field2);
  }

  findChildren(id: number) {
    return this.store.getDisplayData().filter(rec => rec[this.configs.parent_id_field] === id);
  }

  selectAllChildren(id: number, field1: string, field2: string) {
    let children = this.findChildren(id);
    children.forEach(rec => {
      rec[field1] = true;
      rec[field2] = false;
      this.selectAllChildren(rec.id, field1, field2);
    });
  }

  selectedAllSameLevel(parent_id: number, field: string) {
    let nodes = this.store.getDisplayData().filter(rec => rec[this.configs.parent_id_field] === parent_id);
    return nodes.every(rec => rec[field] === true);
  }

  selectAllParent(pathx: any, field1: string, field2: string) {
    let paths = pathx.split(".").reverse();
    let selectedAll = false;
    for (let i = 0; i < paths.length; i++) {
      let path = paths[i];
      let node = this.store.getDisplayData().find(rec => rec[this.configs.id_field] == path);
      if(selectedAll){
        node[field1] = true;
      }
      node[field2] = false;
      selectedAll = (selectedAll && node.parent < 1) || this.selectedAllSameLevel(node.parent, field1);
    }
  }

  getSelectedValues() {
    let rdo1Nodes = this.store.getDisplayData().filter(rec => rec.leaf == true
      && (rec.rdo1_selected && rec.rdo1_selected == true));
    let rdo2Nodes = this.store.getDisplayData().filter(rec => rec.leaf == true
      && (rec.rdo2_selected && rec.rdo2_selected == true))
    this.selectedValues.emit({ rdo1Values: rdo1Nodes, rdo2Values: rdo2Nodes });
  }

}
