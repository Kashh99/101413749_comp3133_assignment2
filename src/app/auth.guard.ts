import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from './services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    // Check if user is authenticated
    if (this.tokenService.isLoggedIn()) {
      // User is authenticated
      
      // If user is trying to access login or signup while already logged in,
      // redirect to welcome page
      if (state.url === '/login' || state.url === '/signup') {
        this.router.navigate(['/welcome']);
        return false;
      }
      
      return true;
    }
    
    // User is not authenticated
    
    // If user is trying to access a protected route
    if (state.url !== '/login' && state.url !== '/signup') {
      // Show notification
      this.snackBar.open('Please log in to access this page', 'Close', {
        duration: 3000,
        panelClass: ['warning-snackbar']
      });
      
      // Redirect to login
      this.router.navigate(['/login'], { 
        queryParams: { 
          returnUrl: state.url 
        } 
      });
    }
    
    // Allow access to login and signup pages when not authenticated
    return state.url === '/login' || state.url === '/signup';
  }
} 