import { Injectable,ComponentFactoryResolver }           from '@angular/core';
import { StageBasicComponent } from './templates/stage-basic/stage-basic.component';
import { StageTableComponent } from './templates/stage-table/stage-table.component';

@Injectable()
export class StageViewCollection {
  componentFactory : any;
  constructor(public componentFactoryResolver: ComponentFactoryResolver){

  }
  getForms(id : number) {
    switch(id){
      case 0:
        this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          StageBasicComponent);
        break;
      case 1:
        this.componentFactory = this.componentFactoryResolver.resolveComponentFactory(
          StageTableComponent);
        break;
    }
    return this.componentFactory;
  }

}
