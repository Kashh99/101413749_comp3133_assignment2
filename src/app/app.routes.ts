import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeAddComponent } from './components/employee-add/employee-add.component';
import { EmployeeDetailsComponent } from './components/employee-details/employee-details.component';
import { EmployeeEditComponent } from './components/employee-edit/employee-edit.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: 'welcome', 
    component: WelcomeComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees', 
    component: EmployeeListComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees/add', 
    component: EmployeeAddComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees/:id', 
    component: EmployeeDetailsComponent, 
    canActivate: [AuthGuard] 
  },
  { 
    path: 'employees/:id/edit', 
    component: EmployeeEditComponent, 
    canActivate: [AuthGuard] 
  },
  { path: '**', redirectTo: '/welcome' }
];
