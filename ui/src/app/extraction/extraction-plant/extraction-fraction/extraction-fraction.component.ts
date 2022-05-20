import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { execCommand, extractionRecorded } from 'src/app/redux/shared.actions';

@Component({
  selector: 'app-extraction-fraction',
  templateUrl: './extraction-fraction.component.html',
  styleUrls: ['./extraction-fraction.component.scss']
})
export class ExtractionFractionComponent implements OnInit {

  private readonly extractionId: string;
  formGroup: FormGroup;

  constructor(fb: FormBuilder,
    private dialogRef: MatDialogRef<ExtractionFractionComponent>,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: { plantName: string; plantId: string; fractionId: string; }) {
    this.extractionId = Guid.create().toString();
    this.formGroup = fb.group({
      extractionId: [this.extractionId],
      plantId: [this.data.plantId, Validators.required],
      fractionId: [this.data.fractionId, Validators.required],
      weightInKg: [0, Validators.required],
      comment: [null],
    })
  }

  ngOnInit(): void {

  }

  save() {
    const weightInKg = this.formGroup.get('weightInKg').value
    this.store.dispatch(execCommand({
      name: 'RecordExtraction',
      payload: this.formGroup.getRawValue(),
      successMessage: `Entleerung von ${weightInKg}KG aufgezeichnet!`,
      successCallback: () => {
        this.dialogRef.close();
        return extractionRecorded({ extractionId: this.extractionId });
      }
    }))
  }
}
