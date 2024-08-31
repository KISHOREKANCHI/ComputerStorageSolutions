import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  Username: any;
  
  constructor(private router:Router){}

  logout(): void {
    this.router.navigate(['login']);
    function expireCookie(name: string) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
    expireCookie('token');
  }

  ngOnInit(){
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = jwtDecode<any>(atob(token.replace("token=", "")));
    this.Username = Jwttoken.UserName;
  }
}
