import {
  Component, Input, OnInit, ViewChild, ComponentFactoryResolver,
  OnDestroy, OnChanges, ChangeDetectorRef, Inject
} from '@angular/core';
import { FormDirective } from './stage.directive';
import { FormConfig } from './stage.config';
import { StageView } from './stage.interface';
import { LoaderStageService } from '../services/loader-stage-service.components';

@Component({
  selector: 'app-form-entry',

  templateUrl: './stage.base.html',
  styleUrls: ['./stage.base.css']
})
export class FormComponent implements OnInit, OnDestroy, OnChanges {
  visible: boolean;
  @Input() frmConfig: FormConfig;
  @ViewChild(FormDirective) adHost: FormDirective;
  isChanged: boolean;
  isEditing = false;
  componentRef: any;
  baseURL: string;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
    @Inject('BASE_URL') baseUrl: string,
    public loader: LoaderStageService,
    private changeDetector: ChangeDetectorRef) {
    this.baseURL = baseUrl;
  }

  // tslint:disable-next-line: use-life-cycle-interface
  ngAfterViewChecked() { this.changeDetector.detectChanges(); }

  ngOnInit() {
    this.visible = false;
  }

  ngOnChanges(changes) {
    if (!!changes) {
      // tslint:disable-next-line: forin
      for (const propName in changes) {
        const change = changes[propName];
        this.frmConfig = change.currentValue;
        if (!!change.currentValue) {
          this.isChanged = (JSON.stringify(change.currentValue.id) != null);
        }
      }
      if (this.isChanged) {
        this.loadsStageView();
      }
    }
  }

  ngOnDestroy() {
  }

  loadsStageView() {

    const o = this.frmConfig;
    this.visible = o.form !== '';

    const viewContainerRef = this.adHost.viewContainerRef;
    viewContainerRef.clear();

    if (this.visible) {

      const componentFactory = o.form;
      const componentRef = viewContainerRef.createComponent(componentFactory);
      this.componentRef = componentRef;

      if (this.isChanged) {
        (<StageView>componentRef.instance).data = {
          'id': o.id,
        };
        o.url = this.baseURL + 'demo/' + o.id;
        (<StageView>componentRef.instance).frmConfig = o;
        (<StageView>componentRef.instance).editEvent.subscribe(val => { this.isEditing = val; });
      }
    } else {
      this.isEditing = false;
    }
  }

  hasEditedDataDifference(): boolean {
    if (this.componentRef && this.componentRef.instance) {
      return (<StageView>this.componentRef.instance).editedDataHasDifferences();
    }
    return false;
  }
}
