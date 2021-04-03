import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { Configs } from '../../../tree-data.model';

@Component({
  selector: '[app-subgrid-body]',
  templateUrl: './subgrid-body.component.html',
  styleUrls: ['./subgrid-body.component.css']
})
export class SubgridBodyComponent implements OnInit {
  @Input()
  configs: Configs;

  @Input()
  expand_tracker: any;

  @Input()
  row_data: any;

  @Input()
  cellclick: EventEmitter<any>;

  constructor() { }

  ngOnInit() {
  }

}
