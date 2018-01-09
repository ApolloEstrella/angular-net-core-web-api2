import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormControlName, AbstractControl } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { GenericValidator } from '../shared/generic-validator';
import { HttpClient } from '@angular/common/http';
import { LoginService } from '../login/login.service';
import { Router } from '@angular/router';
import { MessageService } from '../shared/data.service';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { DialogsService } from '../shared/dialogs/dialogs.service';

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
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit, AfterViewInit {
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];
  
  resetPasswordForm: FormGroup;
  user: User;
  errorMessage = '';

    // Use with the generic validation message class
    displayMessage: { [key: string]: string } = {};
    private validationMessages: { [key: string]: { [key: string]: string } };
    private genericValidator: GenericValidator;

  constructor(private _fb: FormBuilder, private _http: HttpClient, private _loginService: LoginService, 
              private _msgService: MessageService, private _router: Router,
              private _dialogService : DialogsService) { 
    this.validationMessages = {
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

  ngOnInit() {
    this.resetPasswordForm = this._fb.group({
      passwordGroup: this._fb.group({
        password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]],
        confirmPassword: ['', Validators.required]
      }, { validator: passwordMatcher })
    });
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.resetPasswordForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.resetPasswordForm);
    });
  }

  resetPassword(): void {
    let u = Object.assign({}, this.user, this.resetPasswordForm.value);
    this._loginService.ResetPassword(u).subscribe(
      data => {
          this._dialogService.ok('Message Dialog', 'You password has been reset, you may login now.');
          this._router.navigate(['login']);
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
  }

}
