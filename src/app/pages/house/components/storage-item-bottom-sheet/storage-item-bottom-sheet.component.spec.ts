import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StorageItemBottomSheetComponent } from './storage-item-bottom-sheet.component';

describe('StorageItemBottomSheetComponent', () => {
  let component: StorageItemBottomSheetComponent;
  let fixture: ComponentFixture<StorageItemBottomSheetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageItemBottomSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageItemBottomSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
