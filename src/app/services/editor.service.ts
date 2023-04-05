import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastController } from '@ionic/angular';
import { TournamentDTO } from './../editor/DTO/tournamentDTO';
import { TournamentDescriptorDTO } from '../editor/DTO/tournamentDescriptorDTO';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EditorService {

  private readonly BASE_URL = 'http://90.66.62.181:3000/api/tournament/';

  constructor(private http: HttpClient, private toastController: ToastController) { }

  getAllTournamentDescriptors(): Observable<TournamentDescriptorDTO[]> {
    return this.http.get<TournamentDescriptorDTO[]>(this.BASE_URL);
  }

  getTournamentById(id: number): Observable<TournamentDTO> {
    return this.http.get<TournamentDTO>(`${this.BASE_URL}${id}`);
  }

  addTournament(tournament: TournamentDTO): Observable<any> {
    return this.http.post(`${this.BASE_URL}/create`, tournament).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  updateTournament(tournament: TournamentDTO): Observable<any> {
    return this.http.put(`${this.BASE_URL}`, tournament).pipe(
      catchError((error: any) => { throw this.handleError(error) })
    );
  }

  deleteTournament(id: number): Observable<any> {
    return this.http.delete(`${this.BASE_URL}${id}`).pipe(
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
