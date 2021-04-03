import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class PublishDetailsService {
  
  messageEmitter = new Subject<any>();
  constructor() { }
}

export class SelectedDetails
{
  public plantNumber :  string;
  public stageId: string;
  public isLoading: boolean;
  constructor(plantNumber: string, stageId: string, isloading:boolean)
  {
    this.plantNumber = plantNumber;
    this.stageId = stageId;
    this.isLoading = isloading;


  }

}

