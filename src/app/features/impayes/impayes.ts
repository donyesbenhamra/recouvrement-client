import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-impayes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './impayes.html',
  styleUrls: ['./impayes.css']
})
export class ImpayesComponent {
  filterStatut = '';

  constructor(private toastService: ToastService) {}

  impayes = [
    {
      nom: 'Mohamed Amine Ayari', ref: '#2026-001', dateOctroi: '15/01/2022', dateEcheance: '15/01/2026',
      montantInitial: '50 000 DT', dejaPaye: '7 500 DT', principalDu: '42 500 DT', frais: '100 DT',
      taux: '11%', retard: '62j', interets: '0.000 DT', totalAregler: '42 600.000 DT', action: 'Voir Relancer'
    },
    {
      nom: 'Sonia Ben Rejeb', ref: '#2026-002', dateOctroi: '10/05/2023', dateEcheance: '10/10/2025',
      montantInitial: '20 000 DT', dejaPaye: '1 800 DT', principalDu: '18 200 DT', frais: '150 DT',
      taux: '18%', retard: '150j', interets: '1 346.301 DT', totalAregler: '19 696.301 DT', action: 'Voir Traiter'
    },
    {
      nom: 'Ahmed Trabelsi', ref: '#2026-003', dateOctroi: '20/11/2023', dateEcheance: '20/02/2026',
      montantInitial: '10 000 DT', dejaPaye: '10 000 DT', principalDu: '0 DT', frais: '20 DT',
      taux: '9%', retard: 'Soldé', interets: '0.000 DT', totalAregler: '0.000 DT', action: 'Voir'
    },
    {
      nom: 'Sonia Ben Rejeb', ref: '#2026-004', dateOctroi: '05/02/2024', dateEcheance: '15/01/2026',
      montantInitial: '5 000 DT', dejaPaye: '1 850 DT', principalDu: '3 150 DT', frais: '50 DT',
      taux: '12%', retard: '62j', interets: '0.000 DT', totalAregler: '3 200.000 DT', action: 'Voir Relancer'
    },
    {
      nom: 'Youssef Mansour', ref: '#2026-005', dateOctroi: '12/03/2021', dateEcheance: '12/08/2025',
      montantInitial: '80 000 DT', dejaPaye: '15 000 DT', principalDu: '65 000 DT', frais: '250 DT',
      taux: '14%', retard: '210j', interets: '5 235.616 DT', totalAregler: '70 485.616 DT', action: 'Voir Traiter'
    }
  ];

  get filteredImpayes() {
    if (!this.filterStatut) return this.impayes;
    return this.impayes.filter(i => {
      if (this.filterStatut === 'Soldé') return i.retard === 'Soldé';
      if (this.filterStatut === 'Sans intérêt') return i.interets === '0.000 DT';
      if (this.filterStatut === 'Avec intérêt >=90j') return i.interets !== '0.000 DT';
      return true;
    });
  }

  exporterExcel() {
    this.toastService.show("Génération du rapport financier...", "info");
    
    setTimeout(() => {
      const headers = ['Client', 'Réf', 'Principal Dû', 'Frais', 'Retard', 'Intérêts', 'Total à Régler'];
      let csvContent = "\uFEFF";
      csvContent += headers.join(";") + "\n";
      
      this.filteredImpayes.forEach(i => {
        csvContent += `${i.nom};${i.ref};${i.principalDu};${i.frais};${i.retard};${i.interets};${i.totalAregler}\n`;
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `STB_Impayes_Detail_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.toastService.show("✅ Rapport financier exporté !", "success");
    }, 1000);
  }

  relancer(i: any) {
    this.toastService.show(`✅ Relance automatique envoyée à ${i.nom}`, "success");
  }

  voir(i: any) {
    this.toastService.show(`Ouverture du dossier ${i.ref}...`, "info");
  }

  exporterPDF() {
    this.toastService.show("Génération du document PDF en cours...", "info");
  }
}
