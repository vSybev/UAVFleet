import {Component, OnInit, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule, FormBuilder} from '@angular/forms';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {MissionService, Mission} from '../../services/mission.service';
import {DroneService, Drone} from '../../services/drone.service';
import {OperatorService, Operator} from '../../services/operator.service';
import {tap} from 'rxjs/operators';
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

export interface DisplayMission extends Mission {
  droneSerial: string;
  operatorName: string;
}

@Component({
  selector: 'app-mission-list',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    FontAwesomeModule
  ],
  templateUrl: './missions-list.component.html',
  styleUrls: ['./missions-list.component.scss']
})
export class MissionListComponent implements OnInit {
  private fb= inject(FormBuilder);
  private missionSvc= inject(MissionService);
  private droneSvc= inject(DroneService);
  private opSvc= inject(OperatorService);

  form= this.fb.group({
    droneId:    this.fb.control('', { nonNullable: true }),
    operatorId: this.fb.control('', { nonNullable: true })
  });

  missions: DisplayMission[] = [];
  drones:   Drone[] = [];
  operators: Operator[] = [];
  loading = false;
  page= 1;
  size= 10;
  totalPages= 0;

  ngOnInit() {
    this.droneSvc.list(1, 100, 'serialNumber', {})
      .subscribe(p => this.drones = p.items);

    this.opSvc.list(1, 100, 'lastName', {})
      .subscribe(p => this.operators = p.items);

    this.form.valueChanges.subscribe(() => {
      this.page = 1;
      this.load();
    });

    this.load();
  }

  load() {
    this.loading = true;
    const rawDrone    = this.form.controls.droneId.value;
    const rawOperator = this.form.controls.operatorId.value;
    const droneId     = rawDrone    ? Number(rawDrone)    : undefined;
    const operatorId  = rawOperator ? Number(rawOperator) : undefined;

    this.missionSvc.list(this.page, this.size, 'startTime', { droneId, operatorId })
      .pipe(tap(() => (this.loading = false)))
      .subscribe(res => {
        this.totalPages = res.totalPages;
        this.missions = res.items.map(m => {
          const d = this.drones.find(x => x.droneId === m.droneId);
          const o = this.operators.find(x => x.operatorId === m.operatorId);
          return {
            ...m,
            droneSerial:   d ? d.serialNumber : '',
            operatorName:  o ? `${o.firstName} ${o.lastName}` : ''
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
}
