import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HouseViewComponent } from './house-view.component';

describe('HouseViewComponent', () => {
  let component: HouseViewComponent;
  let fixture: ComponentFixture<HouseViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
