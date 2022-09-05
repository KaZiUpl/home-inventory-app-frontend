import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { UntypedFormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { FileInput } from 'ngx-material-file-input';
import { from } from 'rxjs';
import { NgxImageCompressService } from 'ngx-image-compress';

import { ItemService } from '../../../../services/item.service';
import { ItemFullOutput } from '../../../../models/item.model';
import { BarcodeDialogComponent } from '../../../../components/barcode-dialog/barcode-dialog.component';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  item: ItemFullOutput = new ItemFullOutput();
  itemForm: UntypedFormGroup;
  photoControl: UntypedFormControl = new UntypedFormControl();

  constructor(
    private itemService: ItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: MatSnackBar,
    private barcodeDialog: MatDialog,
    private sanitizer: DomSanitizer,
    private imageService: NgxImageCompressService
  ) {
    this.itemForm = new UntypedFormGroup({
      name: new UntypedFormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new UntypedFormControl(null, [Validators.maxLength(250)]),
      manufacturer: new UntypedFormControl(null, [Validators.maxLength(50)]),
      code: new UntypedFormControl(null, [Validators.maxLength(128)]),
      photo: new UntypedFormControl(null, []),
    });
    this.item._id = activatedRoute.snapshot.paramMap.get('id');

    itemService.getItem(this.item._id).subscribe(
      (item: ItemFullOutput) => {
        this.item = item;
        if (item.photo) {
          item.photoSafe = this.sanitizer.bypassSecurityTrustUrl(
            `${environment.apiUrl}${item.photo}`
          );
        }
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
                  .uploadItemPhoto(this.item._id, formData)
                  .subscribe(
                    (data) => {
                      this.snackBarService.open(
                        response.message + ' and ' + data.message,
                        null,
                        { duration: 1500 }
                      );
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
          this.snackBarService.open(response.message, null, { duration: 1500 });
        }
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
