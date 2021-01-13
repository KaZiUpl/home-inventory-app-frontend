import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, pipe } from 'rxjs';
import { filter, startWith, map, tap } from 'rxjs/operators';
import { BarcodeDialogComponent } from 'src/app/components/barcode-dialog/barcode-dialog.component';
import { ItemFullOutput, ItemSimpleOutput } from 'src/app/models/item.model';
import {
  StorageItemFullOutput,
  StorageItemInput,
  StorageItemSimpleOutput,
} from 'src/app/models/room.model';
import { ItemService } from 'src/app/services/item.service';
import { RoomService } from 'src/app/services/room.service';

export class NoItemErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return (
      !!(
        control &&
        control.invalid &&
        (control.dirty || control.touched || isSubmitted)
      ) ||
      (control && control.touched && form.hasError('itemNotChoosen'))
    );
  }
}

@Component({
  selector: 'app-new-storage-item-dialog',
  templateUrl: './new-storage-item-dialog.component.html',
  styleUrls: ['./new-storage-item-dialog.component.scss'],
})
export class NewStorageItemDialogComponent implements OnInit {
  itemsList: ItemSimpleOutput[] = new Array<ItemSimpleOutput>();
  filteredItemList: Observable<ItemSimpleOutput[]>;
  formsReady: boolean = false;
  choosenItem: ItemSimpleOutput | null = null;
  @ViewChild('searchBar') searchBar: ElementRef;

  matcher: NoItemErrorStateMatcher = new NoItemErrorStateMatcher();

  itemForm: FormGroup = new FormGroup({
    item: new FormControl('', [Validators.required, this.itemNotChoosen]),
  });
  storageItemDetailsForm: FormGroup = new FormGroup({
    quantity: new FormControl(1, [Validators.required, Validators.min(1)]),
    description: new FormControl(null, []),
    expiration: new FormControl({ value: null, disabled: true }, []),
  });

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<NewStorageItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private data: { roomId: string },
    private snackBarService: MatSnackBar,
    private roomService: RoomService,
    private itemService: ItemService
  ) {
    //get items list
    this.itemService.getItemList().subscribe((items: ItemSimpleOutput[]) => {
      this.itemsList = items.sort((a, b) => (a.name > b.name ? 1 : -1));

      //set filtered items
      this.filteredItemList = this.itemForm.controls.item.valueChanges.pipe(
        tap((value) => console.log('value changed:', value, '=')),
        startWith(''),
        map((value) => {
          //change choosen item
          this.choosenItem = null;
          return typeof value === 'string' ? value : value.name;
        }),
        map((value) => {
          return value ? this._filterItems(value) : this.itemsList.slice();
        })
      );
    });
  }

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(filter((value) => value.key == 'Escape'))
      .subscribe((result) => {
        this.onCancel();
      });

    this.dialogRef.backdropClick().subscribe((result) => {
      this.onCancel();
    });
  }

  onCancel(): void {
    this.dialogRef.close(null);
  }

  onAccept(): void {
    let storageItemInfo = new StorageItemInput();
    storageItemInfo.item = this.choosenItem._id;
    storageItemInfo.quantity = this.storageItemDetailsForm.controls.quantity.value;
    storageItemInfo.description = this.storageItemDetailsForm.controls.description.value;
    storageItemInfo.expiration = Date.parse(
      this.storageItemDetailsForm.controls.expiration.value
    );
    if (isNaN(storageItemInfo.expiration)) {
      storageItemInfo.expiration = null;
    }

    //add new storage item
    this.roomService
      .createStorageItem(this.data.roomId, storageItemInfo)
      .subscribe(
        (response) => {
          //return newly created storage item
          let newStorageItem = new StorageItemFullOutput();
          newStorageItem._id = response.id;
          newStorageItem.quantity = storageItemInfo.quantity;
          newStorageItem.description = storageItemInfo.description;
          newStorageItem.expiration = new Date(
            storageItemInfo.expiration
          ).toISOString();
          newStorageItem.item = {
            _id: storageItemInfo.item,
            name: this.choosenItem.name,
          };

          //close dialog
          this.snackBarService.open(response.message, null, { duration: 1500 });
          this.dialogRef.close(newStorageItem);
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 2000,
          });
        }
      );
  }

  onSearchBarcode(): void {
    const dialogRef = this.dialog.open(BarcodeDialogComponent);

    dialogRef.afterClosed().subscribe((code: string) => {
      if (code) {
        // check items list for code
        const item = this.itemsList.filter(
          (item: ItemSimpleOutput) => item.ean && item.ean == code
        );
        if (item.length > 0) {
          this.itemForm.patchValue({ item: item[0] });
          this.choosenItem = item[0];
        } else {
          this.itemForm.controls.item.markAsDirty();
          this.itemForm.patchValue({ item: code });
          console.log(this.itemForm.value.item);

          this.snackBarService.open('No item with that code was found.', null, {
            duration: 2000,
          });
        }
      }
    });
  }

  displayFn(item: any): string {
    if (item == null) return '';
    return item && item.name ? item.name : item ? item : '';
  }

  _filterItems(value: string): ItemSimpleOutput[] {
    const filterValue = value.toLowerCase();

    return this.itemsList.filter((item) => {
      if (parseInt(filterValue) != NaN && item.ean) {
        return (
          item.name.toLowerCase().includes(filterValue) ||
          item.ean.includes(filterValue)
        );
      } else {
        return item.name.toLowerCase().includes(filterValue);
      }
    });
  }

  itemNotChoosen(control: FormControl) {
    return typeof control.value === 'string' ? { itemNotChoosen: true } : null;
  }

  onItemSelect(event: MatAutocompleteSelectedEvent): void {
    this.choosenItem = event.option.value;
    this.searchBar.nativeElement.blur();
  }

  areFormsValid(): boolean {
    return this.itemForm.valid && this.storageItemDetailsForm.valid;
  }
}
