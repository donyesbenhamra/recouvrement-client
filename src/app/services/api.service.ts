import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:5203/api';

  constructor(private http: HttpClient) { }

  // --- AGENT / ADMIN ---
  getDossiers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agent/dossiers`);
  }

  getDossierById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/agent/dossier/${id}`);
  }

  getStats(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/agent/stats`);
  }

  getIntentions(idDossier: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/intention/${idDossier}`);
  }

  // --- CLIENT SIDE (Pour référence ou preview) ---
  getClientHistorique(token: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/client/historique/${token}`);
  }
}
