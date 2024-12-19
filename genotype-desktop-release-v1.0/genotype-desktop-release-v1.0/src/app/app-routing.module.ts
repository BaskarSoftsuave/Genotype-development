import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import {AuthGuard} from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path:'',
    loadChildren:() => import ('./layout/auth-layout/auth-layout.module').then(e=>e.AuthLayoutModule),
  },
  {
    path:'user',
    loadChildren:() => import ('./layout/user-layout/user-layout.module').then(e=>e.UserLayoutModule),
    canActivate:[AuthGuard]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
