export class TableData {
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
  
  // for meta data template if data type is Array or Structure.
  items: any;

  // for all possible values of meter value.
  availableValues: any;

}

export class TableResultData{
  DataType: string;
  Size: number;
  Value: any;

  constructor(dataType: string, size: number, value: any){
    this.DataType = dataType;
    this.Size = size;
    this.Value = value;
  }
}