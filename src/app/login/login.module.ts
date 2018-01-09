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
import { ResetPasswordComponent } from './reset-password.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '../shared/material.module';
import { DialogsModule } from '../shared/dialogs/dialogs.module';

@NgModule({
  imports: [
    // CommonModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forChild([
      { path: 'login', component: LoginComponent },
      { path: 'login/forgot-password', component: ForgotPasswordComponent },
      { path: 'login/register', component: RegisterComponent },
      { path: 'login/users', component: UserListComponent },
      { path: 'login/reset-password', component: ResetPasswordComponent }
    ]),
    SharedModule,
    DialogsModule
    //FormsModule,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    UserListComponent,
    ResetPasswordComponent
  ]
})
export class LoginModule { }
