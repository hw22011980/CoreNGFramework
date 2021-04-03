import { Component, Input, OnInit } from '@angular/core';
import { TreeDataInput } from '../../../tree-data-input';
import { Configs, TreeColumn } from '../../../tree-data.model';
import { TreeTableService } from '../../../tree-table.service';

@Component({
  selector: '[app-filter-row]',
  templateUrl: './filter-row.component.html',
  styleUrls: ['./filter-row.component.css']
})
export class FilterRowComponent implements OnInit {
  search_values: any = {};

  @Input()
  store: TreeDataInput;

  @Input()
  columns: TreeColumn[];

  @Input()
  expand_tracker: any;

  @Input()
  configs: Configs;

  @Input()
  internal_configs: any;

  constructor(private treeTableService: TreeTableService) { }

  ngOnInit() {
    this.columns.forEach(column => {
      this.search_values[column.name] = '';
    });
  }

  filter() {
    this.store.filterBy(this.columns, Object.values(this.search_values));

    // Don't expand for subgrid.
    if (!this.configs.subgrid) {
      this.treeTableService.expandAll(this.expand_tracker);
    }
  }
}
