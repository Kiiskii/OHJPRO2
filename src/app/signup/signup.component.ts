import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent {
  bgimg: string = 'bg-login-desktop.jpg';

  signupForm!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.signupForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({

      name: new FormControl 
      ("", [Validators.required, Validators.minLength(2)]),

      email: new FormControl 
      ("", [Validators.required, Validators.email]),

      password: new FormControl 
      ("", [Validators.required, Validators.minLength(7)]),

    })
  }

  signup(): void {
    this.authService
      .signup(this.signupForm.value)
      .subscribe((msg) => console.log(msg))
  }
}
