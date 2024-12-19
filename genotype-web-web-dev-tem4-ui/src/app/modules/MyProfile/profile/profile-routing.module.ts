import { NgModule } from '@angular/core';
import { ProfileComponent } from './myprofile/profile.component';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'user-profile',
    component: ProfileComponent
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
