import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss'],
})
export class LoadingScreenComponent implements AfterViewInit, OnDestroy {
  isLoading: boolean = false;
  loadingSubscription: Subscription;
  debounceTime: number = 200;

  constructor(
    private loadingService: LoadingService,
    private elemRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.elemRef.nativeElement.style.display = 'none';

    this.loadingSubscription = this.loadingService.loadingStatus
      .pipe(debounceTime(this.debounceTime))
      .subscribe((status: boolean) => {
        this.elemRef.nativeElement.style.display = status ? 'block' : 'none';
        this.changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    this.loadingSubscription.unsubscribe();
  }
}
