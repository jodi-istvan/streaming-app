import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { finalize, map } from 'rxjs';

const errorTranslations = {
  required: 'This field is required',
  email: 'This field should be of valid email format'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  isLoginLoading: WritableSignal<boolean> = signal(false);
  
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}
  
  ngOnInit(): void {}
  
  public login(): void {
    // 'admin32@gmail.com', 'admin2121'
    this.isLoginLoading.set(true);
    this.authService.login(this.emailControl.value, this.passwordControl.value).pipe(
      map(() => this.authService.initUser()),
      finalize(() => this.isLoginLoading.set(false))
    ).subscribe();
  }
  
  get emailControl(): FormControl<string> {
    return this.form.get('email') as FormControl;
  }
  
  get passwordControl(): FormControl<string> {
    return this.form.get('password') as FormControl;
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
