import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { UiStateStore } from './ui-state.store';

@Injectable({ providedIn: 'root' })
export class UiStateService {
  constructor(private uiStateStore: UiStateStore, private http: HttpClient) {}

  get() {
    return this.http
      .get<any[]>('api/menu')
      .subscribe((res) =>
        this.uiStateStore.update((state) => ({ menuItems: res }))
      );
  }
}
