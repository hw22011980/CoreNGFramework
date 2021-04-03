import { Component, forwardRef, OnInit, AfterViewInit, Input, ViewChild, Injector } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, NgControl, FormControl} from '@angular/forms';
import { NgbPopover, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { noop } from 'rxjs';
import { Router } from '@angular/router';
import { min } from 'rxjs/operators';
import { DPTableRow, DPTableInformation } from 'src/app/core/stages/templates/stage-common/table-List/table-List.model';

@Component({
  selector: 'app-table-selector',
  templateUrl: './table-selector.component.html',
  styleUrls: ['./table-selector.component.css'],
  providers: [   
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TableSelectorComponent),
      multi: true
    }
  ]
})
export class TableSelectorComponent implements ControlValueAccessor, OnInit, AfterViewInit {

  @Input()
  valueText: any;
  valueSelected: string;  
  @Input()
  data: any;
  @Input()
  rowData: DPTableRow;
  //this is the selectedRow of Gird passed to modelwindow

  @Input()
  disabled = false;

  @Input()
  private minkeyLen = 1;

  @Input()
  readonly = false;

  @Input()
  isEditMode = false;
  
  @Input()
  delimiter : string = "|";

  @ViewChild(NgbPopover)
  private popover: NgbPopover;

  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;

  ngControl: NgControl;

  private firstTimeAssign = true;  
  private selRow: any;
  private colHeadersAll : string[]; //all columns
  private colHeaders : string[];  //only visible columns 
  //private colProcess : any[];
  private tblRowsAll: any = [];
  private rowItems: any = [];
  private strFilter: string = "";
  private ProcessFields: any [];
    
  constructor(private config: NgbPopoverConfig, private inj: Injector, private router: Router) { 
    config.autoClose = 'outside';
    config.placement = 'auto';
  }

  ngAfterViewInit(): void {
    this.popover.hidden.subscribe($event => {
      //do nothing
    });
    console.log('ngAfterViewInit', this.data);
  }

  ngOnInit(): void {
    this.ngControl = this.inj.get(NgControl);
    console.log('ngOnInit', this.data);
    this.prepareTableInfo();
  }
  
  prepareTableInfo(){    
    this.colHeadersAll = [];
    //this.colProcess = [];
    this.colHeaders = []; 
    this.ProcessFields = [];
    this.tblRowsAll = [];
    this.rowItems = [];
    //console.log(this.rowData);
    if(this.data != null && this.data.availableValues != null){
      //only for dropDownTable, respective columns .value in json is the column headers to be shown.
      //but that gets assigned to col.defaultValue in the caller AddItemListComponent.loadColumnDataValues()
      this.colHeadersAll = this.data.defaultValue.toString().split("|").map(e=>e.trim());
      this.loadProcessFields();
      this.selRow = null;
      this.loadTargetFilters();
      this.rowItems = this.tblRowsAll;

      //set for currently selected
      if(this.isEditMode && this.selRow){
        this.selectRow(this.selRow,false);
        console.log('this.selRow =', this.selRow);
      }
    }    
  }

  loadProcessFields(){
    /*
    ( This comment is Just for reference, to be removed later after test passed )
    for example :
      "value": "Register ID|Unit|ID=0|Scalar=1|Working Mode=1"
      "label": "Import Wh Phase A|Wh|4|0;1;2;3|Averaging;Cumulative|Active Energy Phase  R Received"
      in this case
      "Regiter ID"  : Normal column Shown in dropdownTable , dont process ";" ( missing =0 or =1 as normal )
      "ID=0"        : Dont show in dropdownTable, dont process also ( just there for maintaining index )
      "Scaler=1"    : Dont show in dropdownTable, but process ";" for next fields' filter list.
      "Working Mode=1": same as "Scaler=1"
    */
         
    for (let i = 0; i < this.colHeadersAll.length; i++) {      
      let sa = (this.colHeadersAll[i]+"=").split("=");      
      this.colHeadersAll[i] = sa[0].trim();
      //this.colProcess.push(sa[1].trim()); // "0" or "1" or blank
      if(sa[1].trim()=="0")
        continue;

      //find and add columns ref for later-process
      this.rowData.Columns.forEach((col,c) => {
        if(col.name.toLowerCase()==this.colHeadersAll[i].toLowerCase()){          
          //mark for visible columns and set target fields (for eg 'Register ID' & 'Unit')
          if(sa[1].trim()==""){
            //only this item visible on dropDown Table
            this.colHeaders.push(sa[0]);

            //need to set-targets only if its hidden in modelWindow
            this.ProcessFields.push({
              type : "set",
              idx : i,
              colDest : col
            });
          }
          else if(sa[1].trim()=="1")
          {
            //mark for filter-targets (for eg 'Scaler' & 'Working Mode')          
            //combo seletion filtered based on the 'Register ID' row selected. So, need to keep backup of original options before filter.
            if(!col.bakupVals)
              col.bakupVals = col.availableValues;
            this.ProcessFields.push({
              type : "filter",
              idx : i,
              colDest : col
            });
          }          
        }
      });
    }
  }
  
  loadTargetFilters() {
    this.tblRowsAll = [];
    this.data.availableValues.forEach((item,i) => {
      if(!item.label) item.label = item.name; //fix: for safe
      let colNode = {
          refObj : item,
          label : item.label.toLowerCase(),
          values : [],
          setVals : [],
          idx : i
        };
      //splits the | delimited label string to show in table as columns
      //also pushes the set target filter values if it has ; delimited values
      let sa = item.label.split("|");
      this.ProcessFields.filter((fld)=>{
        if(fld.type=="set"){
          if(colNode.values.length < this.colHeaders.length && fld.idx < sa.length)
            colNode.values.push(sa[fld.idx]);
        }
        else if(fld.type=="filter"){
          colNode.setVals.push({
            idx : fld.idx,  
            name : this.colHeadersAll[fld.idx],
            list : sa[fld.idx].split(";")
          });
        }
      });

      //set currently selected item
      if(!this.selRow && this.data.value.toString()){
        if(this.data.value.toString()==item.value.toString())
          this.selRow = colNode;
      }      
      this.tblRowsAll.push(colNode);
    });
  }

  onRowSelect(row:any){
    this.selectRow(row, "grid");
    this.popover.close();
    this.strFilter = "";
    this.rowItems = this.tblRowsAll;
    this.onChange(this.valueSelected);
  }

  selectRow(row:any, caller:any){
    //console.log('rowSel:', row);
    this.selRow = row;
    if(this.selRow){
      let col = this.data;
      this.valueText = row.refObj.name;
      this.valueSelected = row.refObj.value;
      col.value = row.refObj.value;
      let item = this.getValueItem(col, col.value);
      if(item)
        col.textValue = item.name;

      //filter other fields based on this seletion (if any)
      if(row.setVals.length >0)
        this.setSelectOptions(row, col);

      //set other target fields
      if(caller && item)
        this.fillOtherSetTargets(item);
    }
  }

  //for example filter Scaler available value based on Register ID selection
  setSelectOptions(row:any, thisCol:any){
    row.setVals.forEach((el)=> {
      this.rowData.Columns.forEach((col) => {
        if(el.name.toLowerCase() == col.name.toLowerCase()){          
          let old = col.reset(true);
          if(col.bakupVals){
            col.bakupVals.forEach((itm1)=> {
              el.list.forEach((itm2) => {
                if(itm1.name.toString()==itm2.toString()){
                  col.availableValues.push(itm1);
                }
              });
            });
          }
          col.setVal(old);
        }
      });
    });  
  }

  fillOtherSetTargets(selItem){
    //this.selRow.refObj .name or .value;
    let sa = selItem.label.split("|");
    this.ProcessFields.forEach((co,i)=>{
      if(co.type=="set" && this.selRow.refObj != co.colDest){
        if(co.colDest.displayDataType == "DropDownList" || co.colDest.displayDataType == "DropDownTable"){
          let obj = this.getValueItem(co.colDest, sa[co.idx], "name");
          if(obj)
            co.colDest.value = obj.value;
        }
        else{
          co.colDest.value = sa[co.idx];
        }
      }
    });
  }

  // implements from ControlValueAccessor
  writeValue(value: any): void {
    if (value) {
      let found = this.getValueItem(this.data, value);
      this.valueText = found.name;
    } else {
      this.valueText = "";
    }
  }

  // implements from ControlValueAccessor
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // implements from ControlValueAccessor
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // implements from ControlValueAccessor
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
  
  getValueItem(dataCol: any, findVal:string, byname:string=""): any{
    let ret = "";
    if(dataCol && dataCol.availableValues) {
      let availValues = dataCol.availableValues;
      let str = findVal.toString();
      if(str != "") {
        for(let item of availValues) {
          if(byname && item.name.toString()==str) { // find by .name
            ret = item;
            break;
          }
          else if(item.value.toString()==str) {     // find by .value
            ret = item;
            break;
          }
        }
      }
    }
    return ret;
  }

  onInputChange($event: any) {
    const value = $event.target.value;
    this.onChange(this.valueSelected);
  }  

  inputBlur($event:any) {
    this.onTouched();
  } 
    
  onFilterChange(sFilter:string){
    if(sFilter == null)
      return;
    if(sFilter == "")
    {
      if(this.rowItems != this.tblRowsAll)
        this.rowItems = this.tblRowsAll;
    }
    else if(sFilter.length >= this.minkeyLen){
      sFilter = sFilter.toLowerCase();
      let newItems = [];
      for(let i=0; i<this.tblRowsAll.length; i++){
        if((this.tblRowsAll[i].label.indexOf(sFilter) > -1))
          newItems.push(this.tblRowsAll[i]);
      }
      this.rowItems = newItems;
    }
  }

}
