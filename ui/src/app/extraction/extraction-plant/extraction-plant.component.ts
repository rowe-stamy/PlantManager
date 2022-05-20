import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { secondaryToolbar } from 'src/app/animations';
import { Extraction, Fraction, Plant } from 'src/app/datamodel';
import { ExtractionFractionComponent } from 'src/app/extraction/extraction-plant/extraction-fraction/extraction-fraction.component';
import { ExtractionsQuery, PlantsQuery } from 'src/app/queries';
import { ObjectsService } from 'src/app/services/objects.service';

@Component({
  selector: 'app-extraction-plant',
  templateUrl: './extraction-plant.component.html',
  styleUrls: ['./extraction-plant.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [secondaryToolbar]
})
export class ExtractionPlantComponent implements OnInit {

  plant$: Observable<Plant>;
  extractionsQuery$: Observable<ExtractionsQuery>;

  formGroup: FormGroup;

  get routeId$() { return this.route.paramMap.pipe(map(p => p.get('id'))); }


  constructor(
    private route: ActivatedRoute,
    private objectsService: ObjectsService,
    public location: Location,
    fb: FormBuilder,
    private matDialog: MatDialog) {
    this.formGroup = fb.group({
      fractions: fb.array([])
    })
  }

  ngOnInit(): void {
    this.plant$ = this.routeId$.pipe(switchMap(id => this.objectsService.query<Plant>('plants', {
      ids: [id]
    } as PlantsQuery).pipe(map(results => results.length === 0 ? null : results[0]))
    ))
    this.extractionsQuery$ = this.routeId$.pipe(map(plantId => ({ plantId })))
  }

  onFractionSelection(plantId: string, plantName: string, event$: MatSelectionListChange) {
    if (event$.options.length === 0) {
      return;
    }
    const fraction = event$.options[0].value as Fraction;
    this.matDialog.open(ExtractionFractionComponent, {
      minWidth: '300px',
      data: {
        plantName,
        plantId,
        fractionId: fraction.id
      }
    })
  }

}
