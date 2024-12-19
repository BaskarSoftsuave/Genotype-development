import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {UserLayoutComponent} from './user-layout.component';

const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      {
        path: 'project',
        loadChildren: () => import('../../Modules/project/project.module').then(e => e.ProjectModule),
        data: {type: 1}
      },
      {
        path: '',
        loadChildren: () => import('../../Modules/layout/layout.module').then(e => e.LayoutModule),
        data: {type: 1}
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserLayoutRoutingModule { }
