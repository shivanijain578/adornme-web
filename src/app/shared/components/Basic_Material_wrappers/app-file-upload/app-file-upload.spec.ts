import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFileUpload } from './app-file-upload';

describe('AppFileUpload', () => {
  let component: AppFileUpload;
  let fixture: ComponentFixture<AppFileUpload>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFileUpload]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFileUpload);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
