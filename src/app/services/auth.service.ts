import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://ems-backend-96g7.onrender.com/graphql';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }

  login(usernameOrEmail: string, password: string): Observable<any> {
    const loginQuery = {
      query: `
        query Login($usernameOrEmail: String!, $password: String!) {
          login(usernameOrEmail: $usernameOrEmail, password: $password) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        usernameOrEmail,
        password
      }
    };

    return this.http.post(this.apiUrl, loginQuery).pipe(
      map((response: any) => {
        if (response.data?.login?.token) {
          const token = response.data.login.token;
          this.tokenService.setToken(token);
          return response.data.login;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Login failed');
        } else {
          throw new Error('Invalid response format');
        }
      })
    );
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const signupQuery = {
      query: `
        mutation Signup($username: String!, $email: String!, $password: String!) {
          signup(username: $username, email: $email, password: $password) {
            token
            user {
              id
              username
              email
            }
          }
        }
      `,
      variables: {
        username,
        email,
        password
      }
    };

    return this.http.post(this.apiUrl, signupQuery).pipe(
      map((response: any) => {
        if (response.data?.signup?.token) {
          const token = response.data.signup.token;
          this.tokenService.setToken(token);
          return response.data.signup;
        } else if (response.errors) {
          throw new Error(response.errors[0]?.message || 'Signup failed');
        } else {
          throw new Error('Invalid response format');
        }
      })
    );
  }

  logout(): void {
    this.tokenService.removeToken();
  }

  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }

  getCurrentUser(): any {
    const decodedToken = this.tokenService.getDecodedToken();
    if (decodedToken) {
      return {
        id: decodedToken.id,
        username: decodedToken.username,
        email: decodedToken.email
      };
    }
    return null;
  }
}
