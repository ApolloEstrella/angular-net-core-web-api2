import { BrowserModule } from '@angular/platform-browser';
//import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
//import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
//import { LoginComponent } from './login/login.component';
//import { ForgotPasswordComponent } from './login/forgot-password.component';
//import { RegisterComponent } from './login/register.component';
import { HttpClientModule } from '@angular/common/http'; 
import { LoginService } from '../app/login/login.service';
//import { UserListComponent } from './login/user-list.component';
import { LoginModule } from './login/login.module';
import { HomeComponent } from './login/home.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './login/token.interceptor';
import { MessageService } from './shared/data.service';
import { DialogsService } from './shared/dialogs/dialogs.service';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      //{ path: 'main', component: AppComponent},
      { path: 'welcome', component: HomeComponent},
      { path: '', redirectTo: 'welcome', pathMatch: 'full'},
      { path: '**', redirectTo: 'welcome', pathMatch: 'full'}
    ]),
    LoginModule
  ],
  providers: [
    LoginService,
    [{provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true}],
    MessageService,
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
