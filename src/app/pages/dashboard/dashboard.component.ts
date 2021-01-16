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
    private snackBarService: MatSnackBar,
    private bottomSheet: MatBottomSheet,
    private dialog: MatDialog
  ) {
    this.houseService
      .getAllStorage()
      .subscribe((storage: StorageItemFullOutput[]) => {
        this.storageItems = storage;
        this.storageItemsDataSource.data = storage;
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
      });
  }

  ngOnInit(): void {
    this.searchControl.valueChanges.subscribe((value: string) => {
      this.storageItemsDataSource.data = this.storageItems.filter(
        (item) =>
          (item.item.ean && item.item.ean.includes(value)) ||
          item.item.name.includes(value)
      );
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

  onStorageItemMoreInfo(storageItem: StorageItemFullOutput): void {
    this.bottomSheet.open(StorageItemBottomSheetComponent, {
      data: { storageItem: storageItem },
    });
  }
  onStorageItemEdit(item: StorageItemFullOutput): void {}
  onStorageItemDelete(item: StorageItemFullOutput): void {}

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
