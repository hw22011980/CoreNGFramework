import { Injectable } from '@angular/core';

export class Envelop {
  public readonly to: any;
  public readonly from: string;
  public readonly description: string;
  private data: any;
  constructor(to : any = '', from = '', description = '', data = null) {
    this.to = to;
    this.from = from;
    this.description = description;
    this.data = data;
  }
  get() {
    return this.data;
  }
  set(data: any) {
    this.data = data;
  }  
}

export interface ICrossComponentMsg {

  envelop: Envelop;
  onSubscribedData(data: any);
  setEnvelop(data: any);


}

export class EventMessage {
  EventName: string;
  Value: any;
  constructor(eventname = '', value = null) {
    this.EventName = eventname;
    this.Value = value;

  }
}

export class SelectedStage {
  StageName: string;
  SetupName: string;
  StageId: string;
  SetupId: string;

  constructor(stagename = '', setupname = '', stageid = '', setupId = '') {

    this.StageName = stagename;
    this.SetupName = setupname;
    this.StageId = stageid;
    this.SetupId = setupId;
  }
}


export class NavTreeNodeStatus {
  ChkMilestone: string = '';
  NodeId: string = '';
  NodeCheckStatus: string = '';
  AllNodesClosed: boolean = false;
  CheckedStageIDArray :  any = [];
}


export class NavIdentification {
  Name: string;
  Url: string;
}


