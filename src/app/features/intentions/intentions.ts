import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intentions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './intentions.html',
  styleUrl: './intentions.css'
})
export class IntentionsComponent {
  constructor(private toastService: ToastService, private router: Router) {}

  intentions = [
    { ref: '#2026-001', client: 'Mohamed Amine Ayari', canal: 'SMS', reponse: 'Je paierai demain matin', intention: 'Promesse de paiement', badge: 'bok', confiance: '98%', date: '27/03/2026', sentiment: '😊', avatar: 'https://i.pravatar.cc/150?u=1' },
    { ref: '#2026-005', client: 'Youssef Mansour', canal: 'Email', reponse: 'Je n\'ai pas d\'argent en ce moment', intention: 'Refus', badge: 'bd2', confiance: '92%', date: '26/03/2026', sentiment: '😠', avatar: 'https://i.pravatar.cc/150?u=5' },
    { ref: '#2026-003', client: 'Ahmed Trabelsi', canal: 'SMS', reponse: 'Pouvez-vous me donner jusqu\'au 15?', intention: 'Demande délai', badge: 'bw', confiance: '85%', date: '25/03/2026', sentiment: '😐', avatar: 'https://i.pravatar.cc/150?u=3' },
    { ref: '#2026-002', client: 'Sonia Ben Rejeb', canal: 'Email', reponse: 'Ceci est une erreur, j\'ai déjà payé.', intention: 'Contestation', badge: 'bd2', confiance: '88%', date: '24/03/2026', sentiment: '😠', avatar: 'https://i.pravatar.cc/150?u=2' },
  ];

  exporterExcel() {
    this.toastService.show("Exportation des intentions détectées...", "info");
    
    setTimeout(() => {
      const headers = ['Réf', 'Client', 'Canal', 'Message', 'Intention IA', 'Confiance', 'Date'];
      let csvContent = "\uFEFF";
      csvContent += headers.join(";") + "\n";
      
      this.intentions.forEach(i => {
        csvContent += `${i.ref};${i.client};${i.canal};${i.reponse};${i.intention};${i.confiance};${i.date}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `STB_Analyse_Intentions_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.toastService.show("✅ Analyse exportée avec succès !", "success");
    }, 1000);
  }

  traiter(i: any) {
    this.router.navigate(['/scoring']);
  }

  actualiser() {
    this.toastService.show("Actualisation de l'analyse sémantique en cours...", "info");
  }
}
