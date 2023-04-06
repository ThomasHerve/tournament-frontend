import { Observable, catchError } from 'rxjs';

import { Config } from 'src/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { UserDTO } from '../shared/DTO/userDTO';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private BASE_URL = Config.apiBaseUrl + "/users";

  constructor(private http: HttpClient, private toastController: ToastController) { }

  registerUser(user: UserDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create`, user).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  loginUser(user: UserDTO): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.BASE_URL}/login`, user).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  recoverUser(usermail: string): Observable<UserDTO> {
    return this.http.post<UserDTO>(`${this.BASE_URL}/login`, usermail).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  getUserProfile(): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.BASE_URL}/profile`).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  private handleError(error: any): any {
    this.presentErrorToast(error.message);
    return error;
  }

  async presentErrorToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
}
