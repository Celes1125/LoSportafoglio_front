import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable, catchError, finalize, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  constructor(
    private httpClient: HttpClient,
    private userService: UserService) { }

  //login
  login(email: string, password: string): Observable<{ response: any }> {
    return this.userService.login(email, password).pipe(
      tap((response: any) => {
        if (response && response.token) {
          alert('login successfull');
          //sending token to local storage
          localStorage.setItem('token', response.token);
        } else if (response.message == "wrong password") {
          alert('wrong user or password')
        } else {
          alert('credentials not matching')
        }
      }),
      catchError((error) => {
        alert('ERROR: ' + error);
        return of(null)
      }),
      finalize(() => {
        console.log('Authentication subscription ended');
      })
    );
  }

  //login check
  isLogged() {
    return !!localStorage.getItem('token')
  }

  // get user id
  // get user id
getUserId(): Observable<any> {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error("No token found");
    return throwError(() => new Error("No token found"));
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.httpClient.get(`https://losportafoglio.onrender.com/users/token/${token}`, { headers }).pipe(
    tap((response: any) => {
      console.log('userId from auth service: ', response);
      return response;
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


