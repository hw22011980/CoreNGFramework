import { EventEmitter } from '@angular/core';

export interface CoreLayout {
  config: any;
  deleteEvent?: EventEmitter<any>;
  editEvent?: EventEmitter<any>;
  addEvent?: EventEmitter<any>;
  viewDetailEvent?: EventEmitter<any>;
  data?: any[];
}
