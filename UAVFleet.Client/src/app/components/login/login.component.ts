import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router, RouterModule} from '@angular/router';
import {CommonModule, NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  errorMsg = '';

  submit() {
    this.errorMsg = '';
    if (this.form.invalid) return;
    const { username, password } = this.form.value;

    this.auth.login(username!, password!)
      .subscribe({
        next: () => this.router.navigate(['/home']),
        error: err => {
          this.errorMsg = err.status === 401
            ? 'Невалидни данни'
            : 'Грешка при връзка';
        }
      });
  }
}
