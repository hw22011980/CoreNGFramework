import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TreeDataInput } from '../../../tree-data-input';
import { Configs } from '../../../tree-data.model';

@Component({
  selector: '[app-tree-cell-actions]',
  templateUrl: './tree-cell-actions.component.html',
  styleUrls: ['./tree-cell-actions.component.css']
})
export class TreeCellActionsComponent implements OnInit, OnDestroy {

  @Input()
  store: TreeDataInput;

  @Input()
  configs: Configs;

  @Input()
  row_data: any;

  isModalOpen = false;
  meterValues = [];
  offlineValues = [];
  breadcrumbItems = [];

  constructor() { }

  ngOnInit() {
    this.initializeData();
  }

  ngOnDestroy() {
    // Remove Modal Backdrop when component destory....
    let htmlCollection = document.getElementsByClassName("inner-modal");
    for (let i = 0; i < htmlCollection.length; i++) {
      let element = htmlCollection[i];
      element.classList.remove("modal-backdrop");
      element.classList.remove("fade");
      element.classList.remove("show");
    }
  }

  processMeterValue(rec) {
    if (Array.isArray(rec.logicalMeterValue.value)) {
      for (let i = 0; i < rec.logicalMeterValue.value.length; i++) {
        let value = rec.logicalMeterValue.value[i];
        let strValue = "";
        for (let j = 0; j < value.value.length; j++) {
          let innerValue = value.value[j];
          strValue = j > 0 ? strValue + " |" : strValue;
          strValue += innerValue.name + "=" + innerValue.value;
        }
        this.meterValues.push(strValue);
      }
    } else if(rec.logicalMeterValue != undefined){
      this.meterValues.push(rec.name + "=" + (rec.logicalMeterValue.value ? rec.logicalMeterValue.value : ""));
    }
  }

  processOfflineValue(rec) {
    if (Array.isArray(rec.logicalOfflineValue.value)) {
      for (let i = 0; i < rec.logicalOfflineValue.value.length; i++) {
        let values = rec.logicalOfflineValue.value[i];
        let strValue = "";
        for (let j = 0; j < values.value.length; j++) {
          let innerValue = values.value[j];
          strValue = j > 0 ? strValue + " |" : strValue;
          strValue += innerValue.name + "=" + innerValue.value;
        }
        this.offlineValues.push(strValue);
      }
    } else if(rec.logicalOfflineValue != undefined){
      this.offlineValues.push(rec.name + "=" + (rec.logicalOfflineValue.value ? rec.logicalOfflineValue.value : ""));
    }
  }

  compareData(rec){
    this.processBreadcrumb(rec.pathx);
    this.processMeterValue(rec);
    this.processOfflineValue(rec);
    this.isModalOpen = true;
  }

  closeModal(){
    this.initializeData();
  }

  private initializeData(){
    this.meterValues = [];
    this.offlineValues = [];
    this.isModalOpen = false;
    this.breadcrumbItems = [];
  }

  processBreadcrumb(pathx){
    const parts = pathx.split('.');
    parts.forEach(id => {
      let rec = this.findRecord(Number(id))[0];
      this.breadcrumbItems.push({name: rec.name, leaf: rec.leaf});
    });
  }

  findRecord(id){
    return this.store.processed_data.filter(rec => rec[this.configs.id_field] === id);
  }
}
