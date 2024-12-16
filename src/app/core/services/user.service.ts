import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl: string = environment.apiUrl; // Base URL desde el entorno
  private url = `${this.apiUrl}/users/`; // Endpoint para usuarios

  constructor(private httpClient: HttpClient) { }

  // Crear usuario
  public create(user: User): Observable<any> {
    return this.httpClient.post(this.url, user);
  }

  // Login
  public login(email: string, password: string): Observable<any> {
    return this.httpClient.post(`${this.url}login`, { email, password });
  }

  // Obtener usuario por email
  public getUserByEmail(userEmail: string): Observable<User> {
    // El endpoint espera el parámetro `email` en la query string
    const params = new HttpParams().set('email', userEmail);

    // Imprime la URL final para depuración
    console.log('URL final: ', `${this.url}email?email=${userEmail}`);

    // Realiza la solicitud HTTP GET
    return this.httpClient.get<User>(`${this.url}email`, { params });
  }
}
