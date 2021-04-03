import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Toast, ToastrService, ToastPackage} from 'ngx-toastr';

export interface IToastButton {
  id: string;
  title: string;
  buttonClass: string;
};

@Component({
  selector: 'app-confirm-toast',
  templateUrl: './confirm-toast.component.html',
  styleUrls: ['./confirm-toast.component.css'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate('{{ easeTime }}ms {{ easing }}')
      ),
      transition(
        'active => removed',
        animate('{{ easeTime }}ms {{ easing }}')
      )
    ])
  ],
  preserveWhitespaces: false
})
export class ConfirmToastComponent extends Toast implements OnInit, AfterViewInit{

  buttons: IToastButton[] = [
    {
      id: "btnConfirmYes",
      title: "Yes",
      buttonClass: "button-yes"
    },
    {
      id: "btnConfirmNo",
      title: "No",
      buttonClass: "button-no"
    }
  ];

  ngOnInit(){
    
  }

  ngAfterViewInit(){
    let toastBackdrop = document.getElementsByClassName("toast-backdrop")[0];
    if(toastBackdrop == undefined){
      this.createToastBackdropElement();
    }
    else{
      this.addStyleClassBackdrop(toastBackdrop.classList);
    }
  }

  // constructor is only necessary when not using AoT
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage) 
  {
    super(toastrService, toastPackage);
  }

  action(btn: IToastButton) {
    event.stopPropagation();
    this.toastPackage.triggerAction(btn);
    this.removeStyleClassBackdrop(document.getElementsByClassName("toast-backdrop")[0].classList);
    this.toastrService.clear();
    return false;
  }

  private createToastBackdropElement(){
    let node = document.createElement("div");
    node.setAttribute("class", "toast-backdrop modal-backdrop fade show");
    document.body.appendChild(node);
  }

  private addStyleClassBackdrop(classList: DOMTokenList){
    classList.add("modal-backdrop");
    classList.add("fade");
    classList.add("show");
  }

  private removeStyleClassBackdrop(classList: DOMTokenList){
    classList.remove("modal-backdrop");
    classList.remove("fade");
    classList.remove("show");
  }
}
