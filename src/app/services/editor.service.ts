import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Config } from 'src/app.config';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { TournamentDTO } from '../shared/DTO/tournamentDTO';
import { UserComponent } from '../shared/user/user.component';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EditorService {

  private readonly BASE_URL = Config.apiBaseUrl + '/tournament';
  private readonly httpOptions = {
    headers: new HttpHeaders({
      'Authorization': `Bearer ${UserComponent.user!.access_token}`
    })
  };
  constructor(private http: HttpClient, private toastController: ToastController) { }

  getTournamentById(id: number): Observable<TournamentDTO> {
    return this.http.get<TournamentDTO>(`${this.BASE_URL}/${id}`);
  }

  addTournament(tournament: TournamentDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create`, tournament, this.httpOptions).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  updateTournament(tournament: TournamentDTO): Observable<any> {
    return this.http.put(`${this.BASE_URL}/update`, tournament, this.httpOptions).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  deleteTournament(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}/${id}`, this.httpOptions).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }



  private handleError(error: any): any {
    console.error(error);
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
