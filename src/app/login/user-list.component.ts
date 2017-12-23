import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { LoginService } from './login.service';
import { error } from 'selenium-webdriver';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  users: User[];
  errorMessage: string;

  constructor(private loginService: LoginService) { }

  ngOnInit() {
    this.loginService.getUsers().subscribe(users => { this.users = users; console.log(users) },
      error => this.errorMessage = <any>error);
  }

  onDeleteConfirm(userId: string, email: string, index: number) {
    //alert(userId);
    if (confirm('Delete user: ' + email + ' ?')) {
        this.loginService.deleteUser(userId).subscribe(
          data => this.users.splice(index, 1),
          error => console.log('Error deleting.')
        );        
    }   
  }
}
