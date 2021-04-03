import { NgModule } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ComponentModule } from 'src/app/core/component/component.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { FormDirective } from './stage.directive';
import { StageViewCollection } from './stage.factories';

import { FormComponent } from './stage.base';
import { DynamicInputsComponent } from './templates/stage-common/dynamic-inputs/dynamic-inputs.component';
import { AddItemListComponent } from './templates/stage-common/addItem-List/addItem-List.component';
import { DisplayProfileComponent } from './templates/stage-common/table-List/table-List.component';
import { StageBasicComponent } from './templates/stage-basic/stage-basic.component';
import { StageTableComponent } from './templates/stage-table/stage-table.component';


@NgModule({
  declarations: [
    FormDirective,

    FormComponent,
    DynamicInputsComponent,
    AddItemListComponent,
    DisplayProfileComponent,
    StageBasicComponent,
    StageTableComponent
  ],
  exports: [
    FormComponent,
    DynamicInputsComponent,
    AddItemListComponent,
    DisplayProfileComponent,
    StageBasicComponent,
    StageTableComponent
  ],
  providers: [
    StageViewCollection,
  ],
  entryComponents: [
    StageBasicComponent,
    StageTableComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    ComponentModule,
    FontAwesomeModule, 
    NgbModule
  ]
})
export class StageModule { }
