import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppFilterPanel } from './app-filter-panel';

describe('AppFilterPanel', () => {
  let component: AppFilterPanel;
  let fixture: ComponentFixture<AppFilterPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppFilterPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppFilterPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
