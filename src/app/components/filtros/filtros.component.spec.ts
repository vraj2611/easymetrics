import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosComponent } from './filtros.component';

describe('GraficodadosComponent', () => {
  let component: FiltrosComponent;
  let fixture: ComponentFixture<FiltrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
