import { Component, OnDestroy, OnInit } from '@angular/core'; // Añadido OnInit
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms'; // Añadido AbstractControl
import { UserService } from '../../services/user.service';
import { AuthenticationService } from '../../services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs'; // Importa Subject
import { takeUntil, debounceTime, distinctUntilChanged, filter } from 'rxjs/operators'; // Añadido debounceTime, distinctUntilChanged, filter

@Component({
  standalone:true,
  selector: 'app-login-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit, OnDestroy { // Implementa OnInit y OnDestroy
  form!: FormGroup;  // Usar ! para indicar que se inicializará en ngOnInit
  loginForm!: FormGroup; // Usar ! para indicar que se inicializará en ngOnInit
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder, // Renombrado para abreviar y seguir convención
    private snackBar: MatSnackBar, // Renombrado
    private userService: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void { 
    this.form = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(4)]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/)]]
    });

    // Sign in form builder
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}/)]]
    });

    // Snackbar listeners
    this.setupFormControlListeners();
  }

  private setupFormControlListeners(): void {
    // Listening formControlName="name"
    this.form.get('name')?.valueChanges.pipe(
      debounceTime(300), // Espera 300ms después de que el usuario deje de escribir
      distinctUntilChanged(), // Solo emite si el valor realmente cambió
      takeUntil(this.destroy$)
    ).subscribe(() => { // No necesitamos el 'value' aquí si solo chequeamos el estado
      this.showErrorSnackBarIfNeeded(this.form.get('name'), "El nombre de usuario debe contener al menos 4 caracteres que pueden ser letras, números y espacios");
    });

    // Listening formControlName="email"
    this.form.get('email')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showErrorSnackBarIfNeeded(this.form.get('email'), "Debe proporcionar un correo electrónico válido y que no haya sido ya registrado previamente en esta aplicación");
    });

    // Listening formControlName="password"
    this.form.get('password')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showErrorSnackBarIfNeeded(this.form.get('password'), "La contraseña debe poseer una longitud de entre 6 y 12 caracteres, y contener números y al menos una letra, una minúscula y una mayúscula");
    });

    // Listening sign in form formControlName="email"
    this.loginForm.get('email')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showErrorSnackBarIfNeeded(this.loginForm.get('email'), "Debe proporcionar un correo electrónico válido");
    });

    // Listening sign in form formControlName="password"
    this.loginForm.get('password')?.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.showErrorSnackBarIfNeeded(this.loginForm.get('password'), "La contraseña debe poseer una longitud de entre 6 y 12 caracteres, y contener números y al menos una letra, una minúscula y una mayúscula");
    });
  }

  // Método helper para mostrar SnackBar si es necesario
  private showErrorSnackBarIfNeeded(control: AbstractControl | null, message: string): void {
    if (control && control.invalid && control.touched) { // Verifica 'invalid' Y 'touched'
      this.openSnackBar(message);
    }
  }

  ngOnDestroy(): void { // Implementar ngOnDestroy
    this.destroy$.next();
    this.destroy$.complete();
  }

  //------------------end of constructor/ngOnInit/ngOnDestroy-------------------------//

  //signup method
  signup() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); 
      this.openSnackBar("Please correct the errors in the registration form.");
      return;
    }
    const user = this.form.value;
    this.userService.create(user).subscribe(
      response => {
        if (response) { 
          this.router.navigateByUrl('/dashboard');}
    });  
    this.form.reset();          
    this.router.navigateByUrl('/dashboard'); 
  }

  //signin method
  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.openSnackBar("Please correct the errors in the login form.");
      return;
    }
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    this.authenticationService.login(email, password).subscribe(
      response => {
        if (response) { 
          this.router.navigateByUrl('/dashboard');}
    });    
  }

  //snackbar method message configuration
  openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      horizontalPosition: "center",
      verticalPosition: "bottom",
      duration: 3500 // Aumenté un poco la duración
    });
  }
}