import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Router } from '@angular/router';
import { SpinnerService } from 'src/app/core/component/spinner/spinner.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  myToken: string;
  msg: string;
  errorCode: number;
  errors: any;
  serverAddress: string;
  errorDescription: string;
  environmentVersion: string;
  mddcsVersion: string;
  errorMessage: string;
  constructor(private router: Router,
    public spinnerService: SpinnerService) { }

  ngOnInit() {
    let isAuthenticated = false;
    if (isAuthenticated) {
       window.location.href = './';
    }
    this.initialize();
  }

  async initialize() {

    this.errorMessage = localStorage.getItem('error');
  }

  onUserLogin(form: NgForm) {
    const username = form.value.username;
    const password = form.value.password;

    //this.authService.login(username, password)
    //  .subscribe((accessToken) => {

    //    if (!accessToken) {
    //      this.myToken = accessToken.access_token;
    //    }
    //    localStorage.setItem('showHeader', 'true');
    //    window.location.href = '#/devices';

    //  },
    //    (error) => {
    //      this.errorMessage = localStorage.getItem('error');

    //      console.log(error);
    //      this.errorCode = error.status;
    //      if (error.status === 500){
    //        localStorage.setItem('error', error.message);
    //      } else {
    //        if (this.errorMessage != null) {
    //          this.errorMessage = String(this.errorMessage).replace(': 0 Unknown Error', '');
    //          this.errorMessage = String(this.errorMessage).replace('Http', 'HTTP');
    //          this.errorMessage = String(this.errorMessage).replace('unknown url', this.authService.getTokenUrl());
    //        }
    //        this.errors = error;
    //        const substrings = ['database', 'grant', 'user'];
    //        let i = 0;
    //        this.errorCode = (error.status === 403) ? 403 : 500;
    //        while ((this.errorCode !== 501) && (i < substrings.length)) {
    //          if(error.error.error_description!==undefined)
    //          {
    //            this.errorMessage = error.error.error_description; 
    //            if (error.error.error.includes(substrings[i]))    
    //              this.errorCode = 501;   // override unknown error code that has custom message         
    //          }
    //          else
    //            this.errorMessage  = this.errors.message;

    //          i++;
    //        }
    //      }
    //    });
  }

  isLoggedIn() {
    //return this.authService.isAuthenticated;
  }

  getToken() {
    //return this.authService.getToken();
  }
}
