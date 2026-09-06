import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppRadio } from './app-radio';

describe('AppRadio', () => {
  let component: AppRadio;
  let fixture: ComponentFixture<AppRadio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRadio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppRadio);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
