import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Configs, TreeColumn } from '../tree-data.model';

@Component({
  selector: 'app-tree-cell',
  templateUrl: './tree-cell.component.html',
  styleUrls: ['./tree-cell.component.css']
})
export class TreeCellComponent implements OnInit {
  is_expand_column: boolean;
  show_expand_icon: boolean;
  cell_value: string;
  @Input()
  configs: Configs;

  @Input()
  index: number;

  @Input()
  row_data: any;

  @Input()
  column: TreeColumn;

  @Input()
  expand_tracker: any;

  @Input()
  cellclick: EventEmitter<any>;

  @Output() rowexpand: EventEmitter<any> = new EventEmitter();
  @Output() rowcollapse: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.is_expand_column = this.index === 0;
    this.show_expand_icon = !this.row_data.leaf;

    // If user mentions a node as leaf.
    if (this.configs.load_children_on_expand) {
      this.show_expand_icon = !this.row_data.leaf_node;
    }
    this.cell_value = this.row_data[this.column.name];
  }

  expandRow(event) {
    if (this.index === 0 && (!this.row_data.leaf || this.configs.load_children_on_expand)) {
      this.rowexpand.emit({ event: event, data: this.row_data });
      event.stopPropagation();
    }
  }

  collapseRow(event) {
    if (this.index === 0 && (!this.row_data.leaf || this.configs.load_children_on_expand)) {
      this.rowcollapse.emit({ event: event, data: this.row_data });
      event.stopPropagation();
    }
  }

  onCellClick(event) {
    this.cellclick.emit({ column: this.column, row: this.row_data, event: event });
  }
}
