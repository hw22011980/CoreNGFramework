import { Component, Input}  from '@angular/core';
import { FormControl } from '@angular/forms';
import { isNull } from 'util';

export class StageDataType {
  id: number;
  name: string;
  dataType: string;
  displayDataType: string;
  size: number;
  min: number;
  max: number;
  prefixUnit: string;
  postfixUnit: string;

  //for meter actual value.
  value: any;

  //for display value.
  textValue: string; 

  //for default value.
  defaultValue: any; 
  RuleStr: any;
  
  // for meta data template if data type is Array or Structure.
  items: any;

  // for all possible values of meter value.
  availableValues: any;
  bakupVals: any;

  readOnly: boolean;
  visible: boolean;  //for main page and Table level fields
  visible2: boolean; //only for Modal window fields

  hasValidator: boolean;
  Ctrl: FormControl;
  Rules: DPFieldRule[]=[];

  reset(all:boolean):any{
    let obj = {
      value: this.value,
      textValue: this.textValue
    };

    if(all && this.Ctrl){
      this.Ctrl.reset();
      this.Ctrl.markAsUntouched();
      this.availableValues = [];
    }
    this.value=null;
    this.textValue="";
    return obj; 
  }
  
  setVal(obj:any){    
    if(this.displayDataType == "DropDownList"){
      if(this.availableValues.length>0)
        this.value = this.availableValues[0].value;
      for(let o of this.availableValues) {      
        if(o.value.toString()==obj.value.toString()){
          this.value = obj.value;
          this.textValue = obj.textValue;
          break;
        }
      }
    }
    else{
      this.value = obj.value;
      this.textValue = obj.textValue;
    }
    if(this.Ctrl){
      this.Ctrl.setValue(this.value);
      this.Ctrl.markAsUntouched();
    }
  }
}

export class StageResultDataType{
  DataType: string;
  Size: number;
  Value: any;

  constructor(dataType: string, size: number, value: any){
    this.DataType = dataType;
    this.Size = size;
    this.Value = value;
  }
}

export class DPFieldRule{
  Type:string;
  key :string;
  val :string;
  showMsg :string;
  errorMsg:string;
  valid:boolean=true;
  constructor(params:string[]){
    if(params.length >=3){
      this.Type = params[0].trim();
      this.key = (params.length == 3)?"value":params[1].trim();
      this.val = params[params.length-2].trim();
      let serr = params[params.length-1].trim();
      this.showMsg = serr.endsWith(")")?serr.substring(0,serr.length-1):serr;
    }
  }

  validate(col:StageDataType):boolean{
    let retVal = true;
    if(this.val == 'empty') { // empty or blank value check
      retVal = ((col[this.key]+"") != "");
    }
    else if(this.val == 'null') { // null check
      retVal = !isNull(col[this.key]);
    }
    else { //any other value compare
      retVal = ((col[this.key]+"") == this.val +"");
    }
    if(!retVal)
      this.errorMsg = "Rule on column '"+col.name+"', "+this.showMsg;
    this.valid=retVal;
    return retVal;
  }
}

export class Utils{
  static splitMulti(sval:string, delim:string[]){
    delim.forEach(de => {
        sval = sval.split(de).join('~');
    });
    return sval.split("~");
  }
  static loadFieldRules(col:any){
    col.RuleStr = "";
    col.Rules = [];

    //prepare for field level rules    
    if(col.displayDataType == "DropDownTable")
      return;

    let strRule:string = (col.value+"").trim(); 
    col.value = "";
    strRule.split("|").forEach((sRule) => {
      let stemp = sRule.trim().toLowerCase();
      if(stemp.startsWith("default")){
        col.defaultValue = (sRule.trim()+"=").split("=")[1].trim();
      }
      else if(stemp.startsWith("rule") && stemp.indexOf("=")>0){
        col.RuleStr = sRule.trim().split("=")[1].trim();
        if(col.RuleStr.length>0) {
          let Rules = col.RuleStr.split(";");
          Rules.forEach((sRule)=>{
            let params = Utils.splitMulti(sRule.trim(),['(',',']);
            if(params.length >2)
              col.Rules.push(new DPFieldRule(params));
          });
        }
      }
    });
  }
  static isValidInput(fc:FormControl, col:any):string{
    let sErr = "";
    let sval = (col)?col.value+"":"";
    let sfcval = fc.value;
    if(fc.errors.required){
      sErr = "Empty or invalid ";
      sErr += (col.dataType.toLowerCase().indexOf("string")==-1)?"number":"input";
    }
    else if(fc.errors.min || fc.errors.max)
    {
      if(col.min && col.max)
        sErr = "Invalid, valid range is "+col.min+" to "+col.max;
      else if(fc.errors.min)
        sErr = "Invalid, value must be minimum "+col.min;
      else
        sErr = "Invalid, value can be maximum "+col.max;
    }
    else if(fc.errors.minlength)
      sErr = "Length must be at least "+fc.errors.minlength.requiredLength+" characters";
    else if(fc.errors.maxlength)
      sErr = "Length cannot exceed "+fc.errors.maxlength.requiredLength+" characters";

    return ((sErr.length>0)?("Error: "+sErr+"."):"");
  }
}