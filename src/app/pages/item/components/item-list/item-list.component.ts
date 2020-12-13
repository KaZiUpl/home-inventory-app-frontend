import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

import { ItemService } from '../../../../services/item.service';
import { ItemSimpleOutput } from '../../../../models/item.model';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent implements OnInit, OnDestroy {
  items: ItemSimpleOutput[];
  itemsDataSource: MatTableDataSource<ItemSimpleOutput>;
  searchValue: string;
  searchFieldSub: Subscription;
  searchForm: FormGroup;

  pageSizes = [10, 25, 50].sort();

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private itemService: ItemService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {
    this.searchForm = new FormGroup({
      search: new FormControl(null, []),
    });

    itemService.getItemList().subscribe(
      (items: ItemSimpleOutput[]) => {
        this.items = items;

        this.itemsDataSource = new MatTableDataSource(items);
        this.itemsDataSource.sort = this.sort;
        this.itemsDataSource.paginator = this.paginator;

        //check URL for paginator settings
        this.activatedRoute.queryParamMap.subscribe((params: any) => {
          //check for page number
          if (params.params.page) {
            this.itemsDataSource.paginator.pageIndex = params.params.page;
          }

          //check for page size
          if (params.params.page_size) {
            //check for page size in available page sizes
            if (
              this.pageSizes.filter((number) => {
                return number == params.params.page_size;
              }).length > 0
            ) {
              this.itemsDataSource.paginator.pageSize = params.params.page_size;
              // this.currentURLPageSize = params.params.page_size;
            } else {
              //reset paginator
              this.itemsDataSource.paginator.pageSize = this.pageSizes[0];
              //reset page
              this.router.navigate([], {
                relativeTo: this.activatedRoute,
                queryParams: {
                  page_size: this.itemsDataSource.paginator.pageSize,
                },
                queryParamsHandling: 'merge',
              });
            }
          }
          // check for search filter
          if (params.params.search) {
            this.itemsDataSource.filter = params.params.search;
            this.searchValue = params.params.search;
          } else this.itemsDataSource.filter = null;
        });
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, null, {
          duration: 3000,
        });
      }
    );
  }

  ngOnInit(): void {
    //request data from api
    this.searchFieldSub = this.searchForm.controls['search'].valueChanges
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((value: string) => {
        this.itemService.getItemList({ name: value }).subscribe(
          (response: any) => {
            this.itemsDataSource.data = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open(error.error.message, null, {
              duration: 3000,
            });
          }
        );
        this.searchValue = value;
      });
  }
  ngOnDestroy(): void {
    this.searchFieldSub.unsubscribe();
  }

  onPaginatorChange(event: PageEvent): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page_size: event.pageSize, page: event.pageIndex },
      queryParamsHandling: 'merge',
    });
  }

  onItemDelete(id: string): void {
    this.itemService.deleteItem(id).subscribe(
      (response: any) => {
        //delete item from datasource
        this.itemsDataSource.data = this.itemsDataSource.data.filter(
          (item) => item._id != id
        );
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(error.error.message, null, {
          duration: 3000,
        });
      }
    );
  }
}
