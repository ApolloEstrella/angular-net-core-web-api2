import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
 
import { LocalStorage } from 'angular-localstorage'; 
import { LoginService } from './login/login.service';
import { User } from './login/user';
import { error } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'app';
  constructor(private _router: Router, private _loginService: LoginService){}

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  getUserStorage(): string {
    return localStorage.getItem("email");
  }

  logOut(){
    localStorage.clear();
    this._router.navigate(['login']);
  }
}
