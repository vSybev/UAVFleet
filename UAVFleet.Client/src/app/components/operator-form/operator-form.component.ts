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
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorService, Operator } from '../../services/operator.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-operator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './operator-form.component.html',
  styleUrls: ['./operator-form.component.scss']
})
export class OperatorFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(OperatorService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  form!: FormGroup;
  today!: string;
  id?: number;

  ngOnInit(): void {
    // Защита срещу избиране на бъдеща дата
    this.today = new Date().toISOString().split('T')[0];

    this.form = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[\p{L}\s\-]+$/u)
        ]
      ],
      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern(/^[\p{L}\s\-]+$/u)
        ]
      ],
      phone: [
        '',
        [
          Validators.required,
          Validators.maxLength(20),
          Validators.pattern(/^[0-9+ ]{9,20}$/)
        ]
      ],
      licenseNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern(/^[A-Za-z0-9\-]{5,50}$/)
        ]
      ],
      hiredDate: [
        '',
        [
          Validators.required,
          this.notFutureDateValidator
        ]
      ],
      notes: [
        '',
        [
          Validators.minLength(10),
          Validators.maxLength(500)
        ]
      ]
    });

    // Ако е edit режим – зареждаме данните
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    if (this.id) {
      this.svc.get(this.id).subscribe((o: Operator) => {
        this.form.patchValue({
          firstName:     o.firstName,
          lastName:      o.lastName,
          phone:         o.phone,
          licenseNumber: o.licenseNumber,
          hiredDate:     o.hiredDate.split('T')[0],
          notes:         o.notes || ''
        });
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Partial<Operator>;
    const request$: Observable<any> = this.id
      ? this.svc.update(this.id, payload)
      : this.svc.create(payload);

    request$.subscribe({
      next: () => this.router.navigate(['/operators']),
      error: err => alert('Save failed: ' + err.message)
    });
  }

  cancel(): void {
    this.router.navigate(['/operators']);
  }

  /** Контрола не бива да бъде в бъдещето */
  private notFutureDateValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val) return null;
    const sel = new Date(val);
    const today = new Date();
    today.setHours(0,0,0,0);
    return sel > today ? { futureDate: true } : null;
  }
}
