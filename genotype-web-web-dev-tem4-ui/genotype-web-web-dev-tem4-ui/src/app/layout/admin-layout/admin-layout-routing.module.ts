import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminLayoutComponent} from "./admin-layout.component";

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: 'licence',
        loadChildren: () => import('../../modules/licence/licence.module').then(e => e.LicenceModule),
        data: {type: 1}
      },
      {
        path: 'user',
        loadChildren: () => import('../../modules/users/users.module').then(e => e.UsersModule),
        data: {type: 1}
      },
      {
        path: 'profile',
        loadChildren: () => import('../../modules/MyProfile/profile/profile.module').then(e => e.ProfileModule),
        data: {type: 1}
      },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminLayoutRoutingModule { }
