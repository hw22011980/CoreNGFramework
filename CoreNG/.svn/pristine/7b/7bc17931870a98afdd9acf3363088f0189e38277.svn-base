import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {

  // private _loading = false;
  private _loading = new Map();

  // get loading(): boolean {
  //   return this._loading;
  // }

  // onRequestStarted(): void {
  //   this._loading = true;
  // }

  // onRequestFinished(): void {
  //   this._loading = false;
  // }

  getloading(reqIdentifier): boolean {
    return this._loading.get(reqIdentifier);
  }

  onRequestFinished(reqIdentifier: string): void {
    this._loading.delete(reqIdentifier);
    this._loading.set(reqIdentifier, false);
  }

  onRequestStarted(reqIdentifier: string): void {
    this._loading.set(reqIdentifier, true);
  }
}
