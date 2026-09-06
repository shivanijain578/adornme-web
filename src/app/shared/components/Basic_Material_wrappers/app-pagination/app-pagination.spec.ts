import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppPagination } from './app-pagination';

describe('AppPagination', () => {
  let component: AppPagination;
  let fixture: ComponentFixture<AppPagination>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppPagination]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppPagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
