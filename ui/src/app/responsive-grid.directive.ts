import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatGridList } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export interface ResponsiveColumnsMap {
    xs?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
}

// Usage: <mat-grid-list [responsiveCols]="{xs: 2, sm: 2, md: 4, lg: 6, xl: 8}">
@Directive({
    selector: '[appResponsiveGrid]'
})
export class ResponsiveGridDirective implements OnInit, OnDestroy {
    private countBySize: ResponsiveColumnsMap = { xs: 2, sm: 2, md: 4, lg: 6, xl: 8 };
    private unsubscribeAll: Subject<void>;

    public get cols(): ResponsiveColumnsMap {
        return this.countBySize;
    }

    @Input('appResponsiveGrid')
    public set cols(map: ResponsiveColumnsMap) {
        if (map && ('object' === (typeof map))) {
            this.countBySize = map;
        }
    }

    public constructor(
        private grid: MatGridList,
        private media: MediaObserver
    ) {
        this.initializeColsCount();
        this.unsubscribeAll = new Subject();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    public ngOnInit(): void {
        this.initializeColsCount();

        this.media.asObservable()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(o => {
                this.grid.cols = this.countBySize[o[0].mqAlias];
            });
    }

    private initializeColsCount(): void {
        Object.keys(this.countBySize).some(
            (mqAlias: string): boolean => {
                const isActive = this.media.isActive(mqAlias);

                if (isActive) {
                    this.grid.cols = this.countBySize[mqAlias];
                }

                return isActive;
            });
    }
}
