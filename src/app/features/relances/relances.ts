import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-relances',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './relances.html',
  styleUrls: ['./relances.css']
})
export class RelancesComponent {
  constructor(private toastService: ToastService) {}

  historique = [
    { ref: '#2026-002', client: 'Sonia Ben Rejeb', tel: '+216 98 765 432', email: 's.benrejeb@topnet.tn', canal: 'Email+SMS', date: '27/02/2026', token: 'd8f3...b92a', statut: 'En attente', reponse: 'Aucune', action: 'Relancer Voir' },
    { ref: '#2026-005', client: 'Youssef Mansour', tel: '+216 20 444 555', email: 'y.mansour@gnet.tn', canal: 'Email+SMS', date: '01/03/2026', token: 'c3e7...44dc', statut: 'Non consulté', reponse: 'Aucune', action: 'Relancer Voir' },
    { ref: '#2026-001', client: 'Mohamed Amine Ayari', tel: '+216 22 123 456', email: 'm.ayari@gmail.tn', canal: 'Email', date: '10/03/2026', token: 'a1b9...7f3e', statut: 'Répondu', reponse: 'Demande d\'échéancier', action: 'Voir réponse' },
    { ref: '#2026-004', client: 'Sonia Ben Rejeb', tel: '+216 98 765 432', email: 's.benrejeb@topnet.tn', canal: 'SMS', date: '09/03/2026', token: 'e5d2...91bf', statut: 'En attente', reponse: 'Aucune', action: 'Relancer Voir' },
    { ref: '#2026-003', client: 'Ahmed Trabelsi', tel: '+216 55 111 222', email: 'a.trabelsi@yahoo.fr', canal: 'Email', date: '27/02/2026', token: 'f4a1...c83b', statut: 'Utilisé', reponse: 'Paiement immédiat', action: 'Archivé' },
  ];

  exporterExcel() {
    this.toastService.show("Exportation de l'historique des relances...", "info");
    
    setTimeout(() => {
      const headers = ['N° Dossier', 'Client', 'Téléphone', 'Email', 'Canal', 'Date Envoi', 'Token', 'Statut', 'Réponse'];
      let csvContent = "\uFEFF";
      csvContent += headers.join(";") + "\n";
      
      this.historique.forEach(h => {
        csvContent += `${h.ref};${h.client};${h.tel};${h.email};${h.canal};${h.date};${h.token};${h.statut};${h.reponse}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `STB_Historique_Relances_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.toastService.show("✅ Historique exporté avec succès !", "success");
    }, 1000);
  }

  enregistrerAppel() {
    this.toastService.show("Ouvrir l'interface de saisie d'appel...", "info");
  }

  envoyerSMS() {
    this.toastService.show("Préparation de l'envoi de SMS de masse...", "info");
  }

  envoyerEmail() {
    this.toastService.show("Ouverture de l'éditeur d'email de relance...", "info");
  }

  relancer(h: any) {
    this.toastService.show(`✅ Nouvelle relance envoyée à ${h.client}`, "success");
  }

  voir(h: any) {
    this.toastService.show(`Consultation de l'historique de ${h.ref}...`, "info");
  }
}
