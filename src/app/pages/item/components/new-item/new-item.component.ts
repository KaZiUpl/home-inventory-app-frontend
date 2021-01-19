import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { ItemService } from '../../../../services/item.service';
import { ItemInput } from '../../../../models/item.model';
import { BarcodeDialogComponent } from '../../../../components/barcode-dialog/barcode-dialog.component';
import { FileInput } from 'ngx-material-file-input';

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
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new FormControl(null, [Validators.maxLength(250)]),
      manufacturer: new FormControl(null, [Validators.maxLength(50)]),
      code: new FormControl(null, [Validators.maxLength(128)]),
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

  onCancel(): void {
    this.router.navigate(['/items']);
  }

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
          if (this.photoControl.value) {
            console.log('asd');

            let file: FileInput = this.photoControl.value;
            let f: File = file.files[0];
            let formData: FormData = new FormData();
            formData.append('image', f, f.name);

            this.itemService.uploadItemPhoto(response.id, formData).subscribe(
              (data) => {
                this.snackBarService.open(response.message, null, {
                  duration: 1500,
                });
                this.router.navigate(['/items']);
              },
              (error: HttpErrorResponse) => {
                this.snackBarService.open(error.error.message, null, {
                  duration: 3000,
                });
              }
            );
          } else {
            this.snackBarService.open(response.message, null, {
              duration: 1500,
            });
            this.router.navigate(['/items']);
          }
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 3000,
          });
        }
      );
  }
}
