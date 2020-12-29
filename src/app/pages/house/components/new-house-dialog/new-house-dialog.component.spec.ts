import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewHouseDialogComponent } from './new-house-dialog.component';

describe('NewHouseComponent', () => {
  let component: NewHouseDialogComponent;
  let fixture: ComponentFixture<NewHouseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewHouseDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewHouseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
