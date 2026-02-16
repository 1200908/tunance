import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';


@Component({
  selector: 'app-programacao',
  imports: [ScrollRevealDirective],
  templateUrl: './programacao.html',
  styleUrl: './programacao.css',
})
export class ProgramacaoComponent {

  constructor(private router: Router) {}

  goToGuia() {
    this.router.navigate(['/guia-turistico']).then(() => {
      const el = document.querySelector('.guia-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToTunas() {
    this.router.navigate(['/programacao']).then(() => {
      // espera até a navegação terminar
      const el = document.querySelector('.tunas-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

}
