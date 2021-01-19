import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { HouseFullOutput } from 'src/app/models/house.model';
import { HouseService } from 'src/app/services/house.service';

@Component({
  selector: 'app-house-edit',
  templateUrl: './house-edit.component.html',
  styleUrls: ['./house-edit.component.scss'],
})
export class HouseEditComponent implements OnInit {
  houseEditForm: FormGroup;
  house: HouseFullOutput = new HouseFullOutput();

  constructor(
    private houseService: HouseService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: MatSnackBar
  ) {
    this.house._id = activatedRoute.snapshot.paramMap.get('id');

    this.houseEditForm = new FormGroup({
      name: new FormControl(null, [
        Validators.required,
        Validators.maxLength(30),
      ]),
      description: new FormControl(null, [Validators.maxLength(250)]),
    });
  }

  ngOnInit(): void {
    this.houseService.getHouse(this.house._id).subscribe((houseOutput) => {
      this.house = houseOutput;
      this.houseEditForm.patchValue({
        name: this.house.name,
        description: this.house.description,
      });
    });
  }

  onCancel(): void {
    this.router.navigate(['/houses', this.house._id]);
  }

  onAccept(): void {
    if (this.houseEditForm.invalid) {
      return;
    }

    this.houseService
      .putHouseInfo(this.house._id, {
        name: this.houseEditForm.value.name,
        description: this.houseEditForm.value.description,
      })
      .subscribe(
        (response) => {
          this.snackBarService.open(response.message, null, { duration: 1500 });
        },
        (error: HttpErrorResponse) => {
          this.snackBarService.open(error.error.message, null, {
            duration: 2000,
          });
        }
      );
  }
}
