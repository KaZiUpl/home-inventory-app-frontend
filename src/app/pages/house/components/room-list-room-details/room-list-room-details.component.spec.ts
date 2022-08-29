import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoomListRoomDetailsComponent } from './room-list-room-details.component';

describe('RoomListRoomDetailsComponent', () => {
  let component: RoomListRoomDetailsComponent;
  let fixture: ComponentFixture<RoomListRoomDetailsComponent>;

  beforeEach(waitForAsync(() => {
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
