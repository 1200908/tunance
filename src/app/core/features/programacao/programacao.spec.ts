import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Programacao } from './programacao';

describe('Programacao', () => {
  let component: Programacao;
  let fixture: ComponentFixture<Programacao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Programacao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Programacao);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
