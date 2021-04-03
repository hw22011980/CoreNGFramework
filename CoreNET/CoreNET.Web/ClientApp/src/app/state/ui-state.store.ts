import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface UiStateState {
  key: string;
  menuItems: any[];
  selectedMenu: any;
  config: any;
  data: any[];
}

export function createInitialState(): UiStateState {
  return {
    key: '',
    menuItems: null,
    selectedMenu: null,
    config: null,
    data: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'uiState' })
export class UiStateStore extends Store<UiStateState> {
  constructor() {
    super(createInitialState());
  }
}
