import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { TreeDataInput } from './tree-data-input';
import { Configs, TreeColumn } from './tree-data.model';
import { TreeTableService } from './tree-table.service';

@Component({
  selector: 'app-tree-table',
  templateUrl: './tree-table.component.html',
  styleUrls: ['./tree-table.component.css']
})
export class TreeTableComponent implements OnChanges, OnInit {

  processed_data: any[] = [];
  expand_tracker: any = {};
  columns: TreeColumn[] = [];
  internal_configs: any = {
    show_add_row: false,
    show_parent_col: false,
    all_selected: false,
    all_selected_rdo1: false,
    all_selected_rdo2: false
  };
  store = new TreeDataInput(this.treeTableService);

  @Input()
  data: any[];

  @Input()
  configs: Configs;

  default_configs: Configs = {
    css: {
      expand_class: 'plus',
      collapse_class: 'minus',
      row_selection_class: 'selected',
      header_class: '',
      row_filter_class: '',
      table_class: '',
      view_compare_class: ''
    },
    actions: {
      view_compare: false
    },
    data_loading_text: 'Loading...',
    filter: false,
    multi_select: false,
    compare_select: true,
    show_summary_row: false,
    subgrid: false,
    load_children_on_expand: false,
    action_column_width: '60px',
    row_class_function: () => true,
    subgrid_config: {
      show_summary_row: false,
      data_loading_text: 'Loading...'
    }
  };
  default_column_config: TreeColumn = {
    sorted: 0,
    sort_type: null,
    hidden: false,
    filter: true,
    case_sensitive_filter: false
  };

   @Output() cellclick: EventEmitter<any> = new EventEmitter();
   @Output() expand: EventEmitter<any> = new EventEmitter();
   @Output() collapse: EventEmitter<any> = new EventEmitter();
   @Output() rowselect: EventEmitter<any> = new EventEmitter();
   @Output() rowdeselect: EventEmitter<any> = new EventEmitter();
   @Output() rowselectall: EventEmitter<any> = new EventEmitter();
   @Output() rowdeselectall: EventEmitter<any> = new EventEmitter();
   @Output() rowadd: EventEmitter<any> = new EventEmitter();
   @Output() rowsave: EventEmitter<any> = new EventEmitter();
   @Output() rowdelete: EventEmitter<any> = new EventEmitter();

   @Output() rdo1select: EventEmitter<any> = new EventEmitter();
   @Output() rdo2select: EventEmitter<any> = new EventEmitter();
   @Output() rdo1selectall: EventEmitter<any> = new EventEmitter();
   @Output() rdo2selectall: EventEmitter<any> = new EventEmitter();
   @Output() selectedValues: EventEmitter<any> = new EventEmitter();

  constructor(private treeTableService: TreeTableService) { }

  ngOnInit() {
    if (!this.validateConfigs()) {
      return;
    }
    this.setDefaultConfigs();
    this.setColumnNames();
  }

  ngOnChanges() {
    if (!this.validateConfigs()) {
      return;
    }
    this.setDefaultConfigs();
    this.setColumnNames();
    this.store.processData(
      this.data,
      this.expand_tracker,
      this.configs,
      this.internal_configs
    );
  }

  validateConfigs() {
    if (!this.data) {
      window.console.warn('data can\'t be empty!');
      return;
    }
    if (!this.configs) {
      window.console.warn('configs can\'t be empty!');
      return;
    }
    const element = this.data[0];
    let isValidated = true;

    if (!this.configs.id_field) {
      isValidated = false;
      window.console.error('id field is mandatory!');
    }

    if (!this.configs.parent_id_field && !this.configs.subgrid) {
      isValidated = false;
      window.console.error('parent_id field is mandatory!');
    }

    if (element && !element.hasOwnProperty(this.configs.id_field)) {
      isValidated = false;
      console.error('id_field doesn\'t exist!');
    }

    if (element && !element.hasOwnProperty(this.configs.parent_id_field)
        && !this.configs.subgrid
        && !this.configs.load_children_on_expand) {
      isValidated = false;
      console.error('parent_id_field doesn\'t exist!');
    }

    if (element && !element.hasOwnProperty(this.configs.parent_display_field)) {
      isValidated = false;
      console.error('parent_display_field doesn\'t exist! Basically this field will be expanded.');
    }

    if (this.configs.subgrid && !this.configs.subgrid_config) {
      isValidated = false;
      console.error('subgrid_config doesn\'t exist!');
    }

    if (this.configs.subgrid && this.configs.subgrid_config && !this.configs.subgrid_config.id_field) {
      isValidated = false;
      console.error('id_field of subgrid doesn\'t exist!');
    }

    if (this.configs.subgrid && this.configs.subgrid_config && !this.configs.subgrid_config.columns) {
      isValidated = false;
      console.error('columns of subgrid doesn\'t exist!');
    }

    return isValidated;
  }

  setDefaultConfigs() {
    this.processed_data = [];
    this.configs = Object.assign({}, this.default_configs, this.configs);

    // Deep clone.
    this.configs.actions = Object.assign({}, this.default_configs.actions, this.configs.actions);
    this.configs.css = Object.assign({}, this.default_configs.css, this.configs.css);
    this.configs.subgrid_config = Object.assign({}, this.default_configs.subgrid_config, this.configs.subgrid_config);
  }

  setColumnNames() {
    this.columns = this.configs.columns ? this.configs.columns : [];

    // If columns doesn't exist in user's object.
    if (!this.configs.columns) {
      const column_keys = Object.keys(this.data[0]);

      // Insert Header and default configuration.
      column_keys.forEach(key => {
        this.columns.push(Object.assign({'header': key, 'name': key}, this.default_column_config));
      });
    } else {

      // Insert Header and default configuration.
      for (let i = 0; i < this.columns.length; i++) {
        this.columns[i] = Object.assign({}, this.default_column_config, this.columns[i]);
      }
    }
  }

  collapseAll() {
    this.treeTableService.collapseAll(this.expand_tracker);
  }

  expandAll() {
    this.treeTableService.expandAll(this.expand_tracker);
  }

  selectAllRdo1() {
    this.treeTableService.selectAllRdo1(this.store.getDisplayData());
    this.internal_configs.all_selected_rdo1 = true;
    this.internal_configs.all_selected_rdo2 = false;
  }

  selectAllRdo2() {
    this.treeTableService.selectAllRdo2(this.store.getDisplayData());
    this.internal_configs.all_selected_rdo1 = false;
    this.internal_configs.all_selected_rdo2 = true;
  }

  selectAll() {
    this.treeTableService.selectAll(this.store.getDisplayData());
    this.internal_configs.all_selected = true;
  }

  deSelectAll() {
    this.treeTableService.deSelectAll(this.store.getDisplayData());
    this.internal_configs.all_selected = false;
  }

  expandRow(row_id, suppress_event?: false) {
    this.treeTableService.expandRow(row_id, this.expand_tracker, this.expand, suppress_event,
         this.configs, this.store.getDisplayData(), this.store);
  }

  collapseRow(row_id, suppress_event?: false) {
    this.treeTableService.collapseRow(row_id, this.expand_tracker, this.collapse, suppress_event,
      this.configs, this.store.getDisplayData());
  }

  disableRowSelection(row_id) {
    this.treeTableService.disableRowSelection(this.store.getDisplayData(), this.configs, row_id);
  }

  enableRowSelection(row_id) {
    this.treeTableService.enableRowSelection(this.store.getDisplayData(), this.configs, row_id);
  }

  disableRowExpand(row_id) {
    this.treeTableService.disableRowExpand(this.store.getDisplayData(), this.configs, row_id);
  }

  enableRowExpand(row_id) {
    this.treeTableService.enableRowExpand(this.store.getDisplayData(), this.configs, row_id);
  } 
}
