import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { execCommand, plantUpdated } from 'src/app/redux/shared.actions';

@Component({
  selector: 'app-plant-rename',
  templateUrl: './plant-rename.component.html',
  styleUrls: ['./plant-rename.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantRenameComponent implements OnInit {

  formGroup: FormGroup;

  constructor(fb: FormBuilder,
    private dialogRef: MatDialogRef<PlantRenameComponent>,
    private store: Store<any>,
    @Inject(MAT_DIALOG_DATA) public data: { plantId: string; name: string; }) {
    this.formGroup = fb.group({
      plantId: [this.data.plantId, Validators.required],
      name: [this.data.name, Validators.required]
    })
  }

  ngOnInit(): void {

  }

  save() {
    this.store.dispatch(execCommand({
      name: 'RenamePlant',
      payload: this.formGroup.getRawValue(),
      successMessage: 'Anlage umbenannt',
      successCallback: () => {
        this.dialogRef.close();
        return plantUpdated({ plantId: this.data.plantId });
      }
    }))
  }
}
