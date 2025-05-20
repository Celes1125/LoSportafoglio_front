import { Routes } from '@angular/router';
import { authGuard } from './core/guardians/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    /*{ path: '**', redirectTo: 'notFound' },
    {
        path: 'notFound', loadComponent: () => import('./pages/not-found/not-found.component')
            .then(m => m.NotFoundComponent)
    },*/
    {
        path: 'login',
        loadComponent: () => import('./core/features/login-page/login-page.component')
            .then(m => m.LoginPageComponent)
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () => import('./core/features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        children: [
          {
            path: '',
            redirectTo: 'home',
            pathMatch: 'full'
          },
          {
            path: 'home',
            loadComponent: () => import('./core/features/home/home.component')
              .then(m => m.HomeComponent)
          },
          {
            path: 'manage',
            loadComponent: () => import('./pages/manage-page/manage-page.component')
              .then(m => m.ManagePageComponent)
          },
          {
            path: 'reports',
            loadComponent: () => import('./pages/reports-page/reports-page.component')
              .then(m => m.ReportsPageComponent),
              children: [
                {
                    path: 'movementsTable', // reports/movementsTable
                    loadComponent: () => import('./pages/movements-page/movements-page.component')
                      .then(m => m.MovementsPageComponent)
                  }
              ]
          },
          
        ]
      }
      
]
