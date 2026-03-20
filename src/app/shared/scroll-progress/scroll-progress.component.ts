import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-progress',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .scroll-progress-btn {
      position: fixed !important;
      bottom: 28px;
      right: 28px;
      width: 48px;
      height: 48px;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(102, 126, 234, 0.15);
      backdrop-filter: blur(8px);
      border-radius: 50%;
    }

    .scroll-progress-btn svg {
      position: absolute;
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }

    .track {
      fill: none;
      stroke: rgba(102, 126, 234, 0.2);
      stroke-width: 2;
    }

    .progress {
      fill: none;
      stroke: #292e38;
      stroke-width: 2.5;
      stroke-dasharray: 94.2;
      stroke-linecap: round;
      transition: stroke-dashoffset 0.1s linear;
    }

    .scroll-progress-btn i {
      font-size: 0.85rem;
      color: #292e38;
      position: relative;
      z-index: 1;
    }

    .scroll-progress-btn:hover .progress {
      stroke: #5b78a6;
    }
  `],
  template: `
    <div class="scroll-progress-btn" (click)="scrollToTop()" *ngIf="visible">
      <svg viewBox="0 0 36 36">
        <circle class="track" cx="18" cy="18" r="15"/>
        <circle class="progress" cx="18" cy="18" r="15"
          [style.stroke-dashoffset]="dashOffset"/>
      </svg>
      <i class="fa fa-chevron-up"></i>
    </div>
  `
})
export class ScrollProgressComponent implements OnInit, OnDestroy {
  visible = false;
  dashOffset = 94.2;
  private onScroll!: () => void;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;

      this.visible = scrollTop > 200;
      this.dashOffset = 94.2 * (1 - progress);
    };

    window.addEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('scroll', this.onScroll);
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
