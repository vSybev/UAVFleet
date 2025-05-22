import { Component } from '@angular/core';
import {Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {AuthService} from "./services/auth.service";
import {NgIf, NgOptimizedImage} from "@angular/common";
import {ThemeService} from "./services/theme.service";
import {FaIconLibrary, FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faMoon, faPlus, faSignOutAlt, faSun} from "@fortawesome/free-solid-svg-icons";
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, NgIf, NgOptimizedImage, FontAwesomeModule],
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.scss']
})
export class AppComponent {
  isDark = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private themeSvc: ThemeService,
    private library: FaIconLibrary
  ) {
    library.addIcons(faMoon, faSun, faSignOutAlt, faPlus);
    library.addIconPacks(fas);
  }

  ngOnInit() {
    this.themeSvc.initTheme();
    this.isDark = document.body.classList.contains('dark-theme');
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  toggleTheme() {
    this.themeSvc.toggleTheme();
    this.isDark = document.body.classList.contains('dark-theme');
  }
}
