import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonPageComponent } from './common-page.component';
import { CommonPageResolver } from './common-page.resolver';

const routes: Routes = [
  {
    path: ':id',
    component: CommonPageComponent,
    resolve: [CommonPageResolver],
    children: [
      {
        path: ':id',
        component: CommonPageComponent,
      },
    ],
    data: {
      headerDisplay: 'none',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommonPageRoutingModule {}
