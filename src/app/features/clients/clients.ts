import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { ApiService } from '../../services/api.service';

interface Client {
  id: number;
  ref: string;
  nom: string;
  tel: string;
  email: string;
  agence: string;
  typeCredit: string;
  montant: string;
  retard: string;
  retardColor: string;
  statut: string;
  badgeClass: string;
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clients.html',
  styleUrl: './clients.css',
})
export class ClientsComponent implements OnInit {
  filterStatut = '';
  filterAgence = '';
  filterSearch = '';

  clients: Client[] = [];
  stats = { total: 0, montant: 0, contentieux: 0, amiable: 0, regularise: 0 };
  selectedClient: Client | null = null;
  selectedDossierDetails: any = null;
  drawerOpen = false;

  constructor(
    private router: Router, 
    private toastService: ToastService,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    this.apiService.getDossiers().subscribe(res => {
      this.clients = res.map(d => ({
        id: d.idDossier,
        ref: `#DB-${d.idDossier}`,
        nom: d.client ? `${d.client.prenom} ${d.client.nom}` : 'Inconnu',
        tel: d.client ? (d.client.tel || '+216 -- --- ---') : '+216 -- --- ---',
        email: d.client ? d.client.email : '',
        agence: d.client && d.client.agence ? d.client.agence.ville : 'Siège',
        typeCredit: d.typeEmprunt,
        montant: `${d.montantImpaye.toLocaleString()} DT`,
        retard: d.statutDossier === 'regularise' ? 'Soldé' : 'À traiter',
        retardColor: d.statutDossier === 'contentieux' ? '#B91C1C' : '#92400E',
        statut: d.statutDossier === 'contentieux' ? 'Contentieux' : (d.statutDossier === 'aimable' ? 'Amiable' : 'Régularisé'),
        badgeClass: d.statutDossier === 'contentieux' ? 'bd2' : (d.statutDossier === 'aimable' ? 'bw' : 'bok')
      }));

      // Calcul des stats réelles
      this.stats.total = this.clients.length;
      this.stats.montant = res.reduce((sum, d) => sum + d.montantImpaye, 0);
      this.stats.contentieux = this.clients.filter(c => c.statut === 'Contentieux').length;
      this.stats.amiable = this.clients.filter(c => c.statut === 'Amiable').length;
      this.stats.regularise = this.clients.filter(c => c.statut === 'Régularisé').length;
    });
  }

  get filteredClients(): Client[] {
    return this.clients.filter(c => {
      const matchStatut = !this.filterStatut || c.statut === this.filterStatut;
      const matchAgence = !this.filterAgence || c.agence === this.filterAgence;
      const matchSearch = !this.filterSearch ||
        c.nom.toLowerCase().includes(this.filterSearch.toLowerCase()) ||
        c.ref.toLowerCase().includes(this.filterSearch.toLowerCase());
      return matchStatut && matchAgence && matchSearch;
    });
  }

  traiter(client: Client) {
    this.router.navigate(['/scoring']);
  }

  voirFiche(client: Client) {
    this.selectedClient = client;
    this.drawerOpen = true;
    this.selectedDossierDetails = null; // Reset avant chargement

    this.apiService.getDossierById(client.id).subscribe(res => {
      this.selectedDossierDetails = res;
    });
  }

  fermerTiroir() {
    this.drawerOpen = false;
    setTimeout(() => {
      this.selectedClient = null;
    }, 300); // Laisse le temps à l'animation de se terminer
  }

  actionRelance(type: string) {
    if (!this.selectedClient) return;
    
    // Simulate API call
    setTimeout(() => {
      let msg = '';
      if (type === 'sms') msg = `✅ SMS de relance envoyé à ${this.selectedClient?.nom} (${this.selectedClient?.tel})`;
      if (type === 'email') msg = `✅ E-mail envoyé avec succès à ${this.selectedClient?.email}`;
      if (type === 'token') msg = `✅ Lien de paiement généré et transmis au client !`;
      
      this.toastService.show(msg, 'success');
      this.fermerTiroir();
    }, 500);
  }

  exporterExcel() {
    this.toastService.show("Préparation de l'export Excel...", "info");
    
    // Attendre un tout petit peu pour l'effet visuel
    setTimeout(() => {
      const data = this.filteredClients;
      const headers = ['N° Dossier', 'Client', 'Téléphone', 'Email', 'Agence STB', 'Type Crédit', 'Montant Dû', 'Retard', 'Statut'];
      
      let csvContent = "\uFEFF"; // BOM pour l'encodage Excel
      csvContent += headers.join(";") + "\n";
      
      data.forEach(c => {
        const row = [c.ref, c.nom, c.tel, c.email, c.agence, c.typeCredit, c.montant, c.retard, c.statut];
        csvContent += row.join(";") + "\n";
      });

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `STB_Liste_Clients_${new Date().getFullYear()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      this.toastService.show("✅ Fichier Excel téléchargé avec succès !", "success");
    }, 1000);
  }

  creerClient() {
    this.toastService.show("Ouverture du formulaire de création de dossier client...", "info");
  }
}