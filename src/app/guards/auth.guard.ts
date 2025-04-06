import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private tokenService: TokenService,
    private router: Router
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    
    console.log('Auth guard: checking authentication');
    
    if (this.tokenService.isLoggedIn()) {
      console.log('Auth guard: user is authenticated');
      
      // If user is trying to access login or signup while already logged in,
      // redirect to welcome page
      if (state.url === '/login' || state.url === '/signup') {
        this.router.navigate(['/welcome']);
        return false;
      }
      
      return true;
    }
    
    console.log('Auth guard: user is not authenticated, redirecting to login');
    this.router.navigate(['/login']);
    return false;
  }
}
