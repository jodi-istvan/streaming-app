import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { finalize, from, map } from 'rxjs';

const errorTranslations = {
  required: 'This field is required',
  email: 'This field should be of valid email format'
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class SignupComponent implements OnInit {
  
  isSignupLoading: WritableSignal<boolean> = signal(false);
  
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}
  
  ngOnInit(): void {}
  
  public signup(): void {
    this.isSignupLoading.set(true);
    this.authService
      .signup(this.nameControl.value, this.emailControl.value, this.passwordControl.value)
      .pipe(finalize(() => this.isSignupLoading.set(false)))
      .subscribe(() => {
        this.router.navigate(['/auth/confirm-email'], { state: { email: this.emailControl.value }});
      });
  }
  
  get nameControl(): FormControl<string> {
    return this.form.get('name') as FormControl;
  }
  
  get emailControl(): FormControl<string> {
    return this.form.get('email') as FormControl;
  }
  
  get passwordControl(): FormControl<string> {
    return this.form.get('password') as FormControl;
  }
  
  get nameErrorMessage(): string {
    if (this.nameControl.touched && this.nameControl.invalid) {
      const errorKey = Object.keys(this.nameControl.errors)[0];
      return errorTranslations[errorKey];
    }
  }
  
  get emailErrorMessage(): string {
    if (this.emailControl.touched && this.emailControl.invalid) {
      const errorKey = Object.keys(this.emailControl.errors)[0];
      return errorTranslations[errorKey];
    }
  }
  
  get passwordErrorMessage(): string {
    if (this.passwordControl.touched && this.passwordControl.invalid) {
      const errorKey = Object.keys(this.passwordControl.errors)[0];
      return errorTranslations[errorKey];
    }
  }
}
