import {
  Component,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter,
  AfterViewInit,
  OnInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';

import { UntypedFormControl } from '@angular/forms';
import { Subscription, pipe } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-editable-cell',
  templateUrl: './editable-cell.component.html',
  styleUrls: ['./editable-cell.component.scss'],
})
export class EditableCellComponent implements AfterViewInit, OnInit, OnDestroy {
  show: boolean = false;
  control: UntypedFormControl;

  @ViewChild('input') input: ElementRef;

  @Input() quantity: any;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private cd: ChangeDetectorRef) {
    this.control = new UntypedFormControl();
  }
  ngOnInit(): void {
    this.control.patchValue(this.quantity);
  }
  ngAfterViewInit(): void {
    this.input.nativeElement.focus();
    this.cd.detectChanges();
  }
  ngOnDestroy(): void {}

  onEnter(): void {
    this.input.nativeElement.blur();
    this.valueChange.emit(this.control.value);
  }
}
