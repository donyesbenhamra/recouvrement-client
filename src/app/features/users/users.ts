import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent {
  constructor(private toastService: ToastService) { }

  users = [
    { nom: 'Salah Arfaoui', email: 'salah.arfaoui@stb.com', role: 'Agent', acces: 'Dossiers, Relances', statut: 'Actif', badge: 'bok', date: '27/03/2026 08:32' },
    { nom: 'Kamel Ayed', email: 'kamel.ayed@stb.com', role: 'Agent', acces: 'Dossiers, Relances', statut: 'Inactif', badge: 'bg', date: '12/03/2026 16:45' },
    { nom: 'Amira Ben Ali', email: 'amira.benali@stb.com', role: 'Admin', acces: 'Système complet', statut: 'Actif', badge: 'bok', date: '26/03/2026 11:20' }
  ];

  ajouter() {
    this.toastService.show("Ouverture du formulaire de création d'utilisateur...", "info");
  }

  editer(u: any) {
    this.toastService.show(`Modification du compte de ${u.nom}...`, "info");
  }

  suspendre(u: any) {
    this.toastService.show(`⚠️ Le compte de ${u.nom} a été suspendu par mesure de sécurité.`, "error");
  }
}
