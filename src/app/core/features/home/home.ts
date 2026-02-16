import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit } from '@angular/core';
import {MainLayoutComponent} from '../../layout/main-layout/main-layout';
import {Router} from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  constructor(private router: Router, private elementRef: ElementRef) {
  }

  private countdownInterval: any;

  ngOnInit() {
    this.startCountdown();
    this.shuffleGallery();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.galleryObserver) {
      this.galleryObserver.disconnect();
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
      if (el) el.scrollIntoView({behavior: 'smooth'});
    });
  }

  goToProgramacao() {
    this.router.navigate(['/programacao']).then(() => {
      const el = document.querySelector('.programacao-hero');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    });
  }

  goToGuia() {
    this.router.navigate(['/guia-turistico']).then(() => {
      const el = document.querySelector('.guia-hero');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    });
  }

  goToContact() {
    this.router.navigate(['/contact']).then(() => {
      const el = document.querySelector('.contact-hero');
      if (el) el.scrollIntoView({behavior: 'smooth'});
    });
  }

  ngAfterViewInit(): void {
    this.initScrollAnimations();
    this.observeGalleryVisibility();

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
    }, {threshold: 0.1});

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

  allImages = [
    'assets/momento_tunance/momento_tunance_1.jpg',
    'assets/momento_tunance/momento_tunance_2.jpg',
    'assets/momento_tunance/momento_tunance_3.jpg',
    'assets/momento_tunance/momento_tunance_4.jpg',
    'assets/momento_tunance/momento_tunance_5.jpg',
    'assets/momento_tunance/momento_tunance_6.jpg',
    'assets/momento_tunance/momento_tunance_7.jpg',
    'assets/momento_tunance/momento_tunance_8.jpg',
    'assets/momento_tunance/momento_tunance_9.jpg',
    'assets/momento_tunance/momento_tunance_10.jpg',
    'assets/momento_tunance/momento_tunance_11.jpg',
    'assets/momento_tunance/momento_tunance_12.jpg',
    'assets/momento_tunance/momento_tunance_13.jpg',
    'assets/momento_tunance/momento_tunance_14.jpg',
    'assets/momento_tunance/momento_tunance_15.jpg',
    'assets/momento_tunance/momento_tunance_16.jpg',
    'assets/momento_tunance/momento_tunance_17.jpg',
    'assets/momento_tunance/momento_tunance_18.jpg',
    'assets/momento_tunance/momento_tunance_19.jpg',
    'assets/momento_tunance/momento_tunance_20.jpg',
    'assets/momento_tunance/momento_tunance_21.jpg',
    'assets/momento_tunance/momento_tunance_22.jpg',
    'assets/momento_tunance/momento_tunance_23.jpg',
    'assets/momento_tunance/momento_tunance_24.jpg',
    'assets/momento_tunance/momento_tunance_25.jpg',
    'assets/momento_tunance/momento_tunance_26.jpg',
    'assets/momento_tunance/momento_tunance_27.jpg'
  ];

  shuffledImages: string[] = [];
  private currentGroup = 0;
  private totalGroups = 5; // 4 fotos iniciais + 2 grupos de 3 = ajusta conforme necessário
  private galleryObserver?: IntersectionObserver;

  // ============================================
  // GALERIA COM EMBARALHAMENTO AUTOMÁTICO
  // ============================================

  private shuffleGallery() {
    // Embaralhar todas as imagens
    this.shuffledImages = [...this.allImages].sort(() => 0.5 - Math.random());
    this.currentGroup = 0;

    // Reset dos botões quando embaralha
    setTimeout(() => {
      const collapseBtn = document.getElementById('collapseBtn');
      if (collapseBtn) collapseBtn.classList.add('hidden');

      const showMoreBtn = document.getElementById('showMoreBtn');
      if (showMoreBtn) {
        showMoreBtn.classList.remove('disabled');
        showMoreBtn.innerHTML = '<span style="margin-right: 2px;">Ver Mais Fotos</span><span class="fa fa-plus"></span>';
      }
    }, 100);
  }

  private observeGalleryVisibility() {
    const gallery = this.elementRef.nativeElement.querySelector('.gallery');
    if (!gallery) return;

    this.galleryObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Quando a galeria SAI da vista, embaralha
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0) {
        }
      });
    }, {
      threshold: 0,
      rootMargin: '0px'
    });

    this.galleryObserver.observe(gallery);
  }

  showMorePhotos() {
    this.currentGroup++;

    // Selecionar fotos do grupo atual
    const photosToShow = this.elementRef.nativeElement.querySelectorAll(
      `.photo-grid img.hidden[data-group="${this.currentGroup}"]`
    );

    // ✨ Mostrar fotos com animação em cascata
    photosToShow.forEach((photo: HTMLElement, index: number) => {
      setTimeout(() => {
        photo.classList.remove('hidden');
        photo.classList.add('show');
      }, index * 80); // 80ms entre cada foto
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
    }, photosToShow.length * 80 + 100);
  }

  collapsePhotos() {
    // Reset do contador de grupos
    this.currentGroup = 0;

    // ✅ Esconder APENAS as fotos expandidas (grupos 1+)
    const expandedPhotos = this.elementRef.nativeElement.querySelectorAll('.photo-grid img[data-group]:not([data-group="0"])');
    expandedPhotos.forEach((photo: HTMLElement) => {
      if (photo.classList.contains('show')) {
        photo.classList.remove('show');
        photo.classList.add('hidden');
      }
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
      showMoreBtn.innerHTML = '<span style="margin-right: 2px;">Ver Mais Fotos</span><span class="fa fa-plus"></span>';
    }

    // Scroll suave para o topo da galeria
    const gallery = this.elementRef.nativeElement.querySelector('.gallery');
    if (gallery) {
      gallery.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }

  // Método auxiliar para obter o grupo da imagem
  getImageGroup(index: number): number {
    if (index < 4) return 0; // Primeiras 4 imagens (grupo 0 - sempre visíveis)
    return Math.ceil((index - 4) / 4); // Resto em grupos de 3
  }

  // Método auxiliar para saber se a imagem começa visível
  isInitiallyVisible(index: number): boolean {
    return index < 4; // Primeiras 4 fotos visíveis
  }


}
