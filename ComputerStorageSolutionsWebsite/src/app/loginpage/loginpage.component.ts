import { Component , ChangeDetectorRef } from '@angular/core';
import { UserDetailsService } from 'src/app/Services/user-details.service';
import { Router } from '@angular/router';
import { CookieManagerService } from 'src/app/Services/cookie-manager.service';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {

  email:string ="";
  passwordHash:string="";
  UserDetails:any|null =null;
  Token:any|null =null;

  constructor(private userDetailsService: UserDetailsService, private cdr: ChangeDetectorRef,private router:Router,private manager : CookieManagerService) {}

  Login() {
    const loginData = {
      // email: this.email,
      // passwordHash: this.passwordHash
      email:"test@gmail.com",
      Password:"Test@123"
    };
    this.userDetailsService.GetUserDetails(loginData).subscribe({
      next: (response : any) => {
        this.Token = response;
        console.log("clicked");
        document.cookie = `token= ${btoa(this.Token.token)}; Secure;SameSite=Strict; Priority=High; path=/`
        this.router.navigate(['products'])
        const expiry = 1;
        this.manager.checkToken(expiry);
      },
      error: (error: any) => {
        console.log("Failed to fetch data", error);
      }
    });
  }
}
