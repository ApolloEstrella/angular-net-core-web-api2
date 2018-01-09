import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, AbstractControl } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { GenericValidator } from '../shared/generic-validator';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { User } from '../login/user';
import { MessageService } from '../shared/data.service'
import { Route } from '@angular/router/src/config';

function passwordMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  let passwordControl = c.get('password')
  let confirmPasswordControl = c.get('confirmPassword');

  if (passwordControl.pristine || confirmPasswordControl.pristine) {
    return null;
  }
  if (passwordControl.value === confirmPasswordControl.value) {
    return null;
  }

  return { 'match': true };
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  registerForm: FormGroup;
  user: User;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  public products = [];

  passwordMessage: string;

  errorMessage = '';
  messageHeader = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private loginService: LoginService, private msgService: MessageService, private router: Router) {

    this.validationMessages = {
      email: {
        required: 'Email is required.',
        pattern: 'Email format is not correct'
      },
      password: {
        required: 'Password is required.',
        pattern: 'Password should have minimum six characters, at least one uppercase letter, one lowercase letter, one number and one special character.'
      },
      confirmPassword: {
        required: 'Confirm password is required.'
      }
    };

    // Define an instance of the validator for use with this form, 
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);

  }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]],
        confirmPassword: ['', Validators.required]
      }, { validator: passwordMatcher })
    });

    const passwordControl = this.registerForm.get('passwordGroup.password');
    passwordControl.valueChanges.debounceTime(2000).subscribe(value =>
      this.setMessage(passwordControl));
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.registerForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.registerForm);
    });
  }

  setMessage(c: AbstractControl): void {
    this.passwordMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.passwordMessage = Object.keys(c.errors).map(key =>
        this.validationMessages[key]).join(' ');
    }
  }



  registerUser(): void {


    let u = Object.assign({}, this.user, this.registerForm.value);
    this.errorMessage = '';
    this.loginService.createUser(u).subscribe(
      data => {
        this.msgService.msgHeader = data.toString();
        this.router.navigate(['login']);
      },
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
        
      }
    );

    return;    
  }

  public hello() { 
    this.router.navigateByUrl('login');
  }

  private handleError(error: Response): Observable<any> {
    console.error('error');
    return Observable.throw('Server error');
  }

  private extractData(response: Response) {
    let body = response.json();
    return body.data || {};
  }

}
