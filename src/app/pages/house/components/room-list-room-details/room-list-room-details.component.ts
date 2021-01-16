import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AcceptDialogComponent } from 'src/app/components/accept-dialog/accept-dialog.component';
import {
  RoomFullOutput,
  StorageItemFullOutput,
} from 'src/app/models/room.model';
import { RoomService } from 'src/app/services/room.service';
import { EditStorageItemDialogComponent } from '../edit-storage-item-dialog/edit-storage-item-dialog.component';
import { NewStorageItemDialogComponent } from '../new-storage-item-dialog/new-storage-item-dialog.component';
import { StorageItemBottomSheetComponent } from '../storage-item-bottom-sheet/storage-item-bottom-sheet.component';

@Component({
  selector: 'app-room-list-room-details',
  templateUrl: './room-list-room-details.component.html',
  styleUrls: ['./room-list-room-details.component.scss'],
})
export class RoomListRoomDetailsComponent implements OnInit, AfterViewInit {
  @Input('room') room: RoomFullOutput;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  roomStorageDataSource: MatTableDataSource<StorageItemFullOutput> = new MatTableDataSource<StorageItemFullOutput>();
  focusedStorageItem: any | null;

  constructor(
    private dialog: MatDialog,
    private roomService: RoomService,
    private snackBarService: MatSnackBar,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.roomStorageDataSource.data = this.room.storage;
  }
  ngAfterViewInit(): void {
    this.roomStorageDataSource.sort = this.sort;
    this.roomStorageDataSource.paginator = this.paginator;
    this.roomStorageDataSource.sortingDataAccessor = (item, headerName) => {
      switch (headerName) {
        case 'itemName':
          return item.item.name;
        default:
          return item[headerName];
      }
    };
  }

  isExpired(storageItem: StorageItemFullOutput): boolean {
    if (!storageItem.expiration) {
      return false;
    }

    let today = new Date();

    return today > new Date(storageItem.expiration);
  }

  isNearlyExpired(storageItem: StorageItemFullOutput): boolean {
    if (!storageItem.expiration) {
      return false;
    }
    // get UTC timestmap
    let todayTimstamp = Date.now();
    let expirationTimestamp = Date.parse(storageItem.expiration);

    let diffTimeSeconds = (expirationTimestamp - todayTimstamp) / 1000;

    let diffTimeDays = diffTimeSeconds / (60 * 60 * 24);

    return diffTimeDays <= 7 && diffTimeDays > 0;
  }

  quantityFocusOn(storageItem): void {
    if (!this.focusedStorageItem) {
      this.focusedStorageItem = storageItem;
    }
  }
  quantityFocusOut(storageItem): void {
    this.focusedStorageItem = null;
  }

  onQuantityChange(room, storageItem: StorageItemFullOutput, event): void {
    this.roomService
      .updateStorageItem(room._id, storageItem._id, {
        description: storageItem.description,
        quantity: event,
        expiration: Date.parse(storageItem.expiration),
      })
      .subscribe(
        (response) => {
          storageItem.quantity = event;
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 1500,
          });
        }
      );
  }

  onAddStorageItemClicked(room): void {
    let dialogRef = this.dialog.open(NewStorageItemDialogComponent, {
      data: { roomId: room._id },
    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        room.storage.push(response);
        this.roomStorageDataSource.data = this.room.storage;
      }
    });
  }

  onStorageItemDelete(
    room: RoomFullOutput,
    storageItem: StorageItemFullOutput
  ): void {
    let dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        title: 'Delete storage item?',
        content:
          'Do you really want to delete this storage item? This operation cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.roomService.deleteStorageItem(room._id, storageItem._id).subscribe(
          (response) => {
            //update room storage
            room.storage = room.storage.filter(
              (item) => item._id != storageItem._id
            );
            //update data on storage table
            this.roomStorageDataSource.data = this.room.storage;
          },
          (error: HttpErrorResponse) => {
            this.snackBarService.open(error.error.message, null, {
              duration: 2000,
            });
          }
        );
      }
    });
  }

  onStorageItemMoreInfo(
    room: RoomFullOutput,
    storageItem: StorageItemFullOutput
  ): void {
    this.bottomSheet.open(StorageItemBottomSheetComponent, {
      data: { storageItem: storageItem },
    });
  }

  onStorageItemEdit(
    room: RoomFullOutput,
    storageItem: StorageItemFullOutput
  ): void {
    const dialogRef = this.dialog.open(EditStorageItemDialogComponent, {
      data: { roomId: room._id, storageItem: storageItem },
    });
  }
}
