import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
//import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { LocalStorage } from 'angular-localstorage';
import { AuthService } from './auth.service'
import { JwtHelperService } from '@auth0/angular-jwt'
import { config } from '../config';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private _router: Router) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //alert(this.auth.isAuthenticated);
    //var token = localStorage.getItem('apikey');
    var token = localStorage.getItem("apikey");
    if (token !== null) {
      var jwtHelperService: JwtHelperService = new JwtHelperService(token);
      const tokenExpired: boolean = jwtHelperService.isTokenExpired(token);
      if (tokenExpired) {
        //localStorage.clear();
        this._router.navigate(['login']);
      }
      else {
        request = request.clone({
          setHeaders: {
            Authorization: 'Bearer ' + token
          }
        });
      }
    }
    else {
      //localStorage.clear();
      this._router.navigate(['login']);
    }
    //alert(token);


    return next.handle(request);
  }
}