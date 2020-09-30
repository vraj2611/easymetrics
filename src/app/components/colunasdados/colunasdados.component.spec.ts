import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColunasdadosComponent } from './colunasdados.component';

describe('ColunasdadosComponent', () => {
  let component: ColunasdadosComponent;
  let fixture: ComponentFixture<ColunasdadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColunasdadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColunasdadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
