import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { ApiServiceService } from '../Services/api-service.service';
import { CookieManagerService } from '../Services/cookie-manager.service';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  Username: any;
  ProductDetails: any;
  FilteredProducts: any;
  product:any
  
  constructor(private router:Router,private manager:CookieManagerService){}

  logout(): void {
    this.router.navigate(['login']);
    function expireCookie(name: string) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
    expireCookie('token');
  }

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
    const token = (document.cookie.split(';')[0]);
    if(token){
      const Jwttoken = jwtDecode<any>(atob(token.replace("token=", "")));
      this.Username = Jwttoken.UserName;
    }
    
  }
}
