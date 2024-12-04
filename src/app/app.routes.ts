import { Routes } from '@angular/router';
import { authGuard } from './core/guardians/auth.guard';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { DashboardComponent } from './core/features/dashboard/dashboard.component';
import { MovementsPageComponent } from './pages/movements-page/movements-page.component';
import { LoginPageComponent } from './core/features/login-page/login-page.component';

export const routes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate:[authGuard]},
    { path: 'dashboard/reports/movementsTable', component: MovementsPageComponent}, // for pdf downloads
    { path: 'login', component: LoginPageComponent},  
    { path: '', redirectTo: 'login', pathMatch: 'full' },      
    { path:'**', component: NotFoundComponent},// remember apply lazy loading when understand it
  

];
