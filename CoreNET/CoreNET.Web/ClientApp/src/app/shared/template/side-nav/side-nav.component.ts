import { Component, OnInit } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';
import { HttpClient } from '@angular/common/http';
import { UiStateQuery, UiStateService, UiStateStore } from '../../../state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './side-nav.component.html',
})
export class SideNavComponent implements OnInit {
  public menuItems$: Observable<any[]>;
  isFolded: boolean;
  isSideNavDark: boolean;
  isExpand: boolean;

  constructor(
    private themeService: ThemeConstantService,
    private http: HttpClient,
    private uiStateService: UiStateService,
    private uiStateStore: UiStateStore,
    private uiStateQuery: UiStateQuery
  ) {}

  ngOnInit(): void {
    this.uiStateService.get();
    this.menuItems$ = this.uiStateQuery.menuItems$;
    // this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.themeService.isMenuFoldedChanges.subscribe(
      (isFolded) => (this.isFolded = isFolded)
    );
    this.themeService.isExpandChanges.subscribe(
      (isExpand) => (this.isExpand = isExpand)
    );
    this.themeService.isSideNavDarkChanges.subscribe(
      (isDark) => (this.isSideNavDark = isDark)
    );
  }

  closeMobileMenu(): void {
    if (window.innerWidth < 992) {
      this.isFolded = false;
      this.isExpand = !this.isExpand;
      this.themeService.toggleExpand(this.isExpand);
      this.themeService.toggleFold(this.isFolded);
    }
  }

  getMenuItems(): void {}

  setSelected(item: any) {
    this.uiStateStore.update((state) => ({ selectedMenu: item }));
  }
}
