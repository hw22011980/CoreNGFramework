import { Routes, RouterModule } from '@angular/router';
import { NotFoundComponent } from '../../authentication/not-found/not-found.component';

export const FULL_LAYOUT_ROUTES: Routes = [
  {
    path: 'authentication',
    loadChildren: () =>
      import('../../authentication/authentication.module').then(
        (m) => m.AuthenticationModule
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];
