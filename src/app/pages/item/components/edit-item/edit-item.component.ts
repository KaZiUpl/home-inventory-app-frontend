import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { from } from 'rxjs';

import { ItemService } from '../../../../services/item.service';
import { ItemFullOutput } from '../../../../models/item.model';
import { BarcodeDialogComponent } from '../../../../components/barcode-dialog/barcode-dialog.component';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  item: ItemFullOutput = new ItemFullOutput();
  itemForm: FormGroup;
  photoControl: FormControl = new FormControl();

  constructor(
    private itemService: ItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: MatSnackBar,
    private barcodeDialog: MatDialog
  ) {
    this.itemForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      manufacturer: new FormControl(null, []),
      code: new FormControl(null, []),
      photo: new FormControl(null, []),
    });
    this.item._id = activatedRoute.snapshot.paramMap.get('id');

    itemService.getItem(this.item._id).subscribe(
      (item: ItemFullOutput) => {
        this.item = item;
        this.itemForm.patchValue({
          name: this.item.name,
          description: this.item.description,
          manufacturer: this.item.manufacturer,
          code: this.item.ean,
        });
      },
      (error: HttpErrorResponse) => {
        snackBarService.open(error.error.message, null, {
          duration: 3000,
        });
        this.router.navigate(['/items']);
      }
    );
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.router.navigate(['/items']);
  }

  onSubmit(): void {
    if (this.itemForm.invalid) return;

    let itemBody = {
      name: this.itemForm.value.name,
      description: this.itemForm.value.description,
      manufacturer: this.itemForm.value.manufacturer,
    };
    if (this.itemForm.value.code != undefined) {
      itemBody['ean'] = this.itemForm.value.code;
    }

    this.itemService.putItem(this.item._id, itemBody).subscribe(
      (response) => {
        this.snackBarService.open(response.message, null, {
          duration: 3000,
        });
      },
      (error: HttpErrorResponse) => {
        this.snackBarService.open(error.error.message, null, {
          duration: 3000,
        });
      }
    );
  }

  onScanBarcode(): void {
    const dialogRef = this.barcodeDialog.open(BarcodeDialogComponent);

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.itemForm.controls.code.patchValue(result);
      }
    });
  }

  // TODO: Finish photo upload (send request)
  onPhotoAdd(): void {
    if (this.photoControl.invalid) return;

    let fileInput: FileInput = this.photoControl.value;

    let base = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(fileInput.files[0]);
      reader.onload = function () {
        resolve(reader.result);
      };
      reader.onerror = function () {
        reject(reader.error);
      };
    });

    from(base).subscribe((data) => {
      console.log(data);
    });
  }
}
