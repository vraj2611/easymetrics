import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColunasComponent } from './colunas.component';

describe('ColunasdadosComponent', () => {
  let component: ColunasComponent;
  let fixture: ComponentFixture<ColunasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColunasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColunasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
