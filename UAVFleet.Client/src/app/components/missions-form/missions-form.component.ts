import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MissionService, Mission } from '../../services/mission.service';
import { DroneService, Drone } from '../../services/drone.service';
import { OperatorService, Operator } from '../../services/operator.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-mission-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './missions-form.component.html',
  styleUrls: ['./missions-form.component.scss']
})
export class MissionFormComponent implements OnInit {
  private fb         = inject(FormBuilder);
  private missionSvc = inject(MissionService);
  private droneSvc   = inject(DroneService);
  private opSvc      = inject(OperatorService);
  private route      = inject(ActivatedRoute);
  private router     = inject(Router);

  form!: FormGroup;
  drones:   Drone[]    = [];
  operators: Operator[] = [];
  id?: number;
  loading = false;

  ngOnInit(): void {
    // Създаваме група с групов валидатор за датите
    this.form = this.fb.group({
      droneId:    ['', Validators.required],
      operatorId: ['', Validators.required],
      startTime:  ['', Validators.required],
      endTime:    ['', Validators.required],
      objective:  ['', [Validators.required, Validators.maxLength(500)]],
      result:     ['', Validators.required]
    }, { validators: this.dateOrderValidator });

    // зареждаме дроновете и операторите
    this.droneSvc.list(1, 100, 'serialNumber', {}).subscribe(p => this.drones = p.items);
    this.opSvc.list(1, 100, 'lastName', {}).subscribe(p => this.operators = p.items);

    // ако имаме id => patch стойности
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.loading = true;
      this.missionSvc.get(this.id)
        .pipe(tap(() => this.loading = false))
        .subscribe(m => {
          const fmt = (d: string) => d.substring(0, 16);
          this.form.patchValue({
            droneId:    String(m.droneId),
            operatorId: String(m.operatorId),
            startTime:  fmt(m.startTime),
            endTime:    fmt(m.endTime),
            objective:  m.objective,
            result:     m.result
          });
        });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const fv = this.form.value;
    const payload: Partial<Mission> = {
      droneId:    Number(fv.droneId),
      operatorId: Number(fv.operatorId),
      startTime:  fv.startTime,
      endTime:    fv.endTime,
      objective:  fv.objective,
      result:     fv.result
    };

    this.loading = true;
    const req$: Observable<any> = this.id
      ? this.missionSvc.update(this.id, payload)
      : this.missionSvc.create(payload);

    req$
      .pipe(tap(() => this.loading = false))
      .subscribe({
        next: () => this.router.navigate(['/missions']),
        error: err => alert('Save failed: ' + err.message)
      });
  }

  cancel(): void {
    this.router.navigate(['/missions']);
  }

  /** Валидация: endTime > startTime */
  private dateOrderValidator(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startTime')?.value;
    const end   = group.get('endTime')?.value;
    if (start && end && new Date(end) <= new Date(start)) {
      return { endBeforeStart: true };
    }
    return null;
  }
}
