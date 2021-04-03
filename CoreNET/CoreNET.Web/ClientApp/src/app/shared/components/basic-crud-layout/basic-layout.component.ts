import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { CoreLayout } from '../../interfaces/core-layout.type';

@Component({
  selector: 'app-basic-layout',
  templateUrl: './basic-layout.component.html',
  styleUrls: ['./basic-layout.component.css'],
})
export class BasicLayoutComponent implements OnInit, CoreLayout {
  searchInput: string;
  readOnly = false;
  searchColumns: string;
  orderColumn: any[];
  tableDataTemplate: TemplateRef<any>;
  @Input() data: any[];
  @Output() addEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();
  @Output() viewDetailEvent = new EventEmitter<any>();
  @Input() config: any;

  ngOnInit(): void {
    this.orderColumn = this.config.view.orderColumn;
    this.searchColumns = this.config.view.searchColumns;
  }

  onAdd() {
    this.addEvent.emit();
  }

  onEdit(item: any) {
    this.editEvent.emit(item);
  }

  onDelete(item: any) {
    this.deleteEvent.emit(item);
  }

  cancel() {}

  onView(item: any) {
    this.viewDetailEvent.emit(item);
  }
}
