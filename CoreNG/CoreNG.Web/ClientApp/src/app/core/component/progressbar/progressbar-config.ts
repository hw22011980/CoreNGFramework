import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class ProgressbarConfig {
    max = 100;
    animated = false;
    striped = false;
    textType: string;
    type: string;
    showValue = false;
    height: string;
}