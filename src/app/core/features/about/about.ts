import { Component, OnInit, AfterViewInit, ElementRef, OnDestroy, HostListener } from '@angular/core';
import {ScrollRevealDirective} from '../../../shared/directives/scroll-reveal.directive';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [ScrollRevealDirective, CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class AboutComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(private elementRef: ElementRef) {}

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

  images: string[] = Array.from({ length: 12 }, (_, i) =>
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

  get maxIndex(): number {
    return Math.max(0, this.images.length - this.slidesPerView);
  }

  get dotsArray(): number[] {
    const totalDots = Math.ceil(this.images.length / this.slidesPerView);
    return Array.from({ length: totalDots });
  }

  get activeDot(): number {
    return Math.floor(this.currentIndex / this.slidesPerView);
  }

  ngOnInit(): void {
    this.updateSlidesPerView(window.innerWidth);
  }
  ngOnDestroy(): void {}
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

  openModal(event: MouseEvent, index: number): void {
    event.stopPropagation();
    this.modalCurrentIndex = index;
    this.modalImageSrc = this.images[index]; // <== aqui
    this.isModalOpen = true;
    const targetIndex = Math.floor(index / this.slidesPerView) * this.slidesPerView;
    this.currentIndex = Math.min(targetIndex, this.maxIndex);
  }

  prevModalImage(): void {
    if (!this.isModalOpen) return;
    this.modalCurrentIndex = (this.modalCurrentIndex - 1 + this.images.length) % this.images.length;
    this.modalImageSrc = this.images[this.modalCurrentIndex];
    this.syncCarouselToModal();
  }

  nextModalImage(): void {
    if (!this.isModalOpen) return;
    this.modalCurrentIndex = (this.modalCurrentIndex + 1) % this.images.length;
    this.modalImageSrc = this.images[this.modalCurrentIndex];
    this.syncCarouselToModal();
  }

  private syncCarouselToModal(): void {
    const targetIndex = Math.floor(this.modalCurrentIndex / this.slidesPerView) * this.slidesPerView;
    this.currentIndex = Math.min(targetIndex, this.maxIndex);
  }
  modalTouchStartX = 0;

  onModalTouchStart(e: TouchEvent) {
    this.modalTouchStartX = e.changedTouches[0].screenX;
  }

  onModalTouchEnd(e: TouchEvent) {
    const diff = this.modalTouchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) this.nextModalImage();
      else this.prevModalImage();
    }
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.modalImageSrc = '';
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
