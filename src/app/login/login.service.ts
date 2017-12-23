import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../login/user';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Observable';
import { BaseRequestOptions } from '@angular/http/src/base_request_options';
import { error } from 'selenium-webdriver';
import { Response } from '@angular/http/src/static_response';
import { config } from '../config'


@Injectable()
export class LoginService {

    private baseUrl: string; //'http://localhost:3485/api/login/register';

    errorMessage = '';

    constructor(private http: HttpClient) {
        this.baseUrl = config.ApiBaseUrl
    }

    public loginUser(user: User): Observable<Object> {
        var loginUrl = this.baseUrl + 'login'
        return this.http.post(loginUrl, user);
    }


    public registerUser(user: User) {
        this.createUser(user);
        //alert(this.errorMessage);
        //return this.errorMessage;
    }

    public createUser(user: User): Observable<Object> {
        //user.userId = undefined;
        //this.http.post(this.baseUrl, user)
        //    .do(data => console.log('createUser: ' + JSON.stringify(data)))
        //    .catch(this.handleError).subscribe();
        //   user.password = user.passwordGroup[0][0];



        user.password = user.passwordGroup.password.toString();
        var registerUrl = this.baseUrl + 'login/register'
        return this.http.post(registerUrl, user);
            //.map(this.extractData)
            //.do(data => console.log('createUser: ' + JSON.stringify(data)))
            //.catch(this.handleError);
        //.catch(error => Observable.throw(JSON.stringify(error)))
        /* (.subscribe(
        data => alert('Your account has been created.' + JSON.stringify(data)),
        error => {
            var err = JSON.parse(JSON.stringify(error));
            this.errorMessage = '';
            for (var key in err.error) {
                var obj = err.error[key]

                this.errorMessage += obj + '<br>';
            };
            alert(this.errorMessage);
        }
        ); */

    }

    public getUsers(): Observable<User[]> {
        var getUsersUrl = this.baseUrl + 'login/users';
        return this.http.get(getUsersUrl)
            //.map(this.extractData)
            //.do(data => console.log('getProducts: ' + JSON.stringify(data)))
            .catch(this.handleError);
    }

    public deleteUser(id: string): Observable<Object> {
        var deleteUserUrl = this.baseUrl + 'login/deleteuser?id=' + id;
        return this.http.delete(deleteUserUrl);
    }


    private extractData(response: Response) {
        let body = response.json();
        return body.data || {};
    }

    private handleError(error: Response): Observable<any> {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        //alert(error)
        return Observable.throw('Server error');
    }

    public getToken(user: User): Observable<any> {
        var tokenUrl = this.baseUrl + 'auth/token';
        return this.http.post(tokenUrl, user);
    }
}