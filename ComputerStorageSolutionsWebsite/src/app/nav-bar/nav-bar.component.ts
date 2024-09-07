import { Component } from '@angular/core';
import {  Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
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
  product:any;
  Role:string ='';
  role:string ='9c06200d-5af1-4b14-bb74-9364b10977fe'
  
  constructor(private router:Router,private manager:CookieManagerService){}

  logout(): void {
    this.expireCookie('token');
  }

  checkCookieExists(): boolean {
    const cookies = document.cookie.split('; '); // Split cookies into an array
    const exists = cookies.some(cookie => cookie.startsWith('token=')); // Check if any cookie starts with the specified name
    return exists; // Return the boolean value
  }

  expireCookie = (name: string) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    this.router.navigate(['login'])
      .then(() => {
        window.location.reload();
      });
  }

  ngOnInit(){
    const expiry = 1;
    this.manager.checkToken(expiry);
    const token = (document.cookie.split(';')[0]);
    if(token){
      const Jwttoken = jwtDecode<any>(atob(token.replace("token=", "")));
      this.Username = Jwttoken.UserName;
      this.Role=Jwttoken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
    
  }

  AddProduct(){
    this.router.navigate(['AddProduct']);
  }

  ModifyProduct(){
    this.router.navigate(['ModifyProduct'])
  }

  ManageUsers(){
    this.router.navigate(['ManageUsers'])
  }

  Statistics(){
    this.router.navigate(['Statistics']);
  }
}
