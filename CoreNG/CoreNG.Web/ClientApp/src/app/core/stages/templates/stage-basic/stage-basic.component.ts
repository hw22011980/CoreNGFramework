import { Component, Input, ViewChild, Output, EventEmitter}  from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { LoaderStageService } from 'src/app/core/services/loader-stage-service.components';
import { PublishDetailsService } from 'src/app/core/services/publish-details.service';
import { Envelop, EventMessage, ICrossComponentMsg } from 'src/app/core/common/cross-component-msg';
import { StageView } from '../../stage.interface';
import { FormConfig } from '../../stage.config';
import { StageNotification } from '../../stage.notification';
import { DynamicInputsComponent } from '../stage-common/dynamic-inputs/dynamic-inputs.component';


@Component({
  selector: 'app-stage-basic',
  templateUrl: './stage-basic.component.html',
  styleUrls: ['./stage-basic.component.css']
})
export class StageBasicComponent extends StageNotification implements StageView , ICrossComponentMsg {
  @ViewChild('dynamicInputsChild') dynamicInputsChildComponent: DynamicInputsComponent;
  @Input() data: any;
  @Output() editEvent = new EventEmitter<any>();
  @Input() frmConfig: FormConfig;
  editedDataInitial: any;
  editedDataCurrent: any;
  fields: any;
  oldfields: any;
  submitted = true;
  canSave = false;
  showEdit = false;
  editable = false;
  hasItems = false;
  isconnected = false;
  loadbtnShow = false;
  deviceId: string;
  urldata: string;
  formStage: FormGroup;
  lastError: string;
  isCancelled = false;
  envelop : Envelop;
  constructor(public http: HttpClient,
    private activatedRoute: ActivatedRoute,
    public loader: LoaderStageService,
    private emitDetails: PublishDetailsService,
    public toastrService: ToastrService) {
    super(toastrService);
    this.setEnvelop(null);
  }

  ngOnInit() {
    this.showEdit = false;
    this.hasItems = false;
    this.setEnvelop(null);

    this.loaddata();
  }

  setEnvelop(data)
  {
    this.envelop = new Envelop('NavMenuLeftComponent', 'StageBasicComponent', 
    'Send selected status to navigation bar', data );
  }
  onSubscribedData()
  {
  }

  onSubmit(formStage) {
    this.submitted = true;
    if (this.canSave) {
      for (let i = 0; i < this.fields.data.items.length; i++) {
        // fill the value of the dynamic control into data object
        this.fields.data.items[i].value = this.SubStageValues.at(i).value.toString();

        // also fill the objectsRead if available
        if (this.fields.data.objectsRead != null && this.fields.data.items[i]) {
          if ( this.fields.data.items[i].displayDataType === 'NumericBox') {
            this.fields.data.objectsRead.value[i].value = parseInt(this.fields.data.items[i].value);
          } else {
            this.fields.data.objectsRead.value[i].value = this.fields.data.items[i].value;
          }
        }
      }
      this.loadbtnShow = true;
      this.envelop.set(new EventMessage('disableClick', false));
      this.emitDetails.messageEmitter.next(this.envelop);
      //this.SetupService.setValue(this.fields).subscribe(
      //  data => {
      //    this.fields = data;
      //    this.loadbtnShow = false;
      //    this.envelop.set(new EventMessage('disableClick', true));
      //    this.emitDetails.messageEmitter.next(this.envelop);
      //    this.loaddata();
      //    if (data['success'] && data['success'] === true) {
      //      console.log(this.data);
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

  editedDataHasDifferences(): boolean {
    for (let i = 0; i < this.fields.data.items.length; i++) {
      this.fields.data.items[i].value = this.SubStageValues.at(i).value.toString();
      if (this.fields.data.objectsRead != null && this.fields.data.items[i]) {
        if ( this.fields.data.items[i].displayDataType == 'NumericBox') {
          this.fields.data.objectsRead.value[i].value = parseInt(this.fields.data.items[i].value);
        } else {
          this.fields.data.objectsRead.value[i].value = this.fields.data.items[i].value;
        }
      }
    }
    this.editedDataCurrent = JSON.parse(JSON.stringify(this.fields.data.objectsRead));
    return (JSON.stringify(this.editedDataInitial) !== JSON.stringify(this.editedDataCurrent));
  }

  btnEdit() {
    this.editEvent.emit(true);
    for (let i = 0; i < this.fields.data.items.length; i++) {
      this.fields.data.items[i].value = this.SubStageValues.at(i).value.toString();
      if (this.fields.data.objectsRead != null && this.fields.data.items[i]) {
        if ( this.fields.data.items[i].displayDataType == 'NumericBox') {
          this.fields.data.objectsRead.value[i].value = parseInt(this.fields.data.items[i].value);
        } else {
          this.fields.data.objectsRead.value[i].value = this.fields.data.items[i].value;
        }
      }
    }
    this.editedDataInitial = JSON.parse(JSON.stringify(this.fields.data.objectsRead));
    this.showEdit = false;
    this.submitted = false;
    this.oldfields = JSON.parse(JSON.stringify(this.fields));
  }

  btnSave() {
    this.editEvent.emit(false);
    this.canSave = true;
  }

  btnCancel() {
    this.editEvent.emit(false);
    this.submitted = true;
    this.canSave = false;
    this.reloadFields(this.oldfields);
  }

  get SubStageValues(): FormArray {
    return this.formStage.get('SubStageFormArray') as FormArray;
  }

  loaddata() {
    this.editEvent.emit(false);
    this.envelop.set(new EventMessage('disableClick', false));
    this.emitDetails.messageEmitter.next(this.envelop);
    this.lastError = '';
    console.log(this.data);

    if (this.data !== '' && this.data.id > 0) {
      console.log(this.frmConfig.url);
      this.http.get(this.frmConfig.url).subscribe(
        data => {
          console.log(data);
          //if (data.success) {
            this.reloadFields(data);
          //} else {
          //  this.showErrorToast('Read ' + this.frmConfig.title + ' is not success');
          //}
          this.envelop.set(new EventMessage('disableClick', true));
          this.emitDetails.messageEmitter.next(this.envelop);
        },
        (error) => {
          if (!!error) {
            console.log(error);
            this.showErrorToast(error.message);
          }
          this.envelop.set(new EventMessage('disableClick', true));
          this.emitDetails.messageEmitter.next(this.envelop);
        }
      );
      //this.SetupService.getValue(this.data.id).subscribe(
      //  data => {
      //    if (data.success) {
      //      this.reloadFields(data);
      //    } else {
      //      this.showErrorToast('Read ' + this.frmConfig.title + ' is not success');
      //    }
      //    this.envelop.set(new EventMessage('disableClick', true));
      //    this.emitDetails.messageEmitter.next(this.envelop);
      //  },
      //  (error) => {
      //    this.showErrorToast(error.message);
      //    this.envelop.set(new EventMessage('disableClick', true));
      //    this.emitDetails.messageEmitter.next(this.envelop);
      //  }
      //);
    }
  }

  private reloadFields(localfields: any) {
    this.formStage = new FormGroup({
      SubStageFormArray : new FormArray([])
    }, { updateOn: 'change' });

    this.fields = localfields;
    this.showEdit = (localfields !== '');
    this.editable = (localfields !== '') && (localfields.data && !localfields.data.readOnly);
    this.hasItems = false;
    const thisdata = this.fields.data;
    if (this.showEdit && thisdata && thisdata.items) {
      this.hasItems = thisdata.items.length > 0;
      for (let i = 0; i < thisdata.items.length; i++) {
        if (thisdata.objectsRead != null && thisdata.objectsRead.value[i]) {
          this.fields.data.items[i].value = thisdata.objectsRead.value[i].value;
        }
      }
    }

    // create form controls along with validators
    if (this.hasItems) {
      this.createValidators(this.formStage.get('SubStageFormArray') as FormArray, this.fields.data.items);
    }

  }

  private createValidators(fa: FormArray, items: any): any {
    // creating Validators dynamically
    for (let i = 0; i < items.length ; i++) {
      const arrValids = [];
      const item = items[i];
      if (item.displayDataType != 'CheckBox') {
        if (item.displayDataType != 'TimeBox') {
          arrValids.push(Validators.required);
        }
        if (item.min && item.min != '0') {
          if (item.dataType.toLowerCase().indexOf('string') >= 0) {  // string type
            arrValids.push(Validators.minLength(parseInt(item.min)));
          } else {
            arrValids.push(Validators.min(parseInt(item.min)));
          }
        }
        if (item.max && item.max != '0') {
          if (item.dataType.toLowerCase().indexOf('string') >= 0) {  // string type
            arrValids.push(Validators.maxLength(parseInt(item.max)));
          } else {
            arrValids.push(Validators.max(parseInt(item.max)));
          }
        }
      }
      // create form controls along with validators
      fa.push(new FormControl(item.value, arrValids)); // object data
    }
  }


}
