import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppDataGrid } from './app-data-grid';

describe('AppDataGrid', () => {
  let component: AppDataGrid;
  let fixture: ComponentFixture<AppDataGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppDataGrid]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppDataGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
