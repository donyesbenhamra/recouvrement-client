import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
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
  form: FormGroup;
  submitted = false;
  loading = false;
  dataLoading = true;
  ongletActif = 'overview';
  fichierSelectionne: File | null = null;
  messageForm: FormGroup;
  messageSending = false;

  actionsDisponibles = [
    { value: 'paiement_immediat', label: 'Règlement total' },
    { value: 'paiement_partiel', label: 'Règlement partiel' },
    { value: 'promesse_paiement', label: 'Promesse de paiement' },
    { value: 'demande_echeance', label: "Demande d'échéancier" },
    { value: 'demande_consolidation', label: 'Demande de consolidation' },
  ];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private recouvrementService: RecouvrementService,
    private http: HttpClient
  ) {
    // Initialisation du formulaire dès la création du composant
    this.form = this.fb.group({
      typeIntention: ['', Validators.required],
      datePaiementPrevue: [null],
      montantPropose: [null],
      commentaire: ['', Validators.maxLength(500)]
    });

    this.messageForm = this.fb.group({
      message: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
  this.token = this.route.snapshot.paramMap.get('token')!;
  this.idDossier = Number(this.route.snapshot.paramMap.get('idDossier'));

  // Essayer d'abord le sessionStorage
  const cachedData = this.tokenService.getClientDataFromSession();
  
  if (cachedData) {
    this.clientData = cachedData;
    this.dossier = cachedData.dossiers.find(
      d => Number(d.idDossier) === Number(this.idDossier)
    ) || null;

    if (!this.dossier) {
      this.router.navigate(['/token-invalide']);
      return;
    }
    this.dataLoading = false;
  } else {
    // Si pas de cache, appel API
    this.tokenService.getClientData(this.token).subscribe({
      next: data => {
        this.clientData = data;
        this.tokenService.saveClientData(data);
        this.dossier = data.dossiers.find(
          d => Number(d.idDossier) === Number(this.idDossier)
        ) || null;

        if (!this.dossier) {
          this.router.navigate(['/token-invalide']);
          return;
        }
        this.dataLoading = false;
      },
      error: () => {
        this.dataLoading = false;
        this.router.navigate(['/token-invalide']);
      }
    });
  }

  this.form.get('typeIntention')?.valueChanges.subscribe(val => {
    const dateCtrl = this.form.get('datePaiementPrevue');
    const montantCtrl = this.form.get('montantPropose');

    dateCtrl?.clearValidators();
    montantCtrl?.clearValidators();

    if (val === 'demande_echeance' || val === 'promesse_paiement') {
      dateCtrl?.setValidators([Validators.required]);
    }
    if (val === 'paiement_partiel') {
      montantCtrl?.setValidators([Validators.required]);
    }

    dateCtrl?.updateValueAndValidity();
    montantCtrl?.updateValueAndValidity();
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

  get progressionPaiement(): number {
    if (!this.dossier?.montantInitial || this.dossier.montantInitial === 0) return 0;
    const paye = this.dossier.montantInitial - this.dossier.montantImpaye;
    return Math.round((paye / this.dossier.montantInitial) * 100);
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
  }

  envoyerMessage(): void {
    if (this.messageForm.invalid || this.messageSending) return;
    this.messageSending = true;

    const message = (this.messageForm.value.message ?? '').toString();

    this.recouvrementService.envoyerMessageClient(this.token, this.idDossier, message).subscribe({
      next: () => {
        this.messageForm.reset();

        // Rafraîchir le dossier (sinon le message n'apparaît pas tout de suite)
        this.tokenService.getClientData(this.token).subscribe({
          next: data => {
            this.clientData = data;
            this.tokenService.saveClientData(data);
            this.dossier = data.dossiers.find(d => Number(d.idDossier) === Number(this.idDossier)) || null;
            this.messageSending = false;
          },
          error: () => {
            this.messageSending = false;
          }
        });
      },
      error: () => {
        this.messageSending = false;
      }
    });
  }
}