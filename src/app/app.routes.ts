import { Routes } from '@angular/router';
import { FormulaireComponent } from './pages/formulaire/formulaire';
import { ConfirmationComponent } from './pages/confirmation/confirmation';
import { TokenInvalidecomponent } from './pages/token-invalide/token-invalide';
import { tokenGuard } from './guards/token-guard';

export const routes: Routes = [
  { 
    path: 'formulaire/:token', 
    component: FormulaireComponent,
    canActivate: [tokenGuard]
  },
  { 
    path: 'confirmation', 
    component: ConfirmationComponent 
  },
  { 
    path: 'token-invalide', 
    component: TokenInvalidecomponent
  },
  { 
    path: '**', 
    redirectTo: 'token-invalide' 
  }
];