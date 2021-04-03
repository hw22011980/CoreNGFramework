import { StageDataType, StageResultDataType, Utils } from '../common-data-types';

export class DPTableRow {
    Columns?: StageDataType[];

    constructor(columns: StageDataType[]) {
        this.Columns = columns;
    }
}

export class DPTableInformation {
    Headers?: string[];
    Visibles?: boolean[];
    Rows?: DPTableRow[];
    Checks?: DPValidation[];
    
    constructor(headers: string[], visibles:boolean[], rows: DPTableRow[]) {
        this.Headers = headers;
        this.Visibles = visibles;
        this.Rows = rows;
        this.Checks = [];
    }
    
    //table level Rules for uniq record check etc.,
    prepTableRules(strValids:string) {
        let svalAll = strValids.trim();
        if(svalAll.toLowerCase().indexOf("rule") >=0 && svalAll.indexOf("=") > 0) {
            let allVals = (svalAll.split('=')[1]).replace(',',';').split(";");
            allVals.forEach((sval)=> {
                let params = Utils.splitMulti(sval,['=','[',']','+']);
                if(params.length > 1) {
                let valid = new DPValidation(params[0].trim(), params.splice(1));
                valid.addIndexs(this);
                this.Checks.push(valid);
                }
            });
        }
    }


    validate(curRow:DPTableRow):DPValidation[] {
        let fails:DPValidation[]=[];
        for(let chk of this.Checks) {
            if(!chk.validate(this, curRow))
                fails.push(chk);
        }
        return fails;
    }

    getColIndex(name:string):number {
        name = name.toLowerCase();
        for(let i=0; i< this.Headers.length; i++) {
            if(this.Headers[i].toLowerCase() == name)
                return i;
        }
        return -1;
    }
}

export class DPValidation {
    Type?: string;
    Keys?: string[];
    Idxs?: number[];
    Name : string;
    Error: string;
    ErrorTitle: string;
    constructor(Type: string, keys:string[]) {
        this.Type = Type;
        this.Name = "";
        this.Error = ""; 
        this.ErrorTitle = "";
        this.Keys = [];
        this.Idxs = [];
        keys.forEach((key)=>{
            this.addKey(key);
        });
    }

    addKey(key:string) {
        if(key.trim()) {
            this.Keys.push(key.trim());
        }
    }

    addIndexs(tbl:DPTableInformation) {
        this.Keys.forEach((key,k)=> {
            let idx = tbl.getColIndex(key);
            this.Idxs.push(idx);
            if(idx >= 0) {
                this.Name += ((k==0)? "'" + key: "+'" + key) + "'";
            }
        });        
    }

    validate(tbl:DPTableInformation, curRow:DPTableRow):boolean {
        this.Error ="";
        let strCur = this.getValueStr(curRow);
        for(let row of tbl.Rows) {
            if(row != curRow) {
                if(strCur == this.getValueStr(row)) {
                    if(this.Type.toLowerCase().startsWith("uniq")) {
                        //get array of variables
                        var nval = this.Name.toString().split("+");
                        this.ErrorTitle = "Error : Duplicate Record";
                        for(var i = 0; i < nval.length; i++){
                            let tmpName = nval[i].replace(/'/g, "");
                            let idx = curRow.Columns.findIndex(c => c.name === tmpName);
                            this.Error += curRow.Columns[idx].name + " : " + curRow.Columns[idx].textValue + "\n";
                        }
                    }
                    else
                        this.Error = "Validation '"+this.Type+"' failed on "+this.Name;
                    return false;
                }
            }
        }
        return true;
    }

    getValueStr(row:DPTableRow):string {
        let sres = "";
        this.Idxs.forEach(idx => {
            if(idx >=0 && idx < row.Columns.length) {
                let col:StageDataType = row.Columns[idx];
                sres += (""+col.textValue).toLowerCase()+"~";
            }
            //else{ handle wrong or missing column here }
        });
        return sres;
    }
}