import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse, HttpErrorResponse
} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from "rxjs/operators";
import { Router } from '@angular/router';

@Injectable()
export class HttpConfigInterceptor implements HttpInterceptor {

  constructor(private router : Router ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
   // return next.handle(request);
    const token: any = localStorage.getItem('token');
    if (token) {
      console.log(token);
      request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
    }
    
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === 401){
          this.router.navigate(['login']);
          console.log('interceptor error--->>> invalid token')
        }
        return throwError(error);
      })
    );
    

    if (!request.headers.has('Content-Type')) {
      request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
    }

    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        let data = {};
        data = {
          reason: error && error.error && error.error.reason ? error.error.reason : '',
          status: error.status
        };
        //  this.errorDialogService.openDialog(data);
        return throwError(error);
      })
    );
  }
}
