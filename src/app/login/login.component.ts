import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { GenericValidator } from '../shared/generic-validator';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Router } from '@angular/router';
import { LocalStorage, SessionStorage } from "angular-localstorage";
import { User } from '../login/user'

import { LoginService } from '../login/login.service';
import { error } from 'selenium-webdriver';
import { ActivatedRoute } from '@angular/router';

import { MessageService } from '../shared/data.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {

    //@LocalStorage() public userName:string = 'User101';


    @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

    loginForm: FormGroup;

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

    //userName: string = "agent01"

    user: User;
    errorMessage: string;
    msgHeader: string;

    constructor(private fb: FormBuilder, private _router: Router, private loginService: LoginService, private msgService: MessageService) {

        // Defines all of the validation messages for the form.
        // These could instead be retrieved from a file or database.
        this.validationMessages = {
            email: {
                required: 'Email is required.',
                pattern: 'Email format is not correct'
            },
            passWord: {
                required: 'Password is required.'
            }
        };

        // Define an instance of the validator for use with this form, 
        // passing in this form's set of validation messages.
        this.genericValidator = new GenericValidator(this.validationMessages);
        //localStorage.clear();
    }

    ngOnInit(): void {
        //localStorage.clear()
        this.loginForm = this.fb.group({
            email: ['', [Validators.required,
            Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
            passWord: ['', Validators.required]
        });

        //alert(this.msgService.msgHeader);
        this.msgHeader = this.msgService.msgHeader;
    }

    ngAfterViewInit(): void {
        // Watch for the blur event from any input element on the form.
        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        // Merge the blur event observable with the valueChanges observable
        Observable.merge(this.loginForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
            this.displayMessage = this.genericValidator.processMessages(this.loginForm);
        });
        localStorage.clear();
    }

    loginUser(): void {
        //alert('login now');
        //window.localStorage.set("userName","b101");


        let u = Object.assign({}, this.user, this.loginForm.value);
        
        this.loginService.loginUser(u).subscribe(
            data => {localStorage.setItem("email", this.loginForm.get('email').value); this.getToken(u); this._router.navigate(['']) },
            error => {
                var err = JSON.parse(JSON.stringify(error));
                this.errorMessage = '';
                for (var key in err.error) {
                    var obj = err.error[key]
                    this.errorMessage += '- ' + obj + '<br/>';
                };
                if (this.errorMessage != '') {
                    this.errorMessage += '<br/>';
                }
                //alert(this.errorMessage);
            }
        );
        //this._router.navigate([''])
    }


    getToken(user: User) {
        //alert('token');
        //var user: User = new User();
        //user.email = 'apolline_estrella7@yahoo.com';
        //user.password = 'Javalinux8!@';
            
        this.loginService.getToken(user).subscribe(
          data => { localStorage.clear(); localStorage.setItem("email", user.email);  localStorage.setItem("apikey", data.token)}, 
          error => alert('error'));
    
      }

}
