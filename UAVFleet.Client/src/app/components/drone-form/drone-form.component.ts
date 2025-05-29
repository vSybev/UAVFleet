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
import { Observable } from 'rxjs';
import { DroneService, Drone } from '../../services/drone.service';

@Component({
  selector: 'app-drone-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './drone-form.component.html',
  styleUrls: ['./drone-form.component.scss']
})
export class DroneFormComponent implements OnInit {
  private fb    = inject(FormBuilder);
  private svc   = inject(DroneService);
  private route = inject(ActivatedRoute);
  private router= inject(Router);

  form!: FormGroup;
  today!: string;
  id?: number;

  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      serialNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9-]+$/)
        ]
      ],
      manufacturer: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          // само латински букви, цифри, интервали, тире и _
          Validators.pattern(/^[A-Za-z0-9 _-]+$/)
        ]
      ],
      model: [
        '',
        [
          Validators.required,
          Validators.maxLength(100),
          // аналогично за модела
          Validators.pattern(/^[A-Za-z0-9 _-]+$/)
        ]
      ],
      payloadCapacity: [
        0,
        [Validators.required, Validators.min(0)]
      ],
      serviceDate: [
        '',
        [Validators.required, this.pastOrTodayDateValidator]
      ],
      status: [
        '',
        [Validators.required]
      ]
    });

    // Ако има id => edit режим
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.svc.get(this.id).subscribe((d: Drone) => {
        this.form.patchValue({
          serialNumber:    d.serialNumber,
          manufacturer:    d.manufacturer,
          model:           d.model,
          payloadCapacity: d.payloadCapacity,
          serviceDate:     d.serviceDate.split('T')[0],
          status:          d.status
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Partial<Drone>;
    const req$: Observable<any> = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    req$.subscribe({
      next: () => this.router.navigate(['/drones']),
      error: err => alert('Save failed: ' + err.message)
    });
  }

  cancel(): void {
    this.router.navigate(['/drones']);
  }

  /** Датата трябва да е днес или в миналото */
  private pastOrTodayDateValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return null;
    const sel = new Date(val);
    const today = new Date();
    today.setHours(0,0,0,0);
    return sel > today ? { futureDate: true } : null;
  }
}
