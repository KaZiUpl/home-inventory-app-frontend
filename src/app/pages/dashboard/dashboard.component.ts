import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HouseService } from 'src/app/services/house.service';
import { StorageItemFullOutput } from 'src/app/models/room.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { StorageItemBottomSheetComponent } from './components/storage-item-bottom-sheet/storage-item-bottom-sheet.component';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { BarcodeDialogComponent } from 'src/app/components/barcode-dialog/barcode-dialog.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { AcceptDialogComponent } from 'src/app/components/accept-dialog/accept-dialog.component';
import { RoomService } from 'src/app/services/room.service';
import { EditStorageItemDialogComponent } from './components/edit-storage-item-dialog/edit-storage-item-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchControl: FormControl = new FormControl(null);
  storageItems: StorageItemFullOutput[] = new Array<StorageItemFullOutput>();
  storageItemsDataSource: MatTableDataSource<StorageItemFullOutput> = new MatTableDataSource<StorageItemFullOutput>();

  constructor(
    private houseService: HouseService,
    private roomService: RoomService,
    private snackBarService: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.houseService.getAllStorage().subscribe(
      (storage: StorageItemFullOutput[]) => {
        this.storageItems = storage;
        this.updateStorageItemsDataSource();

        this.storageItemsDataSource.paginator = this.paginator;
        this.storageItemsDataSource.sort = this.sort;
        this.storageItemsDataSource.sortingDataAccessor = (
          item,
          headerName
        ) => {
          switch (headerName) {
            case 'itemName':
              return item.item.name;
            case 'house':
              return item.house.name;
            default:
              return item[headerName];
          }
        };
      },
      (error: HttpErrorResponse) => {
        snackBarService.open(error.error.message, null, { duration: 2000 });
      }
    );
  }

  ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        value = value.toLowerCase();
        this.storageItemsDataSource.data = this.storageItems.filter(
          (item) =>
            (item.item.ean && item.item.ean.includes(value)) ||
            item.item.name.toLowerCase().includes(value)
        );
        if (value == '') {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: { search: null },
            queryParamsHandling: 'merge',
          });
        } else {
          this.router.navigate([], {
            relativeTo: this.activatedRoute,
            queryParams: {
              search: value,
            },
            queryParamsHandling: 'merge',
          });
        }
      });
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

  updateStorageItemsDataSource() {
    let search = this.activatedRoute.snapshot.queryParamMap.get('search');

    if (search) {
      //set form control value
      this.searchControl.patchValue(search);
      //filter items
      this.storageItemsDataSource.data = this.storageItems.filter(
        (item) =>
          (item.item.ean && item.item.ean.includes(search)) ||
          item.item.name.toLowerCase().includes(search)
      );
    } else {
      this.storageItemsDataSource.data = this.storageItems;
    }
  }

  onStorageItemMoreInfo(storageItem: StorageItemFullOutput): void {
    this.bottomSheet.open(StorageItemBottomSheetComponent, {
      data: { storageItem: storageItem },
    });
  }
  onStorageItemEdit(storageItem: StorageItemFullOutput): void {
    const dialogRef = this.dialog.open(EditStorageItemDialogComponent, {
      data: { storageItem: storageItem },
    });
  }

  onStorageItemDelete(storageItem: StorageItemFullOutput): void {
    const dialogRef = this.dialog.open(AcceptDialogComponent, {
      data: {
        title: 'Delete storage item?',
        content:
          'Do you really want to delete this storage item? This operation cannot be undone.',
      },
    });

    dialogRef.afterClosed().subscribe((response: boolean) => {
      if (response) {
        this.roomService
          .deleteStorageItem(storageItem.room._id, storageItem._id)
          .subscribe(
            (response) => {
              //update room storage
              this.storageItems = this.storageItems.filter(
                (item) => item._id != storageItem._id
              );
              //update data on storage table
              this.updateStorageItemsDataSource();
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

  onSearchBarcode(): void {
    const dialogRef = this.dialog.open(BarcodeDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.searchControl.patchValue(result);
      }
    });
  }

  onMenuClick(event): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
