import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout/main-layout';
import { HomeComponent } from './core/features/home/home';
import { AboutComponent } from './core/features/about/about';
import { ProgramacaoComponent } from './core/features/programacao/programacao';
import { GuiaTuristicoComponent } from './core/features/guia-turistico/guia-turistico';
import { ContactComponent } from './core/features/contact/contact';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'about', component: AboutComponent },
      { path: 'programacao', component: ProgramacaoComponent },
      { path: 'guia-turistico', component: GuiaTuristicoComponent },
      { path: 'contact', component: ContactComponent },
      { path: '**', redirectTo: '' }
    ]
  }
];
