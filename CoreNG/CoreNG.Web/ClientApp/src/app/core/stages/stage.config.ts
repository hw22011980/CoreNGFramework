import { Type } from '@angular/core';

export class Forms {
  constructor(public id: string, public component: Type<any>, public data: any) {}
}

export class FormConfig {
  constructor(public deviceId: string, public id: string, public title: string, public url: string, public form: any) {}
}

