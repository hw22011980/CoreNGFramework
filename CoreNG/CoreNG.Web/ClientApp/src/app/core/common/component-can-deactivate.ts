import { Observable } from 'rxjs';
import { RouterStateSnapshot } from '@angular/router';

export interface ComponentCanDeactivate{
    canDeactivate: (nextState?: RouterStateSnapshot) => Observable<boolean> | Promise<boolean> | boolean;
}