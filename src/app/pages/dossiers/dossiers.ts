import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TokenService, ClientHistoriqueDto, DossierDto } from '../../services/token';


@Component({
  selector: 'app-dossiers',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dossiers.html',
  styleUrl: './dossiers.css',
    encapsulation: ViewEncapsulation.None
})
export class DossiersComponent implements OnInit {

  clientData: ClientHistoriqueDto | null = null;
  dossiers: DossierDto[] = [];
  token!: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token')!;
    this.clientData = this.tokenService.getClientDataFromSession();
    this.dossiers = this.clientData?.dossiers ?? [];
  }

  ouvrirDossier(idDossier: number): void {
    this.router.navigate(['/formulaire', this.token, idDossier]);
  }
}