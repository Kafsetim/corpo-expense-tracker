import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { 
    path: 'employee', 
    loadComponent: () => import('./modules/employee/dashboard/employee-dashboard.component')
    .then(m => m.DashboardComponent),
    canActivate: [authGuard],
    data: { role: 'employee' } // restrict to employees
  },
  { 
    path: 'manager', 
    loadComponent: () => import('./modules/manager/dashboard/manager-dashboard.component')
    .then(m => m.ManagerDashboardComponent),
    canActivate: [authGuard],
    data: { role: 'manager' } // restrict to managers
  },
  {
    path: 'employee/submit-expense',
    loadComponent: () => import('./modules/employee/submit-expense/submit-expense.component')
    .then(m => m.SubmitExpenseComponent),
    canActivate: [authGuard],
    data: { role: 'employee' }
  },
  {
    path: 'employee/expenses',
    loadComponent: () => import('./modules/employee/expense-list/expense-list.component')
    .then(m => m.ExpenseListComponent),
    canActivate: [authGuard],
    data: { role: 'employee' }
  },
  { path: '**', redirectTo: 'login' }
];
