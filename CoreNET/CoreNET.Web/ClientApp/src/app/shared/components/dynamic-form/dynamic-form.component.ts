import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
})
export class DynamicFormComponent implements OnInit {
  form = new FormGroup({});
  model = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[];

  constructor(private nzModalRef: NzModalRef) {}

  ngOnInit(): void {}

  handleCancel() {
    this.nzModalRef.destroy();
  }

  handleOk() {
    if (this.form.valid) {
      this.nzModalRef.afterClose.next(this.model);
    }
    this.nzModalRef.destroy();
  }
}
