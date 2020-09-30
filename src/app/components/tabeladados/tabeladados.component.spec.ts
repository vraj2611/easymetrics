import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabeladadosComponent } from './tabeladados.component';

describe('TabeladadosComponent', () => {
  let component: TabeladadosComponent;
  let fixture: ComponentFixture<TabeladadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabeladadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabeladadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
