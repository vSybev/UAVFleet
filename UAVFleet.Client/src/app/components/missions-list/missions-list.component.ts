import { Component, OnInit, inject } from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';
import { MissionService, Mission } from '../../services/mission.service';
import { DroneService, Drone } from '../../services/drone.service';
import { OperatorService, Operator } from '../../services/operator.service';
import { tap } from 'rxjs/operators';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

export interface DisplayMission extends Mission {
  droneSerial: string;
  operatorName: string;
}

@Component({
  selector: 'app-missions-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule,
    NgOptimizedImage
  ],
  templateUrl: './missions-list.component.html',
  styleUrls: ['./missions-list.component.scss']
})
export class MissionsListComponent implements OnInit {
  private fb = inject(FormBuilder);
  private missionSvc = inject(MissionService);
  private droneSvc = inject(DroneService);
  private opSvc = inject(OperatorService);

  form!: FormGroup;
  missions: DisplayMission[] = [];
  drones: Drone[] = [];
  operators: Operator[] = [];
  loading = false;
  page = 1;
  size = 10;
  totalPages = 0;
  viewMode: 'table' | 'cards' = 'table';

  ngOnInit() {
    this.form = this.fb.group({
      droneId: [''],
      operatorId: ['']
    });

    this.droneSvc.list(1, 100).subscribe(p => this.drones = p.items);
    this.opSvc.list(1, 100).subscribe(p => this.operators = p.items);

    this.form.valueChanges.subscribe(() => {
      this.page = 1;
      this.load();
    });

    this.load();
  }

  toggleView() {
    this.viewMode = this.viewMode === 'table' ? 'cards' : 'table';
  }

  load() {
    this.loading = true;
    const { droneId, operatorId } = this.form.value;

    this.missionSvc.list(this.page, this.size, 'startTime', {
      droneId: droneId ? Number(droneId) : undefined,
      operatorId: operatorId ? Number(operatorId) : undefined
    })
      .pipe(tap(() => this.loading = false))
      .subscribe(res => {
        this.totalPages = res.totalPages;
        this.missions = res.items.map(m => {
          const d = this.drones.find(x => x.droneId === m.droneId);
          const o = this.operators.find(x => x.operatorId === m.operatorId);
          return {
            ...m,
            droneSerial: d ? d.serialNumber : '',
            operatorName: o ? `${o.firstName} ${o.lastName}` : ''
          };
        });
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
    if (!confirm('Сигурни ли сте, че искате да изтриете тази мисия?')) return;
    this.missionSvc.delete(id).subscribe(() => this.load());
  }

  getPlaceholderImage(): string {
    return 'assets/images/top_secret.png';
  }
}
