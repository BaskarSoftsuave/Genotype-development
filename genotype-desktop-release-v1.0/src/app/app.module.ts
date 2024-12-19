import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';

import { AppRoutingModule } from './app-routing.module';

// NG Translate
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { HomeModule } from './core/home/home.module';

import { AppComponent } from './app.component';
import {MatTableModule} from '@angular/material/table';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastNotificationsModule} from 'ngx-toast-notifications';
import {HttpConfigInterceptor} from './Interceptors/http-config.interceptor';
import {JWT_OPTIONS, JwtHelperService, JwtModule} from '@auth0/angular-jwt';
import {ToastrModule} from 'ngx-toastr';
import {ChartsModule} from 'ng2-charts';
import { NgxUiLoaderConfig, NgxUiLoaderHttpModule, NgxUiLoaderModule, PB_DIRECTION, POSITION, SPINNER } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: 'limeGreen',
  fgsPosition: POSITION.centerCenter,
  fgsSize: 50,
  fgsType: SPINNER.fadingCircle,
  //pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 0, // progress bar thickness
  pbColor: 'limeGreen'
};

// AoT requires an exported function for factories
const httpLoaderFactory = (http: HttpClient): TranslateHttpLoader =>  new TranslateHttpLoader(http, './assets/i18n/', '.json');

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CoreModule,
    SharedModule,
    HomeModule,
    AppRoutingModule,
    MatTableModule,
    ToastNotificationsModule,
    JwtModule,
    ChartsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    ToastrModule.forRoot({
      timeOut: 1500,
      positionClass: 'toast-bottom-left',
      maxOpened: 1,
      preventDuplicates: true
    }),
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NgxUiLoaderHttpModule.forRoot({ showForeground: true })
  ],
  providers: [{provide: HTTP_INTERCEPTORS,useClass:HttpConfigInterceptor,multi: true},
    {provide: JWT_OPTIONS,useValue:JWT_OPTIONS},
  JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule {}
