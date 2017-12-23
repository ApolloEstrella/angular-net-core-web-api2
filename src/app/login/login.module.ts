import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { RegisterComponent } from './register.component';
import { UserListComponent } from './user-list.component';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
//import { ReactiveFormsModule, FormsModule } from '@angular/forms';
//import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
   // CommonModule,
    HttpClientModule,  
    RouterModule.forChild([ 
      { path: 'login', component: LoginComponent},
      { path: 'login/forgot-password', component: ForgotPasswordComponent},
      { path: 'login/register', component: RegisterComponent},
      { path: 'login/users', component: UserListComponent }
    ]),
    SharedModule
    //FormsModule,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    UserListComponent
  ]
})
export class LoginModule { }
