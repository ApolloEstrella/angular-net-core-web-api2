import { Component, OnInit, AfterViewInit, ViewChildren, ElementRef, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, FormControlName } from '@angular/forms';
import { LoginService } from './login.service';
import { GenericValidator } from '../shared/generic-validator';
import { Observable } from 'rxjs/Observable';
import { User } from './user';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { DialogsService } from '../shared/dialogs/dialogs.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  forgotPasswordForm: FormGroup;
  user: User

  result;

  // Use with the generic validation message class
  displayMessage: { [key: string]: string } = {};
  private validationMessages: { [key: string]: { [key: string]: string } };
  private genericValidator: GenericValidator;

  errorMessage: string;

  constructor(private _fb: FormBuilder, private _loginService: LoginService, 
             private _router: Router, public dialog: MatDialog,
             private _dialogService : DialogsService) {
    // Defines all of the validation messages for the form.
    // These could instead be retrieved from a file or database.
    this.validationMessages = {
      email: {
        required: 'Email is required.',
        pattern: 'Email format is not correct'
      }
    };

    // Define an instance of the validator for use with this form, 
    // passing in this form's set of validation messages.
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit() {

    this.forgotPasswordForm = this._fb.group({
      email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]]
    });

    //this.forgotPasswordForm = new FormGroup({
    //  email: new FormControl()
    //})
  }

  ngAfterViewInit(): void {
    // Watch for the blur event from any input element on the form.
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

    // Merge the blur event observable with the valueChanges observable
    Observable.merge(this.forgotPasswordForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(value => {
      this.displayMessage = this.genericValidator.processMessages(this.forgotPasswordForm);
    });
  }

  submitEmail() {
    let u = Object.assign({}, this.user, this.forgotPasswordForm.value);
    this._loginService.submitForgotPasswordEmail(u).subscribe(
      data => {
         this._dialogService.ok("Message Dialog", "Please check your email for new mail and click the link to reset your password.");    
         this._router.navigate(['login']); 
      },
      error => alert(error)
    );
  }

  openDialog(): void {

    this._dialogService
    .confirm('Confirm Dialog', 'Are you sure you want to do this?')
    .subscribe(res => this.result = res);
  }

}


 