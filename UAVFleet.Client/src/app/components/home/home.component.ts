import {Component, HostBinding} from '@angular/core';
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {RouterLink, RouterLinkActive} from "@angular/router";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NgOptimizedImage, FontAwesomeModule, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  @HostBinding('class.dark-theme') isDark = false;

  constructor(private auth: AuthService) {
    this.isDark = localStorage.getItem('theme') === 'dark';
  }

  toggleTheme(): void {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : '');
  }

  logout(): void {
    this.auth.logout();
  }
}
