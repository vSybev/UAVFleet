import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private renderer: Renderer2;
  private darkClass = 'dark-theme';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  enableDarkTheme(enabled: boolean) {
    const method = enabled ? 'addClass' : 'removeClass';
    this.renderer[method](document.body, this.darkClass);
    localStorage.setItem('darkTheme', enabled ? '1' : '0');
  }

  initTheme() {
    const stored = localStorage.getItem('darkTheme');
    this.enableDarkTheme(stored === '1');
  }

  toggleTheme() {
    const isDark = document.body.classList.contains(this.darkClass);
    this.enableDarkTheme(!isDark);
  }
}
