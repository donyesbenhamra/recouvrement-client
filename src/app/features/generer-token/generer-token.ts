import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-generer-token',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './generer-token.html',
  styleUrls: ['./generer-token.css']
})
export class GenererTokenComponent {
  selectedClient = '';
  selectedCanal = 'E-mail';
  generatedLink = 'https://recouvrement.stbbank.tn/formulaire/d8f3a9e...';

  constructor(private router: Router, private toastService: ToastService) { }

  annuler() {
    this.router.navigate(['/relances']);
  }

  generer() {
    this.toastService.show("✅ Lien sécurisé généré et envoyé au client !", "success");
    setTimeout(() => {
      this.router.navigate(['/relances']);
    }, 1500);
  }
}
