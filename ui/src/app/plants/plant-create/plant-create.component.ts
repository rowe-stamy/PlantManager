import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Guid } from 'guid-typescript';
import { emptyAction, execCommand } from 'src/app/redux/shared.actions';

@Component({
  selector: 'app-plant-create',
  templateUrl: './plant-create.component.html',
  styleUrls: ['./plant-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlantCreateComponent implements OnInit {

  formGroup: FormGroup;

  constructor(
    fb: FormBuilder,
    private dialogRef: MatDialogRef<PlantCreateComponent>,
    private store: Store<any>,
    private router: Router) {
    this.formGroup = fb.group({
      id: [Guid.create().toString(), Validators.required],
      name: [null, Validators.required]
    })
  }

  ngOnInit(): void {
  }

  save() {
    this.store.dispatch(execCommand({
      name: 'CreatePlant',
      payload: this.formGroup.getRawValue(),
      successMessage: 'Anlage erstellt',
      successCallback: () => {
        this.dialogRef.close();
        this.router.navigateByUrl('/plants/' + this.formGroup.get('id').value)
        return emptyAction();
      }
    }))
  }
}
