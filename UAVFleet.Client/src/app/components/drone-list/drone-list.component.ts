import {Component, inject, OnInit} from '@angular/core';
import {DroneService, Drone} from '../../services/drone.service';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from "@angular/common";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-drone-list',
  standalone: true,
  templateUrl: './drone-list.component.html',
  styleUrls: ['./drone-list.component.scss'],
  imports: [NgForOf, RouterLink, ReactiveFormsModule, NgIf, RouterLinkActive, DatePipe, FontAwesomeModule, NgOptimizedImage]
})
export class DroneListComponent implements OnInit {
  private fb  = inject(FormBuilder);
  private svc = inject(DroneService);

  form = this.fb.group({
    serialNumber: this.fb.control('', { nonNullable: true }),
    status: this.fb.control('', { nonNullable: true })
  });

  drones: Drone[] = [];
  loading = false;
  page = 1;
  size = 10;
  totalPages = 0;
  viewMode: 'table' | 'cards' = 'table';

  ngOnInit() {
    // При промяна на филтрите – ресетваме на първа страница и презареждаме
    this.form.valueChanges.subscribe(() => {
      this.page = 1;
      this.load();
    });

    this.load();
  }

  load() {
    this.loading = true;

    const raw = this.form.value;
    const serialNumber = raw.serialNumber ?? undefined;
    const status= raw.status ?? undefined;

    this.svc
      .list(this.page, this.size, 'serialNumber', { serialNumber, status })
      .subscribe(res => {
        this.drones = res.items;
        this.totalPages = res.totalPages;
        this.loading = false;
      });
  }

  prev() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  next() {
    if (this.page < this.totalPages) {
      this.page++;
      this.load();
    }
  }

  delete(id: number) {
    if (!confirm('Сигурни ли сте, че искате да изтриете този дрон?')) return;

    this.svc.delete(id).subscribe(() => this.load());
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  getDroneImage(type: string): string {
    switch(type) {
      case 'Phantom 4': return 'assets/images/drone-video.png';
      case 'Anafi': return 'assets/images/drone-delivery.png';
      case 'Evo II': return 'assets/images/drone-spraying.png';
      default: return 'assets/images/drone-shadow.png';
    }
  }
}
