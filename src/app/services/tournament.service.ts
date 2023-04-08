import { Config } from 'src/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TournamentDTO } from '../shared/DTO/tournamentDTO';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private BASE_URL = Config.apiBaseUrl + "/tournament";


  constructor(private http: HttpClient) { }

  getTournamentById(id: number): Observable<TournamentDTO> {
    return this.http.get<TournamentDTO>(`${this.BASE_URL}/${id}`);
  }

  getAllTournamentDescriptors(): Observable<TournamentDescriptorDTO[]> {
    return this.http.get<TournamentDescriptorDTO[]>(`${this.BASE_URL}/all`);
  }

  getAllTournamentDescriptorsWithFilters(filters: any): Observable<TournamentDescriptorDTO[]> {
    return this.http.get<TournamentDescriptorDTO[]>(`${this.BASE_URL}/all/${filters}`);
  }



}
