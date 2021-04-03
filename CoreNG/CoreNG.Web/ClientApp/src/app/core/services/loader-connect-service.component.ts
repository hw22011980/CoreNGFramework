import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class LoaderConnectService {
  private enableLoader = false;
  private disable = false;

  constructor() {}
  getLoaderStatus()
  {
    return this.enableLoader;
  }

  disableFeature()
  {
    this.enableLoader = false;
    this.disable = true;
  }
  enableFeature()
  {
    this.disable = false;
  }

  show() {
    if(!this.disable){
      this.enableLoader = true;
    }
  }

  hide() {
    if(!this.disable){
      this.enableLoader = false;
    }
  }
}