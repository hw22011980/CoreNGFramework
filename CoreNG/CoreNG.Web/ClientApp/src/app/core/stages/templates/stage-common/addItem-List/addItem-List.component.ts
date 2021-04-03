import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StageDataType, StageResultDataType, Utils, DPFieldRule} from '../common-data-types';
import { DPTableRow, DPTableInformation, DPValidation } from '../table-List/table-List.model';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { StageNotification } from 'src/app/core/stages/stage.notification';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-addItem-List',
  templateUrl: './addItem-List.component.html',
  styleUrls: ['./addItem-List.component.css']
})
export class AddItemListComponent extends StageNotification implements OnInit {
  @Input() data: any; //table level items ( i.e json.data.items[0].items[] )
  @Input() editable: boolean = true;
  @Input() disable: boolean = true;
  @Input() addItem: string;
  @Input() editItem: string;
  @Input() deleteItem: string;
  @Input() saveItem: string;
  @Input() cancelItem: string;
  @Input() title: string;
  @Input() maxItem: number;
  @Input() 
  set message(value: string){
    if(value){
      this._message = this.sanitizer.bypassSecurityTrustHtml(value);
    }
  }
  @Output() dataChangeNotify: EventEmitter<StageResultDataType[]> = new EventEmitter();

  private _message;
  private visibles: boolean[] = [];
  private headers: string[] = [];
  templateColumns: StageDataType[] = [];
  private rows: DPTableRow[] = [];
  tableInformation: DPTableInformation; //HTML table rendered based on this
  isFirstRow: boolean = true;
  count: number = 0;
  selectedTableRow: DPTableRow;
  oldTableRow: DPTableRow;
  
  modalTitle: string;
  closeResult = '';
  editMode: boolean = false;

  formItem: FormGroup;
  lastError: string;
  enableSave: boolean;

  constructor(private modalService: NgbModal, private sanitizer:DomSanitizer, public toastrService: ToastrService) { 
    super(toastrService);
  }

  ngOnInit() {
    this.reloadData();
  }

  reloadData() {
    this.headers = [];
    this.rows = [];
    this.templateColumns = [];
    this.isFirstRow = true;
    this.count = 0;
    console.log(this.data);
    this.loadDataTemplate(this.data.items.find(x => x !== undefined)); //table level mata-items
    //this.data.value = objectsRead.value.value[] i.e Array of each row structure
    this.loadDataToTable(this.data.value); 
    this.tableInformation = new DPTableInformation(this.headers, this.visibles, this.rows);
    this.tableInformation.prepTableRules(""+this.data.defaultValue); //for table level unique row validation

    this.notifyDataChange(); //Fix: need to notify 1st time to fix TP#41577
  }
  
  loadDataToTable(data_values: any) {
    if(!Array.isArray(data_values)) return;
    for(var value of data_values){
      let columns: StageDataType[] = [];
      this.loadColumnDataValues(columns, value.value);
      let tableRow = new DPTableRow(columns);
      this.rows.push(tableRow);
    }
  }

  //this method prepares header-texts for table and meta-data column info
  loadDataTemplate(tblRowItem: any) {
    for(let col of tblRowItem.items ) {
      this.headers.push(col.name);
      this.visibles.push(col.visible);
      Utils.loadFieldRules(col);
      this.templateColumns.push(col);
    }
  }

  //this method called for each row to prepare column-data for given row (from objectsRead)
  loadColumnDataValues(columns: StageDataType[], row_value: any) {
    let max_columns = Math.min(this.templateColumns.length, row_value.length);

    for(let i=0; i < max_columns; i++) {
      let readData = row_value[i];
      let data: StageDataType = new StageDataType();
      let template: StageDataType = this.templateColumns[i];

      //Copying metadata value to actual data.
      Object.keys(template).forEach((key) => {
        data[key] = template[key]
      });

      data.defaultValue = data.value;
      data.value = readData.value;

      if(data.displayDataType === "DropDownList" || data.displayDataType === "DropDownTable") {
        data.textValue = this.getValueText(data.availableValues, data);
      }
      else if(data.displayDataType === "TimeBox") {
        if(!data.value)
          data.value = "";
        data.textValue = data.value
      }
      else{
        data.textValue = data.value;
      }
      columns.push(data);
    }
  }

  getValueText(availableValues: any, data: any): string {
    let item = this.getValueItem(availableValues, data);
    return (item)? item.name: "";
  }
  
  getValueItem(availableValues: any, data: any): any {
    if(availableValues && data && data.value.toString()) {
      for(let item of availableValues) {        
        if(item.value.toString() == data.value.toString()) {
          return item;
        }
      }
    }
    return null;
  }

  readModelWinCtrls() {
    this.selectedTableRow.Columns.forEach((column,i) => {
      //read from other basic form controls only if visible2
      if (column.visible2 && column.displayDataType != "DropDownTable")
        column.value = this.SubItemValues.at(i).value;
        
      if(column.displayDataType == "DropDownList" || column.displayDataType == "DropDownTable") {
        column.textValue = this.getValueText(column.availableValues, column);
      }
      else if(column.displayDataType == "TimeBox") {
        if(column.value)
          column.textValue = column.value;
        else
          column.value = column.textValue = "";
      }
      else {
        column.textValue = column.value;
      }
    });
  }

  //save current row values for future restore
  bakupRowForEdit() {
    this.oldTableRow = new DPTableRow([]);
    this.selectedTableRow.Columns.forEach(column => {
      let oldColumn = new StageDataType;
      // Copying data from one object to another object.
      Object.keys(column).forEach(key => oldColumn[key] = column[key]);
      this.oldTableRow.Columns.push(oldColumn);
    });
  }

  //creates modelWindow FormControls along with validators
  createValidators() {
    this.lastError = "";

    this.formItem = new FormGroup({
      SubItemFormArray : new FormArray([])
    }, { updateOn: 'change' });

    this.selectedTableRow.Columns.forEach(column => {
      let arrValids = [];
      //visible2=true decides to show control in modelWindow
      if(column.visible2) {
        if(column.displayDataType != "TimeBox")
          arrValids.push(Validators.required);
        if(column.min && column.min != 0){
          if(column.dataType.toLowerCase().indexOf("string")>=0)  //string types
            arrValids.push(Validators.minLength(column.min));
          else
            arrValids.push(Validators.min(column.min));
        }
        if(column.max && column.max != 0) {
          if(column.dataType.toLowerCase().indexOf("string")>=0)  //string types
            arrValids.push(Validators.maxLength(column.max));
          else
            arrValids.push(Validators.max(column.max));
        }
      }
      //create form controls along with validators
      column.hasValidator = (arrValids.length>0);
      column.Ctrl = new FormControl(column.value, arrValids);
      (this.formItem.get('SubItemFormArray') as FormArray).push(column.Ctrl);
    });
  }

  //restore current row with the saved values
  resetRowforCancel() {
    this.oldTableRow.Columns.forEach((oldColumn, index) => {
      let column = this.selectedTableRow.Columns[index];
      //Copying data from one object to another object.
      Object.keys(oldColumn).forEach((key) => {
        column[key] = oldColumn[key]
      });
    });
  }

  copyMetaDataForNewRow() {
    this.selectedTableRow = new DPTableRow([]);
    this.templateColumns.forEach(column => {
      let newColumn = new StageDataType;
      // Copying data from one object to another object.
      Object.keys(column).forEach(key => newColumn[key] = column[key]);
      
      if(newColumn.displayDataType === "DropDownList" || newColumn.displayDataType === "DropDownTable") {
        newColumn.defaultValue = newColumn.value;
        newColumn.value = "";
        newColumn.textValue = newColumn.value;
      }
      else if(newColumn.displayDataType == "TimeBox") {
        //for new record, push default value if available
        if(!this.editMode && newColumn.defaultValue)
          newColumn.value = newColumn.defaultValue;

        //empty string if undefind
        if (!newColumn.value)
          newColumn.value = "";

        newColumn.textValue = newColumn.value + "";
      }
      this.selectedTableRow.Columns.push(newColumn);
    });
  }

  deleteCheck(row: any) {
    this.showConfirmToast("Are you sure you want to delete "+ row.Columns[0].textValue +"?").onAction.subscribe(x =>{
      if(x.title === "Yes"){
        this.deleteRow(row);
      }
    }); 
  }

  deleteRow(row: any){
    this.tableInformation.Rows.forEach( (item, index) => {
      if(item === row) {
        this.tableInformation.Rows.splice(index, 1);
        this.notifyDataChange();
      }
    });
  }
  
  editModal(content, row: any) {
    this.modalTitle = "Edit "+ this.title;
    this.selectedTableRow = row;
    this.editMode = true;
    this.enableSave = this.isEnableSave(row);
    this.bakupRowForEdit();
    this.createValidators();
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'md-class', keyboard:false, backdrop:'static' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.notifyDataChange();
    }, (reason) => { 
      this.resetRowforCancel();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  isEnableSave(row){
    let enable = true;
    let i = 0;

    while((i < row.Columns.length) && enable){
      const val = String(row.Columns[i].value);
      const av = row.Columns[i].availableValues;
      if(row.Columns[i].displayDataType === "DropDownList" || row.Columns[i].displayDataType === "DropDownTable") {
        enable = av.some(rec => String(rec.value) === val);
      }
      i++;
    }
    return enable;
  }

  openModal(content) {
    let isMaxError = this.tableInformation.Rows.length >= this.maxItem;
    if(isMaxError) {
      this.showErrorToast(`Maximum number of ${this.title.toLowerCase()} are ${this.maxItem}. You cannot add new ${this.title.toLowerCase()}.`);
    }else{
      this.modalTitle = "Add New "+ this.title;
      this.editMode = false;
      this.enableSave = true;
      this.copyMetaDataForNewRow();
      this.createValidators();
      this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', windowClass: 'md-class', keyboard:false,  backdrop:'static'  }).result.then((result) => {
        this.tableInformation.Rows.push(this.selectedTableRow);
        this.closeResult = `Closed with: ${result}`;
        this.notifyDataChange();
      }, (reason) => { 
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  onDDLChangeValue(event,idx) {
    this.enableSave = this.validateEmpty();
  }

  validateEmpty(){  
    let htmlCollection: HTMLCollection = document.getElementsByClassName("drop-down-class");
    for (let i = 0; i < htmlCollection.length; i++) {
      let element = htmlCollection[i] as HTMLTextAreaElement;
      if(element.value === ""){
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  onTblSelectChange() {
    console.log(" drop down table - change ");
  }

  notifyDataChange() {
    let writeObjects: StageResultDataType[]=[];
    this.getWriteObjects(writeObjects);
    this.dataChangeNotify.emit(writeObjects);
  }

  getWriteObjects(writeObjects: StageResultDataType[]) {
    //Reset data everything.
    for(let row of this.tableInformation.Rows) {
      let simpleWriteObjects: StageResultDataType[] = [];
      for(let col of row.Columns) {
        let result = new StageResultDataType(col.dataType,col.size,col.value);
        if(col.displayDataType == "TimeBox" && !result.Value) {
          result.Value = "";
        }
        simpleWriteObjects.push(result);
      }
      writeObjects.push(new StageResultDataType("Structure", row.Columns.length, simpleWriteObjects));
    }
  }

  get SubItemValues() : FormArray {
    return this.formItem.get('SubItemFormArray') as FormArray;
  }

  onSave(modal:any) : boolean {
    this.readModelWinCtrls();

    //1. check for column level Rules
    let emptyChkRules:DPFieldRule[] = [];
    let emptyChkCols : StageDataType[] = [];
    for(let i=0; i< this.templateColumns.length; i++) {
      //consider non form validator columns for emptry check on row level
      let colSel = this.selectedTableRow.Columns[i];
      if(!colSel.hasValidator && colSel.visible2){
        emptyChkCols.push(colSel);
      }
      //checl for each column's respective rule
      for(let rule of  this.templateColumns[i].Rules){
        if(!rule.validate(colSel)) {
          if(rule.val=='empty'){  //mark empty check for later escalation
            emptyChkRules.push(rule);
          }
          else{
            this.showErrorToast(rule.errorMsg);
            return false;
          }
        }
      }
    }

    //2. check for row level check (for eg., empty column)
    if(emptyChkCols.length >0 && emptyChkRules.length >0){
      let iCount = 0;
      emptyChkCols.forEach(col => {
        if(col.value+"" == "")
          iCount++;
      });
      //if all are empty then show empty failed message
      if(iCount==emptyChkCols.length){
        this.showErrorToast(emptyChkRules[0].errorMsg);
        return false;
      }
    }

    //3. check for Table level Rules, single/combined fields of curRow unique in the table.rows
    let ok = true;
    this.tableInformation.validate(this.selectedTableRow).forEach(chk => {
      ok = false;
      this.showErrorToast(chk.Error, chk.ErrorTitle);
    });
    
    if(ok){
      modal.close('Save click');
      return true;
    }
    else{
      return false;
    }
  }

  onCancel(modal:any) {
    modal.dismiss('Cancel click');
  }

  IsValidItem(indexNo: number) {
    let fc : FormControl = <FormControl>this.SubItemValues.at(indexNo);
    if(fc!=null && fc.errors !=null && fc.touched && fc.dirty ) {
      this.lastError = Utils.isValidInput(fc, this.selectedTableRow.Columns[indexNo]);
      return !(fc.errors.required || fc.errors.min || fc.errors.max || fc.errors.minlength || fc.errors.maxlength);
    }
    else {
      this.lastError = "";
      return true;
    }
  }
}
