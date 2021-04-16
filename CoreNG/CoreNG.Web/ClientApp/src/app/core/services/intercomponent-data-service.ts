import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class InterComponentDataService<T>  implements IKeyedCollection<T> {
    private items: { [index: string]: T } = {};
 
    private count: number = 0;
 
    public ContainsKey(key: string): boolean {
        return this.items.hasOwnProperty(key);
    }
 
    public Count(): number {
        return this.count;
    }
 
    public AddItem(key: string, value: T) {
        if(!this.items.hasOwnProperty(key))
             this.count++;
 
        this.items[key] = value;
    }
    public SetItemValue(key: string, value: T) {

        if(this.items.hasOwnProperty(key))
        {
            this.items[key] = value;  
            return true;
        }
        else
            return false;
    }
 
    public RemoveItem(key: string): T {
        var val = this.items[key];
        delete this.items[key];
        this.count--;
        return val;
    }
 
    public GetItemValue(key: string): T {
        return this.items[key];
    }
 
    public Keys(): string[] {
        var keySet: string[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                keySet.push(prop);
            }
        }
 
        return keySet;
    }
 
    public Values(): T[] {
        var values: T[] = [];
 
        for (var prop in this.items) {
            if (this.items.hasOwnProperty(prop)) {
                values.push(this.items[prop]);
            }
        }
 
        return values;
    }
}

export interface IKeyedCollection<T> {
    AddItem(key: string, value: T);
    ContainsKey(key: string): boolean;
    Count(): number;
    GetItemValue(key: string): T;
    SetItemValue(key: string, value: T): boolean; 
    RemoveItem(key: string): T;
    Keys(): string[];
    Values(): T[];
}