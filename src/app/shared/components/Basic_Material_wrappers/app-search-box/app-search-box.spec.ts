import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppSearchBox } from './app-search-box';

describe('AppSearchBox', () => {
  let component: AppSearchBox;
  let fixture: ComponentFixture<AppSearchBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppSearchBox]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppSearchBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
