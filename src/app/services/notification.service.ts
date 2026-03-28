import { Injectable, signal } from '@angular/core';

export interface NotificationCounts {
  intentions: number;
  relances: number;
  impayes: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private countsSig = signal<NotificationCounts>({
    intentions: 5,
    relances: 3,
    impayes: 12
  });

  counts = this.countsSig.asReadonly();

  constructor() {}

  // Simulation d'une mise à jour
  refresh() {
    // Dans le futur, appeler une API ici
    this.countsSig.set({
      intentions: Math.floor(Math.random() * 10),
      relances: Math.floor(Math.random() * 5),
      impayes: 10 + Math.floor(Math.random() * 5)
    });
  }
}
