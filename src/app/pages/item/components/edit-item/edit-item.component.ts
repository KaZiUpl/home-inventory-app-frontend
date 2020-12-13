import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ItemService } from '../../../../services/item.service';
import { ItemFullOutput } from '../../../../models/item.model';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  item: ItemFullOutput = new ItemFullOutput();
  itemForm: FormGroup;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: MatSnackBar
  ) {
    this.itemForm = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, []),
      manufacturer: new FormControl(null, []),
      code: new FormControl(null, []),
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
    let itemBody = {
      name: this.itemForm.value.name,
      description: this.itemForm.value.description,
      manufacturer: this.itemForm.value.manufacturer,
    };
    if (this.itemForm.value.ean != undefined) {
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
}
