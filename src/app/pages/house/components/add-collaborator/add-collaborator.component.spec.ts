import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddCollaboratorComponent } from './add-collaborator.component';

describe('AddCollaboratorComponent', () => {
  let component: AddCollaboratorComponent;
  let fixture: ComponentFixture<AddCollaboratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
