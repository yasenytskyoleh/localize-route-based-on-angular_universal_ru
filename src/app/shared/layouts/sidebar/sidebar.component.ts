import { Component, OnInit } from '@angular/core';
import { LocalizeRouterModule } from '../../localize-router/localize-router.module';

const LINKS: any[] = [
  { link: '/', name: 'home', icon: 'home' },
  { link: '/mock', name: 'mock', icon: 'info_outline' },
  { link: '/async', name: 'async-http', icon: 'swap_vert' },
  { link: '/back', name: 'back-http', icon: 'swap_vert' },
  { link: '/static/back', name: 'static-back-http', icon: 'swap_vert' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit {
  public links: any[] = [];
  constructor(
    localize: LocalizeRouterModule
  ){}
  ngOnInit(): void {
    const linkTemp = JSON.parse(JSON.stringify(LINKS));
    this.links = linkTemp.map((link) => {
      link.name = `sidebar.${link.name}`;
      return link;
    });
  }
}
