import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewStorageItemDialogComponent } from './new-storage-item-dialog.component';

describe('NewStorageItemDialogComponent', () => {
  let component: NewStorageItemDialogComponent;
  let fixture: ComponentFixture<NewStorageItemDialogComponent>;

  beforeEach(async(() => {
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
