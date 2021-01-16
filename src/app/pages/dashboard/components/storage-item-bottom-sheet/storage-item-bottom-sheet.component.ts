import { Component, Inject, OnInit } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { StorageItemFullOutput } from 'src/app/models/room.model';

@Component({
  selector: 'app-storage-item-bottom-sheet',
  templateUrl: './storage-item-bottom-sheet.component.html',
  styleUrls: ['./storage-item-bottom-sheet.component.scss'],
})
export class StorageItemBottomSheetComponent implements OnInit {
  storageItem: StorageItemFullOutput;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { storageItem: StorageItemFullOutput }
  ) {
    this.storageItem = data.storageItem;
  }

  ngOnInit(): void {}
}
