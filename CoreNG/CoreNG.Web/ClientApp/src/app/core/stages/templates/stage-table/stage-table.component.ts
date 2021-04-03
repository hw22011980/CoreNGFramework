import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { StageView } from 'src/app/core/stages/stage.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LoaderStageService } from 'src/app/core/services/loader-stage-service.components';
import { PublishDetailsService } from 'src/app/core/services/publish-details.service';
import { TableData, TableResultData } from './stage-table.component.model';
import { AddItemListComponent } from '../stage-common/addItem-List/addItem-List.component';
import { StageNotification } from '../../stage.notification';
import { ToastrService } from 'ngx-toastr';
import { FormConfig } from '../../stage.config';
import { Utils } from '../stage-common/common-data-types';
import { Envelop, EventMessage, ICrossComponentMsg } from 'src/app/core/common/cross-component-msg';

@Component({
  selector: 'app-Table',
  templateUrl: './stage-table.component.html',
  styleUrls: ['./stage-table.component.css']
})
export class StageTableComponent extends StageNotification implements StageView, ICrossComponentMsg {

  @ViewChild('addItemchild') addItemChildComponent: AddItemListComponent;
  @Input() data: any;
  @Output() editEvent = new EventEmitter<any>();
  @Input() frmConfig: FormConfig;
  editedDataInitial: TableData = new TableData();
  editedDataCurrent: TableData = new TableData();
  fields: TableData[] = [];
  oldFields: any;
  formStage: FormGroup;
  TableDataToWrite: TableData = new TableData();

  submitted = true;
  issave = false;
  editable = false;
  isconnected = false;
  loadbtnShow = false;

  childWriteVals: TableResultData[] = [];

  success = true;
  message: string;
  envelop: Envelop;
  addItemMessage: string;
  lastError: string;

  constructor(private http: HttpClient,
    public loader: LoaderStageService,
    private emitDetails: PublishDetailsService,
    public toastrService: ToastrService) {
      super(toastrService);
    this.setEnvelop(null);
  }

  ngOnInit() {
    this.editable = false;
    this.setEnvelop(null);
    this.loadData();
  }

  setEnvelop(data) {
    this.envelop = new Envelop(['NavMenuLeftComponent', 'HeaderComponent'],
      'StageTableComponent', 'Send boolean flag  on button press', data);
  }
  onSubscribedData(data) {

  }

  loadData() {
    this.formStage = new FormGroup({
      SubStageFormArray: new FormArray([])
    }, { updateOn: 'change' });

    this.editEvent.emit(false);
    this.envelop.set(new EventMessage('disableClick', false));
    this.emitDetails.messageEmitter.next(this.envelop);
    console.log(this.data);
    if (this.data !== '') {
      console.log(this.frmConfig.url);
      this.http.get(this.frmConfig.url).subscribe(
        data => {
          console.log(data);
          this.oldFields = JSON.parse(JSON.stringify(data));
          this.reloadFields(data);
          this.envelop.set(new EventMessage('disableClick', true));
          this.emitDetails.messageEmitter.next(this.envelop);
        },
        (error) => {
          this.showErrorToast(error.message);
          this.envelop.set(new EventMessage('disableClick', true));
          this.emitDetails.messageEmitter.next(this.envelop);
        });
    }
    //if (this.data !== '') {
    //    this.SetupService.getValue(this.data.id).subscribe(
    //    resJson => {
    //      this.oldFields = JSON.parse(JSON.stringify(resJson));
    //      this.reloadFields(resJson);
    //      this.envelop.set(new EventMessage('disableClick', true));
    //      this.emitDetails.messageEmitter.next(this.envelop);
    //    },
    //    (error) => {
    //      this.showErrorToast(error.message);
    //      this.envelop.set(new EventMessage('disableClick', true));
    //      this.emitDetails.messageEmitter.next(this.envelop);
    //    });
    //}
  }

  private reloadFields(resJson: any) {
    this.lastError = '';

    this.formStage = new FormGroup({
      SubStageFormArray: new FormArray([])
    }, { updateOn: 'change' });
    console.log(this.formStage);

    this.fields = [];
    this.editable = (resJson != '') && (resJson.data && !resJson.data.readOnly);
    this.success = resJson.success;
    this.message = resJson.message;
    if (this.editable && this.getDataFromMetaData(resJson.data.items.find((x: any) => x !== undefined))) {
      this.TableDataToWrite.id = resJson.data.id;
      this.addItemMessage = resJson.data.message;
      if (resJson.data.objectsRead != null) {
        console.log(resJson.data.objectsRead);
        this.getDataFromReadObjects(resJson.data.objectsRead.value);
      }
      this.createValidators();
    }
  }

  getDataFromMetaData(Item0: any): boolean {
    if (Item0 != undefined) {
      for (const innerItem of Item0.items) {
        const TableData: TableData = innerItem;
        TableData.defaultValue = TableData.value; // preserve metadata-default-value before overwrite anywhere
        this.fields.push(TableData);
      }
      return true;
    } else {
      return false;
    }
  }

  getDataFromReadObjects(objRd_value: any) {
    for (let i = 0; i < objRd_value.length; i++) {
      const innerValue = objRd_value[i];
      // update stage-table level values ( i.e objects-read ) from meter
      this.fields[i].value = innerValue.value;
      this.fields[i].dataType = innerValue.dataType;
    }
  }

  createValidators() {
    for (const item of this.fields) {
      if (item.displayDataType === 'Table') {
        continue;
      }
      const arrValids = [];
      if (item['visible']) {
        if (item.displayDataType != 'TimeBox') {
          arrValids.push(Validators.required);
        }
        if (item.min && item.min != 0) {
          if (item.dataType.toLowerCase().indexOf('string') >= 0) {  // string type
            arrValids.push(Validators.minLength(item.min));
          } else {
            arrValids.push(Validators.min(item.min));
          }           // numeric types
        }
        if (item.max && item.max != 0) {
          if (item.dataType.toLowerCase().indexOf('string') >= 0) {  // string types
            arrValids.push(Validators.maxLength(item.max));
          } else {
            arrValids.push(Validators.max(item.max));
          }           // numeric types
        }
      }
      (this.formStage.get('SubStageFormArray') as FormArray).push(new FormControl(item.value, arrValids));
    }
  }

  OnDropdownChange(event: { target: { value: any; }; }) {
    console.log('Drowdownlist selection changed');
    console.log(event.target.value);
  }

  onSubmit(formStage: any) {
    this.submitted = true;
    if (this.issave) {
      this.refreshData();
      this.loadbtnShow = true;
      this.envelop.set(new EventMessage('disableClick', false));
      this.emitDetails.messageEmitter.next(this.envelop);
      this.getWriteObjects();

      data: [this.TableDataToWrite]
      let headers = new HttpHeaders();
      headers = headers.append('Refresh', 'true');
      const options = { headers: headers };
      //this.SetupService.SetObject(
      //  body,
      //  headers
      //).subscribe(
      //  data => {
      //    this.loadbtnShow = false;
      //    this.envelop.set(new EventMessage('disableClick', true));
      //    this.emitDetails.messageEmitter.next(this.envelop);
      //    this.loadData();
      //    if (data['success'] && data['success'] === true) {
      //      this.showSuccessToast('Values have been written to device \'' + this.data.plantNumber +'\'');
      //    } else {
      //      this.showErrorToast(data['message']);
      //    }
      //  },
      //  (error) => {
      //    this.showErrorToast(error.message);
      //  }
      //);
    }
  }

  private refreshData() {
    // for UI when save button clicking
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].displayDataType !== 'Table') {
        this.fields[i].value = this.SubStageValues.at(i).value;
      }
    }
  }

  editedDataHasDifferences(): boolean {
    this.getWriteObjects();
    this.editedDataCurrent = JSON.parse(JSON.stringify(this.TableDataToWrite));
    return (JSON.stringify(this.editedDataInitial) !== JSON.stringify(this.editedDataCurrent));
  }

  onEdit() {
    this.editEvent.emit(true);
    this.getWriteObjects();
    this.editedDataInitial = JSON.parse(JSON.stringify(this.TableDataToWrite));
    this.editable = false;
    this.submitted = false;
  }

  onSave() {
    this.editEvent.emit(false);
    this.issave = true;
  }

  onCancel() {
    this.editEvent.emit(false);
    this.editable = true;
    this.submitted = true;
    this.issave = false;
    this.reloadFields(this.oldFields);
    this.addItemChildComponent.reloadData();
  }

  changedDataHandler(arrChildVals: any) {
    this.childWriteVals = arrChildVals;
  }

  getWriteObjects() {
    // Reset everything
    const writeObjects = [];
    // loops for sibling level fields & TableRows
    // for eg: (2 fields + Table_Rows for load profile, 0 fields + Table_Rows for Register Assignment )
    for (let i = 0; i < this.fields.length; i++) {
      let result = null;
      const field = this.fields[i];
      if (field.displayDataType === 'Table' || field.dataType === 'Array') {
        // flows here for 'load profile' & 'Register Assignment'
        result = new TableResultData(field.dataType, this.childWriteVals.length, this.childWriteVals);
      } else {
        result = new TableResultData(field.dataType, field.size, this.SubStageValues.at(i).value);
      }
      writeObjects.push(result);
    }
    this.TableDataToWrite.value = new TableResultData('Structure', writeObjects.length, writeObjects);
  }

  get SubStageValues(): FormArray {
    return this.formStage.get('SubStageFormArray') as FormArray;
  }

  IsValidItem(indexNo: number) {
    const fc: FormControl = <FormControl>this.SubStageValues.at(indexNo);
    if (fc != null && fc.errors != null && fc.touched && fc.dirty) {
      this.lastError = Utils.isValidInput(fc, this.fields[indexNo]);

      return !(fc.errors.required || fc.errors.min || fc.errors.max || fc.errors.minlength || fc.errors.maxlength);
    } else {
      this.lastError = '';
      return true;
    }
  }
}
