import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, PLATFORM_ID, Inject, ViewChild, HostListener, ChangeDetectorRef, NgZone} from '@angular/core';
import {MainLayoutComponent} from '../../layout/main-layout/main-layout';
import {Router} from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import Typed from 'typed.js';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';
import 'swiper/css';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {

  currentRoute: string = '';

  constructor(private router: Router, private ngZone: NgZone, private cdr: ChangeDetectorRef, private elementRef: ElementRef, @Inject(PLATFORM_ID) private platformId: Object) {
  }

  private countdownInterval: any;

  ngOnInit() {
    this.startCountdown();
    this.shuffleGallery();
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
    this.router.navigate(['/sobre']).then(() => {
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
    this.initTyped();

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

  // Modal
  private swiper: any = null;

  isModalOpen = false;
  modalImageSrc = '';
  modalCurrentIndex = 0;
  modalTouchStartX = 0;
  modalTouchStartY = 0;

  openModal(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.modalCurrentIndex = index;
    this.modalImageSrc = this.shuffledImages[index];
    this.isModalOpen = true;
    setTimeout(() => this.initSwiper(index), 50);
  }

  async initSwiper(index: number) {
    if (!isPlatformBrowser(this.platformId)) return;
    const { default: Swiper } = await import('swiper');
    const { Keyboard, A11y } = await import('swiper/modules');
    this.swiper = new Swiper('.modal .swiper-container', {
      modules: [Keyboard, A11y],
      initialSlide: index,
      loop: false,
      autoHeight: true,
      keyboard: { enabled: true },
      slidesPerView: 1,
      spaceBetween: 50,
      on: {
        slideChange: () => {
          this.ngZone.run(() => {           // ← isto força o Angular a detetar
            if (this.swiper) {
              this.modalCurrentIndex = this.swiper.activeIndex;
              this.modalImageSrc = this.shuffledImages[this.modalCurrentIndex];
              this.cdr.detectChanges();
            }
          });
        }
      }
    });
  }

  prevModalImage(): void {
    this.swiper ? this.swiper.slidePrev() : null;
  }

  nextModalImage(): void {
    this.swiper ? this.swiper.slideNext() : null;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalImageSrc = '';
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
  }

  ngOnDestroy() {
    if (this.swiper) this.swiper.destroy(true, true);
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    if (this.galleryObserver) {
      this.galleryObserver.disconnect();
    }
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.galleryObserver) this.galleryObserver.disconnect();
  }

  onModalTouchStart(e: TouchEvent) {
    this.modalTouchStartX = e.changedTouches[0].screenX;
    this.modalTouchStartY = e.changedTouches[0].screenY;
  }

  onModalTouchEnd(e: TouchEvent) {
    const diffX = this.modalTouchStartX - e.changedTouches[0].screenX;
    const diffY = this.modalTouchStartY - e.changedTouches[0].screenY;

    if (Math.abs(diffX) > 120 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && this.modalCurrentIndex < this.shuffledImages.length - 1) {
        this.nextModalImage();
      } else if (diffX < 0 && this.modalCurrentIndex > 0) {
        this.prevModalImage();
      }
    }
  }

  @HostListener('document:keydown', ['$event'])
  onModalKeydown(e: KeyboardEvent): void {
    if (!this.isModalOpen) return;
    if (e.key === 'ArrowRight') this.nextModalImage();
    if (e.key === 'ArrowLeft') this.prevModalImage();
    if (e.key === 'Escape') this.closeModal();
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
    'assets/momento_tunance/momento_tunance_27.jpg',
    'assets/momento_tunance/momento_tunance_28.jpg',
    'assets/momento_tunance/momento_tunance_29.jpg',
    'assets/momento_tunance/momento_tunance_30.jpg',
    'assets/momento_tunance/momento_tunance_31.jpg',
    'assets/momento_tunance/momento_tunance_32.jpg',
    'assets/momento_tunance/momento_tunance_33.jpg'
  ];

  shuffledImages: string[] = [];
  private currentGroup = 0;
  private totalGroups = 1; // 4 fotos iniciais + 2 grupos de 3 = ajusta conforme necessário
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
    if (index < 8) return 0; // Primeiras 4 imagens (grupo 0 - sempre visíveis)
    return Math.ceil((index - 8) / 8); // Resto em grupos de 3
  }

  // Método auxiliar para saber se a imagem começa visível
  isInitiallyVisible(index: number): boolean {
    return index < 8; // Primeiras 4 fotos visíveis
  }

  @ViewChild('typedElement') typedElement?: ElementRef;

  typed?: Typed;

  initTyped(): void {
    if (isPlatformBrowser(this.platformId) && this.typedElement) {
      const element = this.typedElement.nativeElement;
      setTimeout(() => {
        this.typed = new Typed(element, {
          strings: [
            'Esepus tunae',
            'TauLF',
            'TaipaM',
            '',
            ''
          ],
          typeSpeed: 50,
          backSpeed: 30,
          backDelay: 1500,
          loop: true,
          showCursor: true,
          smartBackspace: false
        });
      }, 50);
    }
  }

}
