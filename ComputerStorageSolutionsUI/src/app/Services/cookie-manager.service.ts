import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CookieManagerService {

  constructor(private router:Router) { }

  checkToken(expirationDate:number){
    setTimeout(()=>{
      this.logout();
    },expirationDate);
  }

  logout(){
    const token = (document.cookie.split(';')[0]);
    const Jwttoken = token.replace("token=", "");
    if (!Jwttoken){
      this.router.navigate(['login'])
      function expireCookie(name:string) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
        localStorage.clear();
      }
      expireCookie('token');
    }
    else{
      this.addTime();
    }
  }

  addTime(){
    const expiry = 1;
    return this.checkToken(expiry);
  }
}
