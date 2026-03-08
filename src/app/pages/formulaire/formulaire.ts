import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TokenService, ClientHistoriqueDto } from '../../services/token';
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
  token!: string;
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
    this.clientData = this.tokenService.getClientDataFromSession();

    if (!this.clientData) {
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

  get idDossier(): number {
    return 0; // sera remplacé par la vraie valeur depuis clientData
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    const payload = {
      idDossier: 1, // à remplacer par le vrai idDossier
      typeIntention: this.form.value.typeIntention,
      commentaire: this.form.value.commentaire,
      datePaiementPrevue: this.form.value.datePaiementPrevue
    };

    this.recouvrementService.soumettreReponse(payload).subscribe({
      next: () => {
        this.tokenService.clearClientData();
        this.submitted = true;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}