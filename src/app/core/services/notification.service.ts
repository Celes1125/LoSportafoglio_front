import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, concatMap, defaultIfEmpty, finalize, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  userId!: string
  constructor(
    private http: HttpClient,
    private _authService: AuthenticationService,
  ) {
    this._authService.getUserId().subscribe(response => this.userId = response)
  }
  url = "https://losportafoglio.onrender.com/notifications/"

  // send notification
  sendInvitation(walletId: string, userEmail: string): Observable<any> {
    let newNotification = {
      wallet: walletId,
      senderUser: this.userId,
      receiverEmail: userEmail,
      type: 'invitation',
      status: 'pendiente'

    }

    return this.http.post(this.url, newNotification).pipe(
      tap(response => response),
      catchError(error => error),
      finalize(() => {
        console.log('create notification subscription ended')
      })
    )
  }
  //get all notifications
  getAllNotifications(): any {
    return this._authService.getUserId().pipe(
      concatMap((user: any) =>
        this.http.get(`${this.url}${user}`).pipe(
          tap((response: any) => console.log('all user notifications: ', response)),
          //If empty, returns an empty array
          defaultIfEmpty([]),
          // error manage
          catchError((error) => {
            console.log('error: ', error);
            return of([]); // if error, then returns an empty array too
          }),
          // finalize actions
          finalize(() => console.log("get notifications subscription ended"))
        )
      ))
  }

}

