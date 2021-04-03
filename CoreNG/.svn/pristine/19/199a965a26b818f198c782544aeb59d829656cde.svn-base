import { Injectable } from "@angular/core";
import { ComponentCanDeactivate } from './component-can-deactivate';
import { CanDeactivate, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({providedIn:'root'})
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate>{

    canDeactivate(
        component: ComponentCanDeactivate,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
        nextState?: RouterStateSnapshot
    ): Observable<boolean> | Promise<boolean> | boolean{
        let nextStateUrl : string = "";
        if(nextState)
            nextStateUrl = nextState.url;
        return component.canDeactivate ? component.canDeactivate(nextState) : of(true);
    }

}