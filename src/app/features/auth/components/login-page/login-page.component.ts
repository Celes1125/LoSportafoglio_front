import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  form: FormGroup;
  snackbar: MatSnackBar
  router: Router = new Router;
  loginForm!: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _snackbar: MatSnackBar,
    private userService: UserService,
    private authenticationService: AuthenticationService,
  ) {
    //sign up form builder
    this.form = this._formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/)]]

    })    
    // sign in form builder
    this.loginForm = this._formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/)]]
    })
    // snackbar listeners
    this.snackbar = this._snackbar

    // listening formControlName="name"
    this.form.get('name')?.valueChanges.subscribe(value => {

      if (this.form.get('name')?.errors) {
        this.openSnackBar("El nombre de usuario debe contener al menos 4 caracteres que pueden ser letras, números y espacios")
      }
    })

    // listening formControlName="email"
    this.form.get('email')?.valueChanges.subscribe(value => {
      if (this.form.get('email')?.errors) {
        this.openSnackBar("Debe proporcionar un correo electrónico válido y que no haya sido ya registrado previamente en esta aplicación")
      }
    })

    // listening formControlName="password"
    this.form.get('password')?.valueChanges.subscribe(value => {
      if (this.form.get('password')?.errors) {
        this.openSnackBar("La contraseña debe poseer una longitud de entre 6 y 12 caracteres, y contener números y al menos una letra, una minúscula y una mayúscula")
      }
    })

    // listening sign in form formControlName="email" 
    this.loginForm.get('email')?.valueChanges.subscribe(value => {
      if (this.loginForm.get('email')?.errors) {
        this.openSnackBar("Debe proporcionar un correo electrónico válido")
      }
    })

    // listening sign in form formControlName="password" 
    this.loginForm.get('password')?.valueChanges.subscribe(value => {
      if (this.loginForm.get('password')?.errors) {
        this.openSnackBar("La contraseña debe poseer una longitud de entre 6 y 12 caracteres, y contener números y al menos una letra, una minúscula y una mayúscula")
      }
    })
  }
  //------------------end of constructor-------------------------//

  //signup method
  signup() {
    const user = this.form.value;
    this.userService.create(user).subscribe(
      response => {
        if (response) {
          alert('sign up successfull, now yo can login')
        }
      })
    this.form.reset()
    this.router.navigateByUrl('/dashboard');
  }
  //signin method
  login() {

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authenticationService.login(email, password).subscribe(
      response => {
        if (response) {
          this.router.navigateByUrl('/dashboard');
        }
      }
    )
  }

  //snackbar method message configuration
  openSnackBar(message: string) {
    this.snackbar.open(message, '', {
      horizontalPosition: "center",
      verticalPosition: "bottom",
      duration: 1000
    })
  }

}
