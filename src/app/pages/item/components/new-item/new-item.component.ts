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
import { NgxImageCompressService } from 'ngx-image-compress';

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
    private router: Router,
    private imageService: NgxImageCompressService
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
        (createItemResponse: any) => {
          if (this.photoControl.value) {
            let file: FileInput = this.photoControl.value;
            let f: File = file.files[0];
            let formData: FormData = new FormData();

            let compressedFileUrl, compressedFile;

            const uploadFile = new Promise((resolve) => {
              let reader: FileReader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result);
              };
              reader.readAsDataURL(f);
            });

            uploadFile.then((fileBase64) => {
              compressedFileUrl = fileBase64;

              this.imageService
                .compressFile(compressedFileUrl, -1)
                .then((result) => {
                  compressedFile = result;
                  //converting string to blob

                  const blob = this.base64ToBlob(compressedFile);

                  formData.append('image', blob, f.name);

                  this.itemService
                    .uploadItemPhoto(createItemResponse.id, formData)
                    .subscribe(
                      (data) => {
                        this.snackBarService.open(
                          createItemResponse.message + ' and ' + data.message,
                          null,
                          { duration: 1500 }
                        );
                        this.router.navigate(['/items']);
                      },
                      (error: HttpErrorResponse) => {
                        this.snackBarService.open(error.error.message, null, {
                          duration: 3000,
                        });
                      }
                    );
                });
            });
          } else {
            this.snackBarService.open(createItemResponse.message, null, {
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

  base64ToBlob(base64: string): Blob {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.split(',')[0].split(':')[1].split(';')[0];

    const ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    //write to blob
    const blob = new Blob([ia], { type: mimeType });

    return blob;
  }
}
