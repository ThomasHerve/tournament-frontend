import { Config } from 'src/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private apiUrl = Config.apiBaseUrl + "/tournament";


  constructor(private http: HttpClient) { }

  getAllTournaments(): Observable<TournamentDescriptorDTO> {
    return this.http.get<TournamentDescriptorDTO>(`${this.apiUrl}/all`);
  }

  getAllTournamentsWithFilters(filters: any): Observable<TournamentDescriptorDTO> {
    return this.http.get<TournamentDescriptorDTO>(`${this.apiUrl}/all/${filters}`);
  }

}
