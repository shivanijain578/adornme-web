import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppImageUpload } from './app-image-upload';

describe('AppImageUpload', () => {
  let component: AppImageUpload;
  let fixture: ComponentFixture<AppImageUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppImageUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppImageUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
