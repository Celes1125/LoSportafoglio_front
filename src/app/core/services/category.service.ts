import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, concatMap, defaultIfEmpty, filter, finalize, map, of, switchMap, tap, throwError } from 'rxjs';
import { Category } from '../interfaces/category';
import { AuthenticationService } from './authentication.service';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = "https://losportafoglio.onrender.com/categories/"
  userId!: string
  constructor(
    private http: HttpClient,
    private _authService: AuthenticationService) {
    this.getUser()
  }
  //get user id
  getUser() {
    this._authService.getUserId().subscribe(
      (response: string) => {
        console.log('front response: ', response)
        this.userId = response
      }
    )
  }
  // get all not deleted categories of the user
  getAll(): Observable<Category[]> {
    return this._authService.getUserId().pipe(
      concatMap((userId) => {
        return this.http.get<Category[]>(this.url + 'notDeleted/' + userId)
      }),
      //If empty, returns an empty array
      defaultIfEmpty([]),
      // error manage
      catchError((error) => {
        console.log('error: ', error);
        return of([]); // if error, then returns an empty array too
      }),
      // finalize actions
      finalize(() => console.log("get categories subscription ended"))
    );
  }
  //create category
  create(category: any): Observable<Category> | any {
    const newCategory = { ...category, creator: this.userId }
    return this.http.post(this.url, newCategory).pipe(
      tap(response => console.log("Create category response: ", response)),
      catchError((error) => {
        console.error("Error in create category:", error);
        return throwError(() => error);
      }),
      finalize(() => console.log("Create cateogry subscription ended"))
    );
  }
  //edit category
  edit(category: any): Observable<Category> | any {
    const id = category._id
    const url = this.url + id
    return this.http.put(url, category).pipe(
      tap(response => console.log(response)),
      catchError(error => error),
      finalize(() => console.log("put category subscription ended"))
    )
  }
  //logic delete category
  delete(id: string) {
    return this.http.patch(this.url + id, {}).pipe(
      tap(response => console.log(response)),
      catchError(error => error),
      finalize(() => console.log("delete category subscription ended"))
    )
  }
  //get category by id
  getById(id: string) {
    return this.http.get(this.url + id).pipe(
      tap(response => console.log(response)),
      catchError(error => error),
      finalize(() => console.log("get by id category subscription ended"))
    )
  }

}



