import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt'

@Injectable()
export class AuthService {

constructor(private jwtHelperService: JwtHelperService) {
    
}

  public getToken(): string {
    return localStorage.getItem('apikey');
  }
  public isAuthenticated(): boolean {
    // get the token
    const token = this.getToken();
    // return a boolean reflecting 
    // whether or not the token is expired

    const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token)

    return !tokenExpired;
  }
}