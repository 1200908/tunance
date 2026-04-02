import {Component, OnInit, AfterViewInit, ElementRef, OnDestroy, HostListener, ChangeDetectorRef} from '@angular/core';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';
import {CommonModule} from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import 'swiper/css';

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private elementRef: ElementRef, private cdr: ChangeDetectorRef, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    this.initCounterAnimation();
    this.recalculateSlideWidth();
    this.initTimelineAnimation();
  }

  private initCounterAnimation(): void {
    const observerOptions: IntersectionObserverInit = {
      threshold: 0.5,
      rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statItems = entry.target.querySelectorAll('.stat-item');

          statItems.forEach((item, index) => {
            const numberElement = item.querySelector('.stat-number') as HTMLElement;

            if (numberElement) {
              const target = parseInt(numberElement.getAttribute('data-target') || '0');
              const duration = parseInt(numberElement.getAttribute('data-duration') || '2000');

              if (!isNaN(target)) {
                setTimeout(() => {
                  this.animateCounter(numberElement, target, duration);
                }, index * 200);
              }
            }
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const statsSection = this.elementRef.nativeElement.querySelector('.stats');
    if (statsSection) {
      observer.observe(statsSection);
    }
  }

  private animateCounter(element: HTMLElement, target: number, duration: number): void {
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const current = Math.floor(progress * target);
      element.textContent = current.toLocaleString('pt-PT');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        element.textContent = (element.classList.contains('plus') ? '+' : '') + target.toLocaleString('pt-PT');
      }
    };

    requestAnimationFrame(step);
  }

  private initTimelineAnimation(): void {

    const observer = new IntersectionObserver((entries) => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        } else {
          entry.target.classList.remove('active');
        }

      });

    }, {
      threshold: 0.7
    });

    const elements = this.elementRef.nativeElement
      .querySelectorAll('.timeline-content');

    elements.forEach((el: Element) => {
      observer.observe(el);
    });

  }

  images: string[] = Array.from({ length: 13 }, (_, i) =>
    `assets/cartaz/cartaz_${i + 1}_tunance.jpg`
  );


  // Carrossel
  currentIndex = 0;
  slidesPerView = 4;
  slideWidth = 0; // calculado em runtime

  // Modal
  isModalOpen = false;
  modalImageSrc = '';
  modalCurrentIndex = 0;
  modalTouchStartY = 0;


  get maxIndex(): number {
    return Math.max(0, this.images.length - this.slidesPerView);
  }

  get dotsArray(): number[] {
    const totalDots = Math.ceil(this.images.length / this.slidesPerView);
    return Array.from({ length: totalDots });
  }

  get activeDot(): number {
    if (this.currentIndex >= this.maxIndex) {
      return this.dotsArray.length - 1;
    }
    return Math.floor(this.currentIndex / this.slidesPerView);
  }

  ngOnInit(): void {
    this.updateSlidesPerView(window.innerWidth);
  }
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const w = (event.target as Window).innerWidth;
    this.updateSlidesPerView(w);
    this.recalculateSlideWidth();
    // garante que o index não fique fora dos limites
    if (this.currentIndex > this.maxIndex) {
      this.currentIndex = this.maxIndex;
    }
  }
  onModalKeydown(e: KeyboardEvent) {
    if (!this.isModalOpen) return;
    if (e.key === 'ArrowRight') this.nextModalImage();
    if (e.key === 'ArrowLeft') this.prevModalImage();
    if (e.key === 'Escape') this.closeModal();
  }

  private updateSlidesPerView(width: number): void {
    if (width <= 600)       this.slidesPerView = 1; // 1 em mobile
    else if (width <= 900)  this.slidesPerView = 2; // 2 em tablet
    else                    this.slidesPerView = 4; // 4 no desktop
  }

  private recalculateSlideWidth(): void {
    const container = document.querySelector('.carousel-track-container') as HTMLElement;
    if (!container) return;
    const gap = 20;
    const totalGap = gap * (this.slidesPerView - 1);
    this.slideWidth = (container.offsetWidth - totalGap) / this.slidesPerView + gap;
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    }
  }

  goToSlide(dotIndex: number): void {
    this.currentIndex = Math.min(dotIndex * this.slidesPerView, this.maxIndex);
  }

  private swiper: any = null;

  openModal(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.modalCurrentIndex = index;
    this.modalImageSrc = this.images[index];
    this.isModalOpen = true;
    const targetIndex = Math.floor(index / this.slidesPerView) * this.slidesPerView;
    this.currentIndex = Math.min(targetIndex, this.maxIndex);
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
      keyboard: { enabled: true },
      slidesPerView: 1,
      spaceBetween: 50,
      on: {
        slideChange: () => {
          if (this.swiper) {
            this.modalCurrentIndex = this.swiper.realIndex;
            this.modalImageSrc = this.images[this.modalCurrentIndex];
            this.syncCarouselToModal();
            this.cdr.detectChanges();
          }
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

  ngOnDestroy(): void {
    if (this.swiper) this.swiper.destroy(true, true);
  }
  private syncCarouselToModal(): void {
    const targetIndex = Math.floor(this.modalCurrentIndex / this.slidesPerView) * this.slidesPerView;
    this.currentIndex = Math.min(targetIndex, this.maxIndex);
  }
  modalTouchStartX = 0;

  onModalTouchStart(e: TouchEvent) {
    this.modalTouchStartX = e.changedTouches[0].screenX;
    this.modalTouchStartY = e.changedTouches[0].screenY;
  }

  onModalTouchEnd(e: TouchEvent) {
    const diffX = this.modalTouchStartX - e.changedTouches[0].screenX;
    const diffY = this.modalTouchStartY - e.changedTouches[0].screenY;

    if (Math.abs(diffX) > 120 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0 && this.modalCurrentIndex < this.images.length - 1) {
        this.nextModalImage();
      } else if (diffX < 0 && this.modalCurrentIndex > 0) {
        this.prevModalImage();
      }
    }
  }

  private carouselTouchStartX = 0;
  carouselDragOffsetX = 0;
  isCarouselDragging = false;

  onCarouselTouchStart(event: TouchEvent): void {
    this.carouselTouchStartX = event.touches[0].clientX;
    this.isCarouselDragging = true;
    this.carouselDragOffsetX = 0;
  }

  onCarouselTouchMove(event: TouchEvent): void {
    if (!this.isCarouselDragging) return;
    this.carouselDragOffsetX = event.touches[0].clientX - this.carouselTouchStartX;
  }

  onCarouselTouchEnd(): void {
    this.isCarouselDragging = false;

    if (this.carouselDragOffsetX < -50) {
      this.nextSlide();
    } else if (this.carouselDragOffsetX > 50) {
      this.prevSlide();
    }

    this.carouselDragOffsetX = 0;
  }
}
