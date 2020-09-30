import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficodadosComponent } from './graficodados.component';

describe('GraficodadosComponent', () => {
  let component: GraficodadosComponent;
  let fixture: ComponentFixture<GraficodadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficodadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficodadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
