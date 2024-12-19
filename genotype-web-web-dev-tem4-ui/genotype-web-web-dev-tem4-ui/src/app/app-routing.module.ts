import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthLayoutComponent} from "./layout/auth-layout/auth-layout.component";
import {AuthGuard} from "./core/guards/auth.guard";

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: '',
    loadChildren: () => import ('./layout/auth-layout/auth-layout.module').then(e => e.AuthLayoutModule),
  },
  {
    path: 'admin',
    loadChildren: () => import ('./layout/admin-layout/admin-layout.module').then(e => e.AdminLayoutModule),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: () => import ('./layout/auth-layout/auth-layout.module').then(e => e.AuthLayoutModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
