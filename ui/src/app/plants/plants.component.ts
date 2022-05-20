import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Observable } from 'rxjs';
import { secondaryToolbar } from 'src/app/animations';
import { Plant } from 'src/app/datamodel';
import { PlantCreateComponent } from 'src/app/plants/plant-create/plant-create.component';
import { ObjectsService } from 'src/app/services/objects.service';

@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    secondaryToolbar
  ]
})
export class PlantsComponent implements OnInit {

  plants$: Observable<Plant[]>;
  isLoading$: BehaviorSubject<boolean>;

  constructor(private objectsService: ObjectsService, private matDialog: MatDialog) {
    this.isLoading$ = new BehaviorSubject(false);
  }

  ngOnInit(): void {
    this.plants$ = this.objectsService.query<Plant>('plants', {});
  }

  create() {
    this.matDialog.open(PlantCreateComponent, {
      minWidth: '300px'
    })
  }
}
