import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HouseEditComponent } from './house-edit.component';

describe('HouseEditComponent', () => {
  let component: HouseEditComponent;
  let fixture: ComponentFixture<HouseEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HouseEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HouseEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
