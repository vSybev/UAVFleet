import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';
import { User } from "../../models/user.model";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
  private fb     = inject(FormBuilder);
  private svc    = inject(UserService);
  private route  = inject(ActivatedRoute);
  private router = inject(Router);

  form = this.fb.group({
    username:  ['', [Validators.required, Validators.maxLength(50)]],
    firstName: ['', [Validators.required, Validators.maxLength(50)]],
    lastName:  ['', [Validators.required, Validators.maxLength(50)]],
    email:     ['', [Validators.required, Validators.email]],
    role:      ['', [Validators.required]]
  });

  id?: number;
  loading = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.id = +idParam;
      this.loading = true;
      this.svc.get(this.id).subscribe({
        next: user => {
          this.form.patchValue(user);
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) return;

    const payload = this.form.value as Partial<User>;
    this.loading = true;

    let request$: Observable<any>;
    if (this.id) {
      request$ = this.svc.update(this.id, payload);
    } else {
      request$ = this.svc.create(payload);
    }

    request$.subscribe({
      next: () => this.router.navigate(['/users']),
      error: () => this.loading = false
    });
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
