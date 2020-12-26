import { Component, AfterViewInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { pipe, from } from 'rxjs';
import { filter } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileInput } from 'ngx-material-file-input';

import Quagga from 'quagga';

@Component({
  selector: 'app-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.scss'],
})
export class BarcodeDialogComponent implements AfterViewInit {
  private lastScannedCode: string;
  private lastScannedCodeDate: number;
  quaggaStatus: number = 1;
  private torchStatus: boolean = false;
  barcodeForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<BarcodeDialogComponent>,
    private snackBarService: MatSnackBar
  ) {}

  ngAfterViewInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(filter((value) => value.key == 'Escape'))
      .subscribe((result) => {
        this.cancel();
      });

    this.dialogRef.backdropClick().subscribe((result) => {
      this.cancel();
    });

    this.barcodeForm = new FormGroup({
      barcode: new FormControl(null, [Validators.required]),
    });

    if (
      !navigator.mediaDevices ||
      !(typeof navigator.mediaDevices.getUserMedia === 'function')
    ) {
      console.log('getUserMedia is not supported');
      this.quaggaStatus = -1;
      return;
    } else {
      this.quaggaInitVideo();
    }
  }

  quaggaInitVideo(): void {
    Quagga.init(
      {
        inputStream: {
          constraints: {
            facingMode: 'environment',
          },
          area: {
            // defines rectangle of the detection/localization area
            top: '22%', // top offset
            bottom: '22%', // bottom offset
          },
          target: document.querySelector('#barcode-scanner'),
        },

        decoder: {
          readers: ['ean_reader'],
        },
      },
      (err) => {
        if (err) {
          alert(err.message);
          this.quaggaStatus = -1;
        } else {
          Quagga.start();
          this.quaggaStatus = 1;
          Quagga.onDetected((res) => {
            this.accept(res.codeResult.code);
          });
        }
      }
    );
  }

  cancel(): void {
    if (this.quaggaStatus == 1) {
      Quagga.stop();
    }
    this.dialogRef.close();
  }

  accept(code: any): void {
    if (this.quaggaStatus == 1) {
      Quagga.stop();
    }
    this.dialogRef.close(code);
  }

  torchToggle(event) {
    this.torchStatus = event.checked;
    const track = Quagga.CameraAccess.getActiveTrack();
    if (track && typeof track.getCapabilities === 'function') {
      track.applyConstraints({ advanced: [{ torch: this.torchStatus }] });
    }
  }

  addBarcode():void  {
    if(this.barcodeForm.invalid) return;

    //test if input contains only digits
    if(!new RegExp('[0-9]+').test(this.barcodeForm.value.barcode)) {
      this.barcodeForm.controls.barcode.setErrors({pattern: true});
      return;
    }

    this.accept(this.barcodeForm.value.barcode);
  }
}
