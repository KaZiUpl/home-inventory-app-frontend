import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NewStorageItemDialogComponent } from './new-storage-item-dialog.component';

describe('NewStorageItemDialogComponent', () => {
  let component: NewStorageItemDialogComponent;
  let fixture: ComponentFixture<NewStorageItemDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [NewStorageItemDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewStorageItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
