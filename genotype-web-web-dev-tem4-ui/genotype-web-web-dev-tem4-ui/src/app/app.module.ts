import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CoreModule} from "./core/core.module";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from "@angular/material/list";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatCardModule} from "@angular/material/card";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {JWT_OPTIONS, JwtHelperService, JwtModule} from "@auth0/angular-jwt";
import {ModelModule} from "./model";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {HttpConfigInterceptor} from "./Interceptor/httpconfig.interceptor";
import {ReactiveFormsModule} from "@angular/forms";
import {ToastrModule} from "ngx-toastr";
import {NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER} from "ngx-ui-loader";
const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: 'limeGreen',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 50,
  fgsType: SPINNER.fadingCircle,
 // pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 0, // progress bar thickness
  pbColor: 'limeGreen',
};

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      CoreModule,
      MatToolbarModule,
      ReactiveFormsModule,
      HttpClientModule,
      ModelModule,
      MatSidenavModule,
      MatListModule,
      MatButtonModule,
      MatIconModule,
      BrowserAnimationsModule,
      MatCardModule,
      MatTabsModule,
      MatTableModule,
      JwtModule,
      ToastrModule.forRoot({
        timeOut: 1500,
        positionClass: 'toast-bottom-left',
        maxOpened: 1,
        preventDuplicates: true
        }),
        NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
        NgxUiLoaderHttpModule.forRoot({ showForeground: true })
    ],
    providers: [{provide: HTTP_INTERCEPTORS, useClass: HttpConfigInterceptor, multi: true},
      { provide: JWT_OPTIONS, useValue: JWT_OPTIONS },
      JwtHelperService],

    bootstrap: [AppComponent]
})


export class AppModule{

}
