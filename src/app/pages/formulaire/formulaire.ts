import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService, ClientHistoriqueDto, DossierDto } from '../../services/token';
import { RecouvrementService } from '../../services/recouvrement';

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

  actionsDisponibles = [
    { value: 'paiement_immediat', label: 'Paiement immédiat' },
    { value: 'promesse_paiement', label: 'Promesse de paiement' },
    { value: 'demande_echeance', label: 'Demande d\'échéancier' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private fb: FormBuilder,
    private recouvrementService: RecouvrementService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.idDossier = Number(this.route.snapshot.paramMap.get('idDossier'));
    this.clientData = this.tokenService.getClientDataFromSession();

    if (!this.clientData) {
      this.router.navigate(['/token-invalide']);
      return;
    }

    // Récupère le bon dossier depuis la liste
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
    datePaiementPrevue: this.form.value.datePaiementPrevue
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
  }
