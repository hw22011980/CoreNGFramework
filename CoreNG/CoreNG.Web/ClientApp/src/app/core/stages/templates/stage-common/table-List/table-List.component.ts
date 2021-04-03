import { Component, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { StageView } from 'src/app/core/stages/stage.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StageDataType, StageResultDataType, Utils } from '../common-data-types';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { LoaderStageService } from 'src/app/core/services/loader-stage-service.components';
import { PublishDetailsService } from 'src/app/core/services/publish-details.service';
import { AddItemListComponent } from '../addItem-List/addItem-List.component';
import { StageNotification } from 'src/app/core/stages/stage.notification';
import { ToastrService } from 'ngx-toastr';
import { FormConfig } from 'src/app/core/stages/stage.config';
import { Envelop, EventMessage, ICrossComponentMsg } from 'src/app/core/common/cross-component-msg';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-List.component.html',
  styleUrls: ['./table-List.component.css']
})
export class DisplayProfileComponent extends StageNotification implements StageView, ICrossComponentMsg {

  @ViewChild('addItemchild') addItemChildComponent: AddItemListComponent;
  @Input() data: any;
  @Output() editEvent = new EventEmitter<any>();
  @Input() frmConfig: FormConfig;
  fields: StageDataType[] = [];
  oldFields: any;
  formStage: FormGroup;
  loadProfileDataToWrite: StageDataType = new StageDataType();

  submitted = true;
  issave = false;
  showEdit = false;
  isconnected = false;
  loadbtnShow = false;

  writeObjects: StageResultDataType[] = [];
  arrayWriteObjects: StageResultDataType[] = [];

  success = true;
  message: string;
  envelop: Envelop;
  lastError: string;

  constructor(private http: HttpClient,
    public loader: LoaderStageService,
    private emitDetails: PublishDetailsService,
    public toastrService: ToastrService) {
      super(toastrService);
    this.setEnvelop(null);
  }


  ngOnInit() {
    this.showEdit = false;
    this.setEnvelop(null);
    this.loadData();
  }
  setEnvelop(data) {
    this.envelop = new Envelop('NavMenuLeftComponent',
      'DisplayProfileComponent', 'Send boolean flag  on button press', data);
  }
  onSubscribedData() {
  }

  loadData() {
    this.editEvent.emit(false);
    console.log(this.data);
    if (this.data != '') {
      console.log(this.data);
      console.log(this.frmConfig.url);
      this.http.get(this.frmConfig.url).subscribe(
        fields => {
          console.log(fields);
          this.oldFields = JSON.parse(JSON.stringify(fields));
          this.reloadFields(fields);
        });
    }

  }

  private reloadFields(localFields: any) {
    this.lastError = '';

    this.formStage = new FormGroup({
      SubStageFormArray: new FormArray([])
    }, { updateOn: 'change' });

    this.fields = [];
    this.showEdit = (localFields != '');
    this.success = localFields.success;
    this.message = localFields.message;
    console.log(localFields);
    if (this.showEdit && this.getDataFromMetaData(localFields.data.items.find(x => x !== undefined))) {
      this.loadProfileDataToWrite.id = localFields.data.id;
      if (localFields.data.objectsRead != undefined) {
        this.getDataFromReadObjects(localFields.data.objectsRead.value);
      }
      this.createValidators();
    }
  }

  getDataFromMetaData(item: any): boolean {
    if (item != undefined) {
      for (let innerItem of item.items) {
        const loadProfileData: StageDataType = innerItem;
        this.fields.push(loadProfileData);
      }
      return true;
    } else {
      return false;
    }

  }

  getDataFromReadObjects(value: any) {

    for (let i = 0; i < value.length; i++) {
      let innerValue = value[i];
      this.fields[i].defaultValue = this.fields[i].value;
      this.fields[i].value = innerValue.value;
      this.fields[i].dataType = innerValue.dataType;
    }
  }

  createValidators() {
    for (const item of this.fields) {
      if (item.displayDataType === 'Table') {
        continue;
      }
      const arrValids = [Validators.required];

      if (item.min && item.min != 0) {
        if (item.dataType.toLowerCase().indexOf('string') >= 0) {  //string type
          arrValids.push(Validators.minLength(item.min));
        }
        else {
          arrValids.push(Validators.min(item.min));
        }           // numeric types
      }

      if (item.max && item.max != 0) {
        if (item.dataType.toLowerCase().indexOf('string') >= 0) {  //string types
          arrValids.push(Validators.maxLength(item.max));
        }
        else {
          arrValids.push(Validators.max(item.max));
        }           // numeric types
      }

      (this.formStage.get('SubStageFormArray') as FormArray).push(new FormControl(item.value, arrValids));
    }
  }

  changeValue(event) {
    console.log('Drowdownlist selection changed');
  }

  onSubmit(formStage) {
    if (this.issave) {
      this.refreshData();
      this.loadbtnShow = true;
      this.envelop.set(new EventMessage('disableClick', false));
      this.emitDetails.messageEmitter.next(this.envelop);
      this.getWriteObjects();

      data: [this.loadProfileDataToWrite]
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
      //    this.showSuccessToast('Values have been written to device \'' + this.data.plantNumber + '\'');
      //  }
      //);
    }
  }

  onCancel() {
    this.editEvent.emit(false);
    this.reloadFields(this.oldFields);
    this.addItemChildComponent.reloadData();
  }

  changedDataHandler(arrayWriteObjects: any) {
    this.arrayWriteObjects = arrayWriteObjects;
  }

  getWriteObjects() {
    // Reset everything
    this.writeObjects = [];
    for (let i = 0; i < this.fields.length; i++) {
      let result = null;
      const field = this.fields[i];
      if (field.displayDataType === 'Table') {
        result = new StageResultDataType(field.dataType, this.arrayWriteObjects.length, this.arrayWriteObjects);
      } else {
        result = new StageResultDataType(field.dataType, field.size, this.SubStageValues.at(i).value);
      }
      this.writeObjects.push(result);
    }
    this.loadProfileDataToWrite.value = JSON.stringify(new StageResultDataType('Structure', this.writeObjects.length, this.writeObjects));
  }

  get SubStageValues(): FormArray {
    return this.formStage.get('SubStageFormArray') as FormArray;
  }

  IsValidItem(indexNo: number) {
    const fc: FormControl = <FormControl>this.SubStageValues.at(indexNo);
    if (fc != null && fc.errors != null) {
      this.lastError = Utils.isValidInput(fc, this.fields[indexNo]);
      return !(fc.errors.required || fc.errors.min || fc.errors.max || fc.errors.minlength || fc.errors.maxlength);
    } else {
      this.lastError = '';
      return true;
    }
  }

  private refreshData() {
    // for UI when save button clicking
    for (let i = 0; i < this.fields.length; i++) {
      if (this.fields[i].displayDataType != 'Table') {
        this.fields[i].value = this.SubStageValues.at(i).value;
      }
    }
  }

  editedDataHasDifferences(): boolean {
    return false;
  }

}
