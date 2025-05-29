import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '../../services/user.service';
import {User} from "../../models/user.model";

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [ CommonModule, RouterModule, FontAwesomeModule ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  private svc = inject(UserService);

  users: User[] = [];
  loading = false;

  faPlus  = faPlus;
  faTrash = faTrash;

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.svc.list().subscribe({
      next: users => {
        this.users = users;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  deleteUser(id: number) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този потребител?')) return;
    this.svc.delete(id).subscribe(() => this.load());
  }
}
