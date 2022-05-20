import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { secondaryToolbar } from 'src/app/animations';
import { Plant } from 'src/app/datamodel';
import { ObjectsService } from 'src/app/services/objects.service';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [secondaryToolbar]
})
export class ExtractionComponent implements OnInit {

  plants$: Observable<Plant[]>;


  constructor(private objectsService: ObjectsService) { }

  ngOnInit(): void {
    this.plants$ = this.objectsService.query<Plant>('plants', {});
  }

}
