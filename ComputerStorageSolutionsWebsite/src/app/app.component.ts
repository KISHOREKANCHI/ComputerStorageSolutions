import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { CookieManagerService } from 'src/app/Services/cookie-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  isNotOnProductsPage: boolean=true;

  constructor(private manager : CookieManagerService,private router:Router){}

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL is not '/products'
        this.isNotOnProductsPage = this.router.url !== '/products';
      }
    });
  }
}
