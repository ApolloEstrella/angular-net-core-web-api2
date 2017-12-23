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
import { LoginService} from '../login/login.service';
import { User } from '../login/user';

function passwordMatcher(c: AbstractControl): {[key: string]: boolean} | null {
  let passwordControl = c.get('password')
  let confirmPasswordControl = c.get('confirmPassword');

  if (passwordControl.pristine || confirmPasswordControl.pristine){
      return  null;
  }
  if (passwordControl.value === confirmPasswordControl.value){
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

  constructor(private fb: FormBuilder, private http: HttpClient, private loginService: LoginService, private router: Router) { 
     
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

  

  /*ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', Validators.required],
      passwordGroup: this.fb.group({
          passWord: ['',Validators.required],
          confirmPassword: ['',Validators.required],
      },{validator: passwordMatcher
      })
    });*/

    ngOnInit(): void {
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+')]],
        passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.pattern('((?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})')]],
        confirmPassword: ['', Validators.required]
        }, {validator: passwordMatcher})        
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

  
    
  registerUser() : void {
    
     
    let u = Object.assign({}, this.user, this.registerForm.value);
    this.errorMessage = '';
     this.loginService.createUser(u).subscribe(
      data => this.router.navigate(['login']),
      error => {
          var err = JSON.parse(JSON.stringify(error));
          this.errorMessage = '';
          for (var key in err.error) {
              var obj = err.error[key]
              this.errorMessage += '- ' + obj + '<br/>';
          };
          if (this.errorMessage != ''){
            this.errorMessage += '<br/>';
          }
          alert(this.errorMessage);
      }
     );
    
    
    return;
    //this.loginService.registerUser()


    //let headers = new Headers({ 'Content-Type': 'application/json' });
    //let options = new RequestOptions({ headers: headers });
      //const url = 'http://localhost:3651/api/cities';
      //const baseUrl = 'http://localhost:3651/api/cities';
      //const url = `${baseUrl}`;
     // let data=JSON.stringify({uname:"raja"});
      //this.http.post(url, 'user=apol' , options);
 

      //this.http.post(baseUrl, data, options)
      //.map(res => res.json)
      //.catch(this.handleError).subscribe();


      //this.http.post(baseUrl, { uname: 'apol'}, options).subscribe(res => console.log(res.text()));;

      


      /* this.http.post(baseUrl, {
        data,
      })
        .subscribe(
          res => {
            console.log(res);
          },
          err => {
            console.log("Error occured");
          }
        ); */



      //this.http.post(baseUrl, 'uname=apol', options).subscribe();    

      //this.http.post(baseUrl, { username: 'apol', password: 'abc' })
      //.map(this.extractData)
      //.do(data => console.log('createUser: ' + JSON.stringify(data)))
      //.catch(this.handleError).subscribe();

      /*this.http.get(baseUrl)
      .map(this.extractData)
      .do(data => console.log('getProducts: ' + JSON.stringify(data)))
      .catch(this.handleError).subscribe(); */

       /* this.http.get(baseUrl).map((data: any[]) => {
          this.products = data;
          return true;
       })
       .do(() => console.log('do'))
       .catch(this.handleError).subscribe(); */

      //this.http.get(baseUrl).subscribe(res => console.log(res.text()));


      //console.log('save user');
   }

   private handleError(error: Response): Observable<any> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error('error');
    return Observable.throw('Server error');
}

private extractData(response: Response) {
  let body = response.json();
  return body.data || {};
}
  
}
