import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  bgimg: string = 'bg-login-desktop.jpg';

  loginForm!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({

      email: new FormControl 
      ("", [Validators.required, Validators.email]),

      password: new FormControl 
      ("", [Validators.required, Validators.minLength(7)]),

    })
  }

  login(): void {
    const name = this.loginForm.value.name;
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    this.authService.login(name, email, password).subscribe(
      (user) => {
        console.log(user); // tulosta käyttäjän tiedot konsolissa
      },
      (error) => {
        console.error(error); // tulosta virhe konsolissa
      }
    );
  }
}
