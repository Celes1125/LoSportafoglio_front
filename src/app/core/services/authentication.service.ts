import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private apiUrl: string = environment.apiUrl

  constructor(
    private httpClient: HttpClient,
    private userService: UserService) { }

  //login
  login(email: string, password: string): Observable<{ response: any }> {
    return this.userService.login(email, password).pipe(
      tap((response: any) => {
        if (response && response.token) {
          //sending token to local storage
          localStorage.setItem('token', response.token);                    
        } else {
          alert('Invalid email or password');
        }
      }),
      catchError((error) => {
        alert('An error occurred during login. Please try again.');
        return of(null)
      }),
      finalize(() => {
        console.log('Authentication subscription ended');
      })
    );
  }  
  //login check
  isLogged() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    // Simple check if token has 3 parts (JWT format)
    return token.split('.').length === 3;
  }    
  // get user id
getUserId(): Observable<string> {
  return this.httpClient.get<any>(`${this.apiUrl}/users/me`).pipe(
    map((response: any) => {
      // Assuming the backend returns the user object with an _id property
      const id = response._id || response.id || response;
      console.log('userId from auth service: ', id);
      return id;
    }),
    catchError(error => {
      console.error('Error fetching user ID', error);
      return throwError(() => new Error('Error fetching user ID'));
    }),
    finalize(() => {
      console.log('getUserId subscription ended');
    })
  );
}

  

}


