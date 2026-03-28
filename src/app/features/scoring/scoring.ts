import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

interface ScoreDetail {
  label: string;
  desc: string;
  pts: number;
}

interface DossierScore {
  client: string;
  ref: string;
  retard: string;
  ptsRetard: number;
  ptsHist: number;
  ptsGar: number;
  ptsInt: number;
  score: number;
  niveau: string;
  niveauColor: string;
  details: ScoreDetail[];
  reco: any;
}

@Component({
  selector: 'app-scoring',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './scoring.html',
  styleUrl: './scoring.css'
})
export class ScoringComponent {
  isScanning = false;
  scanningStep = "";
  scanningProgress = 0;
  
  dossiers: DossierScore[] = [
    {
      client: 'Ben Ali M.', ref: '#DOS-0114', retard: '5 mois',
      ptsRetard: 50, ptsHist: 40, ptsGar: 20, ptsInt: -10, score: 100,
      niveau: 'Elevé', niveauColor: '#ef4444',
      details: [
        { label: 'Retard de paiement', desc: '5 mois (> 3 mois)', pts: 50 },
        { label: 'Historique client', desc: 'Retards fréquents', pts: 40 },
        { label: 'Garanties', desc: 'Garantie moyenne', pts: 20 },
        { label: 'Intention déclarée', desc: 'Promesse paiement', pts: -10 }
      ],
      reco: {
        titre: 'Vigilance Critique', alerte: 'Pré-Escalade Juridique (M-1)',
        situation: 'Retard de 5 mois. Le dossier approche du seuil légal des 180 jours (6 mois).',
        analyse: 'Score de 100 pts malgré une promesse de paiement (-10), à cause d\'un historique de retards trop fréquents (+40).',
        action: 'Ultime tentative de contact. Préparer le dossier pour transfert automatique au Juridique dans 30 jours si la dette n\'est pas régularisée.',
        date: '20 mars 2026'
      }
    },
    {
      client: 'Trabelsi S.', ref: '#DOS-0087', retard: '4 mois',
      ptsRetard: 50, ptsHist: 20, ptsGar: 20, ptsInt: 0, score: 85,
      niveau: 'Elevé', niveauColor: '#ef4444',
      details: [], reco: null
    },
    {
      client: 'Chaari F.', ref: '#DOS-0203', retard: '2 mois',
      ptsRetard: 30, ptsHist: 5, ptsGar: 20, ptsInt: -20, score: 55,
      niveau: 'Moyen', niveauColor: '#f59e0b',
      details: [], reco: null
    },
    {
      client: 'Jebali R.', ref: '#DOS-0156', retard: '3 mois',
      ptsRetard: 30, ptsHist: 20, ptsGar: 5, ptsInt: 0, score: 48,
      niveau: 'Moyen', niveauColor: '#f59e0b',
      details: [], reco: null
    },
    {
      client: 'Ghrairi N.', ref: '#DOS-0291', retard: '3 sem.',
      ptsRetard: 10, ptsHist: 5, ptsGar: 5, ptsInt: -20, score: 22,
      niveau: 'Faible', niveauColor: '#10b981',
      details: [], reco: null
    }
  ];

  selectedDossier: DossierScore = this.dossiers[0];

  constructor(private toastService: ToastService) {}

  selectDossier(d: DossierScore) {
    this.isScanning = true;
    this.scanningProgress = 0;
    this.scanningStep = "Chargement des données historiques...";
    
    // Simulation de scan IA
    setTimeout(() => { this.scanningProgress = 30; this.scanningStep = "Analyse des garanties bancaires..."; }, 600);
    setTimeout(() => { this.scanningProgress = 60; this.scanningStep = "Calcul de la probabilité de défaut..."; }, 1200);
    setTimeout(() => { this.scanningProgress = 90; this.scanningStep = "Génération des recommandations..."; }, 1800);
    
    setTimeout(() => {
      this.isScanning = false;
      if(d.details.length > 0) {
        this.selectedDossier = d;
      } else {
         this.selectedDossier = this.dossiers[0];
      }
    }, 2200);
  }

  recalculerTout() {
    this.toastService.show("Recalcule global des scores lancé...", "info");
    this.isScanning = true;
    this.scanningProgress = 0;
    this.scanningStep = "Initialisation du moteur IA...";
    
    let interval = setInterval(() => {
      this.scanningProgress += 5;
      if (this.scanningProgress >= 100) {
        clearInterval(interval);
        this.isScanning = false;
        this.toastService.show("✅ Tous les dossiers ont été ré-analysés avec succès.", "success");
      }
      
      if (this.scanningProgress === 20) this.scanningStep = "Scan des 247 dossiers en cours...";
      if (this.scanningProgress === 50) this.scanningStep = "Mise à jour des probabilités...";
      if (this.scanningProgress === 80) this.scanningStep = "Finalisation de la priorisation...";
    }, 100);
  }

  exporterExcel() {
    this.toastService.show("Exportation du rapport de scoring...", "info");
    
    setTimeout(() => {
      const headers = ['Client', 'Réf', 'Retard', 'Score', 'Niveau'];
      let csvContent = "\uFEFF";
      csvContent += headers.join(";") + "\n";
      
      this.dossiers.forEach(d => {
        csvContent += `${d.client};${d.ref};${d.retard};${d.score};${d.niveau}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `STB_Scoring_IA_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.toastService.show("✅ Rapport exporté avec succès !", "success");
    }, 800);
  }

  formatPts(pts: number): string {
    return pts > 0 ? `+${pts}` : pts.toString();
  }

  getPtsColor(pts: number): string {
    if (pts > 20) return '#ef4444'; // red
    if (pts > 0) return '#f59e0b'; // orange
    return '#10b981'; // green
  }
}
