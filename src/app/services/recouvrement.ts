import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IntentionPayload {
  idDossier: number;
  typeIntention: string;
  commentaire?: string;
  datePaiementPrevue?: string;
}

@Injectable({ providedIn: 'root' })
export class RecouvrementService {

  private apiUrl = 'http://localhost:5203/api';

  constructor(private http: HttpClient) {}

  soumettreReponse(payload: IntentionPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/intention`, payload);
  }
}