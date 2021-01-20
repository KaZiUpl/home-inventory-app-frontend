import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';
import { StorageItemFullOutput } from 'src/app/models/storage-item.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-storage-item-bottom-sheet',
  templateUrl: './storage-item-bottom-sheet.component.html',
  styleUrls: ['./storage-item-bottom-sheet.component.scss'],
})
export class StorageItemBottomSheetComponent implements OnInit {
  storageItem: StorageItemFullOutput;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { storageItem: StorageItemFullOutput },
    private sanitizer: DomSanitizer
  ) {
    this.storageItem = data.storageItem;
    if (this.storageItem.item.photo) {
      this.storageItem.item.photoSafe = this.sanitizer.bypassSecurityTrustUrl(
        `${environment.apiUrl}${this.storageItem.item.photo}`
      );
    }
  }

  ngOnInit(): void {}
}
