import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LicenceListComponent} from "./licence-list/licence-list.component";
import {UsersComponent} from "./users/users.component";

const routes: Routes = [
  {
    path: 'list',
    component: LicenceListComponent
  },
  {
    path: 'user',
    component: UsersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LicenceRoutingModule { }
