import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTextarea } from './app-textarea';

describe('AppTextarea', () => {
  let component: AppTextarea;
  let fixture: ComponentFixture<AppTextarea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppTextarea]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppTextarea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
