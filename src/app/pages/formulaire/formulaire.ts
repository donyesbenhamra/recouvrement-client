import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIfContext } from '@angular/common';
import { TokenService, ClientHistoriqueDto, DossierDto } from '../../services/token';
import { RecouvrementService } from '../../services/recouvrement';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-formulaire',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './formulaire.html',
  styleUrl: './formulaire.css'
})
export class FormulaireComponent implements OnInit {

  clientData: ClientHistoriqueDto | null = null;
  dossier: DossierDto | null = null;
  token!: string;
  idDossier!: number;
  form!: FormGroup;
  submitted = false;
  loading = false;
  ongletActif = 'overview';
  fichierSelectionne: File | null = null;

  actionsDisponibles = [
  { value: 'paiement_immediat', label: 'Règlement total' },
  { value: 'paiement_partiel', label: 'Règlement partiel' },
  { value: 'demande_echeance', label: "Demande d'échéancier" },
  { value: 'demande_consolidation', label: 'Demande de consolidation' },
 
];
confirmationBlock: TemplateRef<NgIfContext<boolean>> | null | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private recouvrementService: RecouvrementService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.idDossier = Number(this.route.snapshot.paramMap.get('idDossier'));
    this.clientData = this.tokenService.getClientDataFromSession();

    if (!this.clientData) {
      this.router.navigate(['/token-invalide']);
      return;
    }

    this.dossier = this.clientData.dossiers.find(
      d => d.idDossier === this.idDossier
    ) || null;

    if (!this.dossier) {
      this.router.navigate(['/token-invalide']);
      return;
    }

    this.form = this.fb.group({
      typeIntention: ['', Validators.required],
      datePaiementPrevue: [null],
      commentaire: ['', Validators.maxLength(500)]
    });

    this.form.get('typeIntention')?.valueChanges.subscribe(val => {
      const dateCtrl = this.form.get('datePaiementPrevue');
      if (val === 'promesse_paiement') {
        dateCtrl?.setValidators([Validators.required]);
      } else {
        dateCtrl?.clearValidators();
      }
      dateCtrl?.updateValueAndValidity();
    });
  }
  get montantPaye(): number {
  if (!this.dossier?.paiements) return 0;
  return this.dossier.paiements.reduce((sum, p) => sum + p.montantPaye, 0);
}

  get joursRetard(): number {
    if (!this.dossier?.dateEcheance) return 0;
    const echeance = new Date(this.dossier.dateEcheance);
    const today = new Date();
    const diff = today.getTime() - echeance.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }

  onFileSelected(event: any): void {
    this.fichierSelectionne = event.target.files[0] || null;
  }

  uploadFichier(): void {
    if (!this.fichierSelectionne) return;
    const formData = new FormData();
    formData.append('fichier', this.fichierSelectionne);
    this.http.post(`http://localhost:5203/api/client/upload/${this.token}`, formData).subscribe({
      next: () => {
        alert('Fichier envoyé avec succès !');
        this.fichierSelectionne = null;
      },
      error: () => alert('Erreur lors de l\'envoi.')
    });
  }

  telechargerRecu(): void {
  window.open(`http://localhost:5203/api/client/recu/${this.token}?idDossier=${this.idDossier}`, '_blank');
}

  telechargerHistorique(): void {
    window.open(`http://localhost:5203/api/client/historique-pdf/${this.token}/${this.idDossier}`, '_blank');
  }

  retourDossiers(): void {
    this.router.navigate(['/client', this.token]);
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = {
      idDossier: this.idDossier,
      typeIntention: this.form.value.typeIntention,
      commentaire: this.form.value.commentaire,
      datePaiementPrevue: this.form.value.datePaiementPrevue,
     montantPropose: this.form.value.montantPropose
    };

    this.recouvrementService.soumettreReponse(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/confirmation'], {
          state: {
            idDossier: this.idDossier,
            typeIntention: this.form.value.typeIntention,
            token: this.token
          }
        });
      },
      error: () => {
        this.loading = false;
      }
    });
    this.form = this.fb.group({
  typeIntention: ['', Validators.required],
  datePaiementPrevue: [null],
  montantPropose: [null],
  commentaire: ['', Validators.maxLength(500)]
});
  }
  
}