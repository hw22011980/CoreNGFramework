import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentModule } from './core/component/component.module';
import { StageModule } from './core/stages/stage.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { NavMenuTopComponent } from './core/nav-menu-top/nav-menu-top.component';
import { NavMenuLeftComponent } from './core/nav-menu-left/nav-menu-left.component';
//import { LoginComponent } from './core/login/login.component';

//demo from vs2019
import { HomeComponent } from './demo/home/home.component';
import { CounterComponent } from './demo/counter/counter.component';
import { FetchDataComponent } from './demo/fetch-data/fetch-data.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavMenuTopComponent,
    NavMenuLeftComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
  ],
  imports: [
    ComponentModule,
    StageModule,
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
      //{ path: '', component: HomeComponent, pathMatch: 'full' },
      { path: '', component: NavMenuLeftComponent, pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'login', component: LoginComponent }
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
