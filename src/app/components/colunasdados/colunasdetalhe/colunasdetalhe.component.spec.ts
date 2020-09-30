import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColunasDetalheComponent } from './colunasdetalhe.component';

describe('ColunasDetalheComponent', () => {
  let component: ColunasDetalheComponent;
  let fixture: ComponentFixture<ColunasDetalheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColunasDetalheComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColunasDetalheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
