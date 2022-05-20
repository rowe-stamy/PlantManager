import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { isEqual, omit } from 'lodash';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { secondaryToolbar } from 'src/app/animations';
import { Fraction, Plant } from 'src/app/datamodel';
import { PlantRenameComponent } from 'src/app/plants/plant-details/plant-rename/plant-rename.component';
import { PlantsQuery } from 'src/app/queries';
import { execCommand, plantUpdated } from 'src/app/redux/shared.actions';
import { ObjectsService } from 'src/app/services/objects.service';

@Component({
  selector: 'app-plant-details',
  templateUrl: './plant-details.component.html',
  styleUrls: ['./plant-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [secondaryToolbar]
})
export class PlantDetailsComponent implements OnInit {

  plant$: Observable<Plant>;
  plant: Plant;

  formGroup: FormGroup;

  unsubscribeAll: Subject<void>;

  hasChanges$: Observable<boolean>;

  triggerRefresh$: BehaviorSubject<boolean>;

  get routeId$() { return this.route.paramMap.pipe(map(p => p.get('id'))); }

  get fractions(): FormArray {
    return this.formGroup.get('fractions') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private objectsService: ObjectsService,
    public location: Location,
    private fb: FormBuilder,
    private store: Store<any>,
    private actions$: Actions,
    private matDialog: MatDialog) {
    this.formGroup = fb.group({
      fractions: fb.array([])
    })
    this.unsubscribeAll = new Subject();
    this.triggerRefresh$ = new BehaviorSubject(false);
  }

  ngOnInit(): void {
    this.plant$ = combineLatest([
      this.routeId$,
      this.triggerRefresh$,
    ]).pipe(
      switchMap(([id, _]) => this.objectsService.query<Plant>('plants', {
        ids: [id]
      } as PlantsQuery)
        .pipe(
          map(results => results.length === 0 ? null : results[0])
        )
      )
    )

    this.hasChanges$ = combineLatest([
      this.formGroup.valueChanges.pipe(startWith(this.formGroup.value)),
      this.plant$,
    ]).pipe(map(([_, plant]) => {
      return plant != null && !isEqual(omit(plant, ['id', 'name', 'createdBy', 'createdOn', 'modifiedBy', 'modifiedOn']), this.formGroup.getRawValue())
    }))

    this.actions$.pipe(
      ofType(plantUpdated.type),
      takeUntil(this.unsubscribeAll)
    ).subscribe(() => this.triggerRefresh$.next(!this.triggerRefresh$.value));

    this.plant$
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(e => {
        if (e == null) {
          return;
        }
        this.plant = e;
        this.reset();
      });
  }

  reset() {
    if (this.plant == null) {
      return;
    }
    this.formGroup.patchValue(this.plant);
    this.fractions.clear();
    this.plant.fractions.forEach(element => {
      this.fractions.push(this.createFraction(element));
    });
  }

  rename(plant: Plant) {
    this.matDialog.open(PlantRenameComponent, {
      minWidth: '300px',
      data: {
        plantId: plant.id,
        name: plant.name
      }
    })
  }

  save(plantId: string) {
    this.store.dispatch(execCommand({
      name: 'UpdatePlantFractions',
      payload: {
        plantId,
        ...this.formGroup.getRawValue()
      },
      successMessage: 'Anlage aktualisiert',
      successCallback: () => plantUpdated({ plantId })
    }))
  }

  addFraction() {
    this.fractions.push(this.newFraction());
  }

  removeFraction(i: number) {
    this.fractions.removeAt(i);
  }

  newFraction(): FormGroup {
    return this.createFraction(null);
  }

  createFraction(fraction?: Fraction): FormGroup {
    return this.fb.group({
      id: [fraction?.id, Validators.required],
      chargeId: [fraction?.chargeId, Validators.required],
    });
  }
}
