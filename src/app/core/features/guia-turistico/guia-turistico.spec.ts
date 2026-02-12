import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuiaTuristico } from './guia-turistico';

describe('GuiaTuristico', () => {
  let component: GuiaTuristico;
  let fixture: ComponentFixture<GuiaTuristico>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GuiaTuristico]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuiaTuristico);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
