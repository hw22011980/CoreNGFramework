import { AbstractControl } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

export function fieldMatchValidator(control: AbstractControl) {
  const { pwd, passwordConfirm } = control.value;

  if (!passwordConfirm || !pwd) {
    return null;
  }

  if (passwordConfirm === pwd) {
    return null;
  }

  return { fieldMatch: { message: 'Password tidak sama' } };
}

export function requiredValidatorMessage(err, field: FormlyFieldConfig) {
  return `"${field.templateOptions.label}" harus diisi`;
}

export const VALIDATORS_CONFIG = [
  { name: 'fieldMatch', validation: fieldMatchValidator },
];

export const VALIDATION_MESSAGES_CONFIG = [
  { name: 'required', message: requiredValidatorMessage },
];
