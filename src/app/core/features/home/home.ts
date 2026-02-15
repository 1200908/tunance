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


}
