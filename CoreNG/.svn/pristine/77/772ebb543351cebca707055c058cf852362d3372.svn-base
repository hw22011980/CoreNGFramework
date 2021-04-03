
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';



@Injectable({
providedIn: 'root'
})
export class SharedFunctionCallService {
private subject = new Subject<any>();
sendFunctionEvent(details:any) {
  this.subject.next(details);
}
receiveFunctionEvent(): Observable<any>{ 
  return this.subject.asObservable();
}
}