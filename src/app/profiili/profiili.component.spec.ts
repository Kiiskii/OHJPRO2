import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfiiliComponent } from './profiili.component';

describe('ProfiiliComponent', () => {
  let component: ProfiiliComponent;
  let fixture: ComponentFixture<ProfiiliComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfiiliComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfiiliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
