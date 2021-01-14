import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomListRoomDetailsComponent } from './room-list-room-details.component';

describe('RoomListRoomDetailsComponent', () => {
  let component: RoomListRoomDetailsComponent;
  let fixture: ComponentFixture<RoomListRoomDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomListRoomDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomListRoomDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
