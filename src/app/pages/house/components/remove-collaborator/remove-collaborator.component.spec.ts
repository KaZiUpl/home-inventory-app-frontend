import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCollaboratorComponent } from './remove-collaborator.component';

describe('RemoveCollaboratorComponent', () => {
  let component: RemoveCollaboratorComponent;
  let fixture: ComponentFixture<RemoveCollaboratorComponent>;

  beforeEach(async(() => {
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
