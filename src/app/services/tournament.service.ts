import { Config } from 'src/app.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TournamentDescriptorDTO } from '../shared/DTO/tournamentDescriptorDTO';

@Injectable({
  providedIn: 'root'
})
export class TournamentService {

  private BASE_URL = Config.apiBaseUrl + "/tournament";


  constructor(private http: HttpClient) { }

  getAllTournamentDescriptors(): Observable<TournamentDescriptorDTO[]> {
    return this.http.get<TournamentDescriptorDTO[]>(`${this.BASE_URL}/all`);
  }

  getAllTournamentDescriptorsWithFilters(filters: any): Observable<TournamentDescriptorDTO[]> {
    return this.http.get<TournamentDescriptorDTO[]>(`${this.BASE_URL}/all/${filters}`);
  }


}
