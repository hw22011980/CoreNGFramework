import { TableData } from './stage-table.component.model';

export class LPTableRow {
    Columns?: TableData[];

    constructor(columns: TableData[]){
        this.Columns = columns;
    }
}

export class LPTableInformation {
    Headers?: string[];
    Rows?: LPTableRow[];
    
    constructor(headers: string[], rows: LPTableRow[]) {
        this.Headers = headers;
        this.Rows = rows;
    }
}