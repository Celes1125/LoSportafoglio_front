import { Routes } from '@angular/router';
import { authGuard } from './core/guardians/auth.guard';
//import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    { path:'**', redirectTo: 'login'},
    { path: 'login', 
        loadComponent: ()=> import('./core/features/login-page/login-page.component')
        .then(m=>m.LoginPageComponent)},  
    { path: 'dashboard', 
        loadComponent: ()=>import('./core/features/dashboard/dashboard.component')
        .then(m=>m.DashboardComponent), canActivate:[authGuard]},
    { path: 'dashboard/reports/movementsTable', 
        loadComponent: ()=> import('./pages/movements-page/movements-page.component')
        .then(m => m.MovementsPageComponent)},              
    
];
