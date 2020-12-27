import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { ItemInput } from '../../../../models/item.model';
import { BarcodeDialogComponent } from '../../../../components/barcode-dialog/barcode-dialog.component';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html',
  styleUrls: ['./new-item.component.scss'],
})
export class NewItemComponent implements OnInit {
  itemForm: FormGroup;
  photoControl: FormControl = new FormControl();

  constructor(
    private itemService: ItemService,
    private snackBarService: MatSnackBar,
    private barcodeDialog: MatDialog,
    private router: Router
  ) {
    this.itemForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      manufacturer: new FormControl(null, []),
      code: new FormControl(null, []),
      photo: new FormControl(null, []),
    });
  }

  ngOnInit(): void {}

  onScanBarcode(): void {
    const dialogRef = this.barcodeDialog.open(BarcodeDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.itemForm.controls.code.patchValue(result);
      }
    });
  }

  onCancel(): void {}

  onSubmit(): void {
    if (this.itemForm.invalid) return;

    this.itemService
      .createItem({
        name: this.itemForm.value.name,
        description: this.itemForm.value.description,
        manufacturer: this.itemForm.value.manufacturer,
        ean: this.itemForm.value.code,
      })
      .subscribe(
        (response: any) => {
          this.snackBarService.open(response.message, null, { duration: 1500 });
          this.router.navigate(['/items']);
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.message, null, { duration: 2000 });
        }
      );
  }

  //TODO: finish photo upload
}
