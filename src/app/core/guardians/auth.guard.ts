import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);

  if(authService.isLogged()){
    console.log('Usuario autenticado, acceso permitido');
    return true;
  } else {    
    console.log('Usuario no autenticado, redirigiendo a login');
    router.navigateByUrl('/login');
    return false;
  }
};




