import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesDetailComponent } from './places-detail.component';

describe('PlacesDetailComponent', () => {
  let component: PlacesDetailComponent;
  let fixture: ComponentFixture<PlacesDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlacesDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlacesDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
