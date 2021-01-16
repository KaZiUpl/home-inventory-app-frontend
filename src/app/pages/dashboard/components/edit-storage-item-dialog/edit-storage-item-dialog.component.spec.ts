import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStorageItemDialogComponent } from './edit-storage-item-dialog.component';

describe('EditStorageItemDialogComponent', () => {
  let component: EditStorageItemDialogComponent;
  let fixture: ComponentFixture<EditStorageItemDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStorageItemDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStorageItemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
