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
  fileForm: FormGroup;

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

    this.fileForm = new FormGroup({
      file: new FormControl(null, [Validators.required]),
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

  readFromFile(): void {
    if (this.fileForm.invalid) return;

    let fileInput: FileInput = this.fileForm.value.file;

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
      Quagga.decodeSingle(
        {
          readers: ['ean_reader'],
          locate: true, // try to locate the barcode in the image
          src: data,
        },
        function (result) {
          console.log(result);
        }
      );
    });
  }
}
