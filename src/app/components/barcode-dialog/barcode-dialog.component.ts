import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

import Quagga from 'quagga';

@Component({
  selector: 'app-barcode-dialog',
  templateUrl: './barcode-dialog.component.html',
  styleUrls: ['./barcode-dialog.component.scss'],
})
export class BarcodeDialogComponent implements OnInit {
  private lastScannedCode: string;
  private lastScannedCodeDate: number;
  private quaggaStatus: number;
  private torchStatus: boolean = false;

  constructor(public dialogRef: MatDialogRef<BarcodeDialogComponent>) {}

  ngOnInit(): void {
    this.dialogRef
      .keydownEvents()
      .pipe(filter((value) => value.key == 'Escape'))
      .subscribe((result) => {
        this.cancel();
      });

    this.dialogRef.backdropClick().subscribe((result) => {
      this.cancel();
    });

    if (
      !navigator.mediaDevices ||
      !(typeof navigator.mediaDevices.getUserMedia === 'function')
    ) {
      console.log('getUserMedia is not supported');
      return;
    }
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
}
