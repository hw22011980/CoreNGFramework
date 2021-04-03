import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UiStateQuery, UiStateStore } from '../../state';
import { finalize, first, map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommonPageResolver implements Resolve<any> {
  constructor(
    private uiStateStore: UiStateStore,
    private uiStateQuery: UiStateQuery,
    private http: HttpClient,
    private router: Router
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    this.uiStateStore.setLoading(true);
    return this.uiStateQuery
      .select((uiState) => uiState.selectedMenu)
      .pipe(
        switchMap((activeMenu) => {
          if (!activeMenu) return this.router.navigateByUrl('/');

          if (!activeMenu || !activeMenu.resourceName)
            return this.router.navigateByUrl('/not-found');

          return this.http.get(`/api/${activeMenu.resourceName}`).pipe(
            map((res: any) => {
              this.uiStateStore.update(() => ({
                config: res.config,
                data: res.data,
              }));
              this.uiStateStore.setLoading(false);
            })
          );
        }),
        first(),
        finalize(() => this.uiStateStore.setLoading(false))
      );
  }
}
