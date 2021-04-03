import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { BasicLayoutComponent } from '../basic-crud-layout/basic-layout.component';
import { DetailPageComponent } from '../detail-page/detail-page.component';

@Injectable()
export class CoreComponentFactory {
  _component: any;

  get component() {
    return this._component;
  }

  set component(id) {
    switch (id) {
      case 1:
        this._component = this.componentFactoryResolver.resolveComponentFactory(
          BasicLayoutComponent
        );
        break;
      case 2:
        this._component = this.componentFactoryResolver.resolveComponentFactory(
          DetailPageComponent
        );
    }
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver) {}
}
