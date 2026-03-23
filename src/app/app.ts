import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {ScrollProgressComponent} from './shared/scroll-progress/scroll-progress.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tunance');

}
