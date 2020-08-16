import { Directive, OnDestroy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { OnInit, Input } from '@angular/core';
import { takeUntil, map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Directive({
  selector: '[permanentAt]',
})
export class ResponsiveSidenavDirective implements OnInit, OnDestroy {
  @Input() permanentAt: number;

  destroy = new Subject();

  constructor(
    private breakpoint: BreakpointObserver,
    private sidenav: MatSidenav
  ) {}

  ngOnInit(): void {
    // wait for matching width
    const match = this.breakpoint
      .observe(`(min-width: ${this.permanentAt}px)`)
      .pipe(
        takeUntil(this.destroy),
        map(({ matches }) => matches)
      );

    // open or close sidenav based on screen width
    match.subscribe((match) => {
      this.sidenav.opened = match;
      this.sidenav.mode = match ? 'side' : 'over';
    });
  }

  ngOnDestroy(): void {
    this.destroy.next();
    this.destroy.complete();
  }
}
