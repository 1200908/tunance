import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import {MainLayoutComponent} from '../../layout/main-layout/main-layout';
import {Router} from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit  {

  constructor(private router: Router, private elementRef: ElementRef) {}

  private countdownInterval: any;

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    // Data do evento - 15 de Março de 2026
    const eventDate = new Date('2026-04-10T20:00:00').getTime();

    this.countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const distance = eventDate - now;

      // Calcular dias, horas, minutos e segundos
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Atualizar os elementos
      const daysEl = document.getElementById('days');
      const hoursEl = document.getElementById('hours');
      const minutesEl = document.getElementById('minutes');
      const secondsEl = document.getElementById('seconds');

      if (daysEl) daysEl.textContent = days.toString();
      if (hoursEl) hoursEl.textContent = hours.toString();
      if (minutesEl) minutesEl.textContent = minutes.toString();
      if (secondsEl) secondsEl.textContent = seconds.toString();

      // Se o countdown terminou
      if (distance < 0) {
        clearInterval(this.countdownInterval);
        if (daysEl) daysEl.textContent = '0';
        if (hoursEl) hoursEl.textContent = '0';
        if (minutesEl) minutesEl.textContent = '0';
        if (secondsEl) secondsEl.textContent = '0';
      }
    }, 1000);
  }

  goToAbout() {
    this.router.navigate(['/about']).then(() => {
      const el = document.querySelector('.about-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToProgramacao() {
    this.router.navigate(['/programacao']).then(() => {
      const el = document.querySelector('.programacao-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToGuia() {
    this.router.navigate(['/guia-turistico']).then(() => {
      const el = document.querySelector('.guia-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  goToContact() {
    this.router.navigate(['/contact']).then(() => {
      const el = document.querySelector('.contact-hero');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
  }
  private initScrollAnimations(): void {
    const elements = this.elementRef.nativeElement.querySelectorAll('.hidden');

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target); // anima apenas uma vez
        }
      });
    }, { threshold: 0.1 });

    elements.forEach((el: any, index: number) => {
      // delay escalonado opcional
      setTimeout(() => observer.observe(el), index * 150);
    });
  }

  openModal(event: any) {
    const modal = this.elementRef.nativeElement.querySelector('#modal');
    const modalImg = this.elementRef.nativeElement.querySelector('#modal-img');
    modal.style.display = 'flex';
    modalImg.src = event.target.src;
  }

  closeModal() {
    const modal = this.elementRef.nativeElement.querySelector('#modal');
    modal.style.display = 'none';
  }
  private currentGroup = 0; // Controla qual grupo está sendo mostrado
  private totalGroups = 4; // Ajuste conforme o número de grupos que tem

  showMorePhotos() {
    this.currentGroup++;

    // Selecionar fotos do grupo atual
    const photosToShow = document.querySelectorAll(
      `.photo-grid img.hidden[data-group="${this.currentGroup}"]`
    );

    // Mostrar fotos com animação em cascata
    photosToShow.forEach((photo, index) => {
      setTimeout(() => {
        photo.classList.remove('hidden');
        photo.classList.add('show');
      }, index * 50);
    });

    // Mostrar o botão "Recolher" após primeira expansão
    const collapseBtn = document.getElementById('collapseBtn');
    if (collapseBtn && collapseBtn.classList.contains('hidden')) {
      setTimeout(() => {
        collapseBtn.classList.remove('hidden');
        collapseBtn.style.animation = 'fadeInUp 0.5s ease forwards';
      }, 300);
    }

    // Se mostrou todas as fotos, desabilitar o botão "Ver Mais"
    if (this.currentGroup >= this.totalGroups) {
      const showMoreBtn = document.getElementById('showMoreBtn');
      if (showMoreBtn) {
        showMoreBtn.classList.add('disabled');
        showMoreBtn.textContent = 'Todas as fotos visíveis';
      }
    }

    // Scroll suave para as novas fotos
    setTimeout(() => {
      if (photosToShow.length > 0) {
        photosToShow[0].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        });
      }
    }, 300);
  }

  // NOVO MÉTODO: Recolher todas as fotos
  collapsePhotos() {
    // Reset do contador de grupos
    this.currentGroup = 0;

    // Esconder todas as fotos expandidas
    const expandedPhotos = document.querySelectorAll('.photo-grid img.show');
    expandedPhotos.forEach((photo) => {
      photo.classList.remove('show');
      photo.classList.add('hidden');
    });

    // Esconder o botão "Recolher"
    const collapseBtn = document.getElementById('collapseBtn');
    if (collapseBtn) {
      collapseBtn.classList.add('hidden');
    }

    // Re-ativar o botão "Ver Mais"
    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      showMoreBtn.classList.remove('disabled');
      // Restaurar o conteúdo original do botão se foi alterado
      showMoreBtn.innerHTML = '<span style="margin-right: 2px; ">Ver Mais Fotos</span><span class="fa fa-plus" ></span>';
    }

    // Scroll suave para o topo da galeria
    const gallery = document.querySelector('.gallery');
    if (gallery) {
      gallery.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

}
