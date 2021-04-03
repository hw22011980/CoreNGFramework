import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[stage-host]',
})
export class FormDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}

