import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';


@Component({
  selector: 'app-programacao',
  imports: [],
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


}
