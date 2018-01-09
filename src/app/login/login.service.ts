import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions } from '@angular/http/src/base_request_options';
import { error } from 'selenium-webdriver';
import { Response } from '@angular/http/src/static_response';
import { config } from '../config';
import { ActivatedRoute } from '@angular/router';

@Injectable()
export class LoginService {

    private baseUrl: string;  

    errorMessage = '';

    constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
        this.baseUrl = config.ApiBaseUrl
    }

    public loginUser(user: User): Observable<Object> {
        var userid;
        var token;
        var loginUrl;

        this.activatedRoute.queryParams.subscribe(params => {
            userid = params['userid'];
            token = params['token'];
        });

        if (userid !== undefined) {
            loginUrl = this.baseUrl + 'login' + '?userid=' + userid + '&token=' + token;
            loginUrl = loginUrl.replace(/[+]/g, '%2B');
        }
        else
            loginUrl = this.baseUrl + 'login';

        return this.http.post(loginUrl, user);
    }


    public registerUser(user: User) {
        this.createUser(user);
    }

    public createUser(user: User): Observable<Object> {

        user.password = user.passwordGroup.password.toString();
        var registerUrl = this.baseUrl + 'login/register'
        return this.http.post(registerUrl, user);
    }

    public getUsers(): Observable<User[]> {
        var getUsersUrl = this.baseUrl + 'login/users';
        return this.http.get(getUsersUrl)
            .catch(this.handleError);
    }

    public deleteUser(id: string): Observable<Object> {
        var deleteUserUrl = this.baseUrl + 'login/deleteuser?id=' + id;
        return this.http.delete(deleteUserUrl);
    }

    public submitForgotPasswordEmail(user: User) {
        var emailUrl = this.baseUrl + 'login/ForgotPassword'
        return this.http.post(emailUrl, user);
    }

    public ResetPassword(user: User): Observable<Object> {
        var userid;
        var token;
        var resetPasswordUrl;

        this.activatedRoute.queryParams.subscribe(params => {
            userid = params['userid'];
            token = params['token'];
        });

        let userResetPassword: User = new User();
        userResetPassword.id = userid;
        userResetPassword.token = token;
        userResetPassword.password = user.passwordGroup.password.toString();

        resetPasswordUrl = this.baseUrl + 'login/ResetPassword';
        return this.http.post(resetPasswordUrl, userResetPassword);
    }

    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        console.error(error);
        return Observable.throw('Server error');
    }

    public getToken(user: User): Observable<any> {
        var tokenUrl = this.baseUrl + 'auth/token';
        return this.http.post(tokenUrl, user);
    }
}