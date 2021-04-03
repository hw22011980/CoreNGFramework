import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot, NavigationEnd } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { NavTreeComponent } from 'src/app/core/component/nav-tree/nav-tree.component';
import { HttpClient } from '@angular/common/http';
import { StageViewCollection } from 'src/app/core/stages/stage.factories';
import { FormConfig } from 'src/app/core/stages/stage.config';
import { FormComponent } from 'src/app/core/stages/stage.base';
import { PublishDetailsService } from 'src/app/core/services/publish-details.service';
import { InterComponentDataService } from 'src/app/core/services/intercomponent-data-service';
import { Subscription, Observable, of } from 'rxjs';
import { SharedFunctionCallService } from 'src/app/core/services/shared-function-call.service';
import { StageNotification } from 'src/app/core/stages/stage.notification';
import { ComponentCanDeactivate } from 'src/app/core/common/component-can-deactivate';

@Component({
  selector: 'app-nav-menu-left',
  templateUrl: './nav-menu-left.component.html',
  styleUrls: ['./nav-menu-left.component.css']
})
export class NavMenuLeftComponent extends StageNotification implements OnInit, AfterViewInit, ComponentCanDeactivate {

  @ViewChild(FormComponent) child: FormComponent;
  @ViewChild('navtree') navTreeComponent: NavTreeComponent;

  frmConfig: FormConfig;
  title; string;
  menus: any;
  plantNumber: string;
  disableClick = true;
  deviceId: string;
  deviceType: number;
  connectEventSubscription: Subscription;
  private selectedStage: SelectedStage = null;

  constructor(public http: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
    public stageViewCollection: StageViewCollection,
    public activatedRoute: ActivatedRoute,
    private emitDetails: PublishDetailsService,
    private router: Router,
    private interComponentData: InterComponentDataService<any>,
    private reloadPage: SharedFunctionCallService,
    public toastrService: ToastrService) {
    super(toastrService);
    http.get(baseUrl + 'menu').subscribe(result => {
      this.menus = result;
    }, error => console.error(error));
  }

  ngOnInit() {
    var deviceId = '11';
    this.deviceId = deviceId;
    this.onGetDevices(deviceId);
    this.emitDetails.messageEmitter.subscribe(data => { this.disableClick = data });
    this.emitDetails.messageEmitter.subscribe(data => {
      if (typeof data === 'object') {
        let currentStage: SelectedStage = data;
        if (this.interComponentData.GetItemValue("refreshPage")) {
          this.refreshMenu(currentStage);
        }
      }
    });
  }

  onGetDevices(deviceId: string) {
    let params = new HttpParams();
    params = params.append('deviceId', String(deviceId));//1


    //this.deviceService.getDevices(true, params).subscribe((data) => 
    //  {
    //    var device = data.devices[0];
    //    localStorage.setItem("plantNumber", device.plantNumber);
    //    localStorage.setItem("deviceTypeName", device.deviceType.deviceTypeName);
    //    this.frmConfig ={"id":"0","plantNumber":device.plantNumber,"title":"","url":"","form":""};

    //    this.plantNumber = device.plantNumber;
    //    this.deviceType = device.deviceType.deviceTypeId;

    //    if(this.deviceType!=null){
    //      this.setupService.GetMenus(this.deviceType).subscribe(
    //        data => {
    //          this.menus = data;
    //        }
    //      );
    //    }
    //  }
    //);
  }

  clickMenu(menu: any) {
    this.showStageView(menu);
    //let hasEditedDataDifference: boolean = false;
    //if (this.frmConfig && this.child.isEditing) {
    //  hasEditedDataDifference = this.child.hasEditedDataDifference();
    //}
    //if (this.frmConfig && this.child.isEditing && hasEditedDataDifference) {
    //  this.showConfirmToast("You are editing a stage. If you leave, your changes will be lost. Leave?").onAction.subscribe(x => {
    //    if (x.title === "Yes") {
    //      this.showStageView(menu);
    //    }
    //    else {
    //      this.reloadMenu();
    //      return;
    //    }
    //  });
    //}
    //else {
    //  this.showStageView(menu);
    //}
  }

  showStageView(menu: Menu) {
    //console.log(menu);
    if (menu.uiTemplate == -1) {
      this.processRootStage(menu);
    } else {
      this.processfrmConfig(menu);
    }
  }

  private setfrmConfig(menu: Menu, isStageView: boolean) {
    let frmCofigJson: FormConfig;
    if (menu != null) {
      frmCofigJson = {
        'id': menu.id,
        'deviceId': '1',
        'title': menu.name,
        'url': menu.url,
        'form': isStageView ? this.stageViewCollection.getForms(menu.uiTemplate) : ''
      };
    } else {
      frmCofigJson = { 'id': '0', 'deviceId': '1', 'title': '', 'url': '', 'form': '' };
    }
    this.frmConfig = frmCofigJson;
  }

  private processfrmConfig(menu: Menu) {
    this.setfrmConfig(menu, true);

    this.menus.forEach((stage) => {

      stage.children.forEach((setup) => {
        if (setup.name == menu.name) {
          this.selectedStage = { StageName: stage.name, SetupName: menu.name, StageId: stage.id, SetupId: menu.id };
          if (!this.interComponentData.ContainsKey("refreshPage"))
            this.interComponentData.AddItem("refreshPage", false);
          else
            this.interComponentData.SetItemValue("refreshPage", false);
          this.emitDetails.messageEmitter.next(this.selectedStage);
          //var route = `/devices/${this.deviceId}/setup/${stage.name}/${menu.name.replace('/', '')}`;
          //this.router.navigate([route]);
          return;
        }
      });
    });
  }

  private getResolvedUrl(route: ActivatedRouteSnapshot): string {
    return route.pathFromRoot
      .map(v => v.url.map(segment => segment.toString()).join('/'))
      .join('/');
  }

  private processRootStage(stageName: any) {
    this.setfrmConfig(stageName, false);
    //this.selectedStage = { StageName: stageName.name, SetupName: '', StageId: stageName.id, SetupId: '' };
    //if (!this.interComponentData.ContainsKey("refreshPage"))
    //  this.interComponentData.AddItem("refreshPage", false);
    //else
    //  this.interComponentData.SetItemValue("refreshPage", false);
    //this.emitDetails.messageEmitter.next(this.selectedStage);
    //var route = `/devices/${this.deviceId}/setup/${stageName.name}`;
    //this.router.navigate([route]);
  }

  public refreshMenu(stage: any) {
    if (stage.SetupId == '' && stage.StageId == '') {
      this.navTreeComponent.changeDataByNodeId(stage.SetupId, stage.StageId);
    } else if (stage.SetupId == '' && stage.StageId != '') {
      this.navTreeComponent.changeDataByNodeId(stage.StageId, '');
    }

    let currentMenu: Menu = this.navTreeComponent.node;
    if (currentMenu) {
      this.setfrmConfig(currentMenu, currentMenu.uiTemplate != -1);
    } else {
      this.frmConfig = {
        "deviceId": "1",
        "id": "0",
        "title": "",
        "url": "",
        "form": ""
      };
    }
  }

  private reloadMenu() {
    if (this.selectedStage.SetupId == '') {
      this.navTreeComponent.changeDataByNodeId(this.selectedStage.StageId, '');
    } else {
      this.navTreeComponent.changeDataByNodeId(this.selectedStage.SetupId, this.selectedStage.StageId);
    }
  }

  ngAfterViewInit(): void {

  }

  canDeactivate(nextState?: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let hasEditedDataDifference: boolean = false;
    if (this.frmConfig && this.child.isEditing) {
      hasEditedDataDifference = this.child.hasEditedDataDifference();
    }
    if (this.frmConfig && this.child.isEditing && hasEditedDataDifference) {
      this.showConfirmToast("You are editing a stage. If you leave, your changes will be lost. Leave?").onAction.subscribe(x => {
        if (x.title === "Yes") {
          const queryParams = nextState.root.queryParams;
          this.router.navigate([nextState.url.split('?')[0]],
            {
              queryParams
            });
          this.child.isEditing = false;
        }
        else
          return;
      });
    }
    else {
      return true;
    }
  }
}

export class Menu {
  id: string;
  name: string;
  url: string;
  uiTemplate: number;
  enable: boolean;
  visible: boolean;
  children: Menu[];
}

export class SelectedStage {
  StageName: string;
  SetupName: string;
  StageId: string;
  SetupId: string;
}

