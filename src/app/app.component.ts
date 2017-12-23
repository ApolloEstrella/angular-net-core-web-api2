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
  //@LocalStorage() public userName:string;
  constructor(private _router: Router, private _loginService: LoginService){}

  ngOnInit(): void {
    //localStorage.clear();
    //this._router.navigate(['login'])
    //alert(this.userName); 
    //if (this.getUserStorage())
    //  this._router.navigate(['']);
    //else
    //  this._router.navigate(['main']);  
  }

  ngAfterViewInit(): void {
    //alert('after view initi')
  }

  //userName: string  = localStorage.getItem("userName");
   
  getUserStorage(): string {
    return localStorage.getItem("email");
  }

  logOut(){
    localStorage.clear();
    this._router.navigate(['login']);
  }

 
  getToken() {
    //alert('token');
    var user: User = new User();
    user.email = 'apolline_estrella7@yahoo.com';
    user.password = 'Javalinux8!@';
        
    this._loginService.getToken(user).subscribe(
      data => { localStorage.setItem("apikey", data.token)}, 
      error => alert('error'));

  }


}
