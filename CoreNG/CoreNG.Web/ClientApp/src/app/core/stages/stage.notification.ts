import { OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { IToastButton, ConfirmToastComponent } from 'src/app/core/component/custom-toast/confirm-toast/confirm-toast.component';

export class StageNotification implements OnDestroy{

    private successTitle: string = "Success Information";
    private infoTitle: string = "Information";
    private warningTitle: string = "Warning";
    private errorTitle: string = "Error";
    private confirmTitle: string = "Confirm";
    private confirmIcon: string = "toast-success";

    toastButtons: IToastButton[] = [
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

    constructor(protected toastrService: ToastrService) { }

    ngOnDestroy(){

    }

    showSuccessToast(message: string, title?: string){
        this.toastrService.clear();// clean up all toasts
        if(!title) title = this.successTitle;
        const successToast = this.toastrService.success(message, title, {
            easeTime: 300,
            timeOut: 10000,
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-bottom-left'
        });

        return successToast;
    }

    showInfoToast(message: string, title?: string){
        this.toastrService.clear();
        if(!title) title = this.infoTitle;
        const infoToast = this.toastrService.info(message, title, {
            easeTime: 300,
            timeOut: 10000,
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-bottom-left'
        });
        
        return infoToast;
    }

    showWarningToast(message: string, title?: string){
        this.toastrService.clear();
        if(!title) title = this.warningTitle;
        const warningToast = this.toastrService.warning(message, title, {
            easeTime: 300,
            timeOut: 10000,
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-bottom-left'
        });

        return warningToast;
    }

    showErrorToast(message: string, title?: string){
        this.toastrService.clear();
        if(!title) title= this.errorTitle;
        const errorToast = this.toastrService.error(message, title, {
            easeTime: 300,
            timeOut: 10000,
            closeButton: true,
            tapToDismiss: false,
            positionClass: 'toast-bottom-left'
        });

        return errorToast;
    }

    showConfirmToast(message: string, title?: string){
        this.toastrService.clear();
        if(!title) title= this.confirmTitle;

        const confirmToast = this.toastrService.show(message, title, {
            toastComponent: ConfirmToastComponent,
            closeButton: true,
            disableTimeOut: true,
            tapToDismiss: false,
            positionClass: 'toast-center-center'
        },this.confirmIcon);

        return confirmToast;
    }
}
