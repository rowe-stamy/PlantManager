import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ofType } from '@ngrx/effects';
import { ActionsSubject } from '@ngrx/store';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { Extraction } from 'src/app/datamodel';
import { ExtractionsQuery } from 'src/app/queries';
import { extractionRecorded } from 'src/app/redux/shared.actions';
import { ObjectsService } from 'src/app/services/objects.service';

@Component({
  selector: 'app-extractions-table',
  templateUrl: './extractions-table.component.html',
  styleUrls: ['./extractions-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExtractionsTableComponent implements OnInit {

  @Input() query$: Observable<ExtractionsQuery>;

  dataSource$: Observable<MatTableDataSource<Extraction>>;
  internalDisplayedColumns: string[];
  unsubscribeAll: Subject<void>;
  triggerRefresh$: BehaviorSubject<boolean>;

  constructor(private objectsService: ObjectsService, private actions$: ActionsSubject) {
    this.unsubscribeAll = new Subject();
    this.triggerRefresh$ = new BehaviorSubject(false);
    this.internalDisplayedColumns = [
      'fractionId',
      'chargeId',
      'weightInKg',
      'createdOn',
      'createdBy',
      'comment'
    ]
  }

  ngOnInit(): void {
    this.dataSource$ = combineLatest([
      this.query$,
      this.triggerRefresh$,
    ]).pipe(switchMap(([query, _]) => this.objectsService.query<Extraction>('extractions', query)
      .pipe(map(results => {
        return new MatTableDataSource(results);
      }))
    ))

    this.actions$.pipe(
      ofType(extractionRecorded.type),
      takeUntil(this.unsubscribeAll)
    ).subscribe(() => this.triggerRefresh$.next(!this.triggerRefresh$.value));
  }
}
