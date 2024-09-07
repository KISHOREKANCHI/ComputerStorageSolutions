import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieManagerService } from 'src/app/Services/cookie-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showNavBar: boolean = true; // Renamed for clarity

  constructor(private manager: CookieManagerService, private router: Router) {}

  ngOnInit() {
    const expiry = 1;
    this.manager.checkToken(expiry);
    
    // Listen for navigation events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Show navbar only on specific routes
        this.showNavBar = this.router.url !== '/products' && this.router.url !== '/ModifyProduct';
      }
    });
  }
}
