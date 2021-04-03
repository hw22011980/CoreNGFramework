import { Component, Input } from '@angular/core';
import { StageDataType, Utils } from '../common-data-types';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';


@Component({
  selector: 'app-dynamic-inputs',
  templateUrl: './dynamic-inputs.component.html',
  styleUrls: ['./dynamic-inputs.component.css']
})
export class DynamicInputsComponent extends StageDataType {
  @Input() data: any;
  @Input() formStage: FormGroup;
  @Input() showEdit : boolean; 
  @Input() loadbtnShow : boolean;
  @Input() lastError: string;

  constructor() {
    super();
  }

  ngOnInit() {
  }

  get SubStageValues() : FormArray {
    return this.formStage.get('SubStageFormArray') as FormArray;
  }

  IsValidItem(indexNo: number){
    let fc : FormControl = <FormControl>this.SubStageValues.at(indexNo);
    if(fc!=null && fc.errors !=null && fc.touched && fc.dirty)
    {
      this.lastError = Utils.isValidInput(fc, this.data[indexNo]);
      return !(fc.errors.required || fc.errors.min || fc.errors.max || fc.errors.minlength || fc.errors.maxlength);
    }
    else
    {
      this.lastError = "";
      return true;
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  
}