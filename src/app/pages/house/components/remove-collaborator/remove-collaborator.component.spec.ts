import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RemoveCollaboratorComponent } from './remove-collaborator.component';

describe('RemoveCollaboratorComponent', () => {
  let component: RemoveCollaboratorComponent;
  let fixture: ComponentFixture<RemoveCollaboratorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCollaboratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCollaboratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
