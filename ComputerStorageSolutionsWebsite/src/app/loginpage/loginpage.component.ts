import { Component, ChangeDetectorRef } from '@angular/core';
import { UserDetailsService } from 'src/app/Services/user-details.service';
import { Router } from '@angular/router';
import { CookieManagerService } from 'src/app/Services/cookie-manager.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-loginpage',
  templateUrl: './loginpage.component.html',
  styleUrls: ['./loginpage.component.css']
})
export class LoginpageComponent {

  email: string = "";
  password: string = "";
  UserDetails: any | null = null;
  Token: any | null = null;
  priority: string = "high";
  rememberMeChecked: boolean = true;
  ShowPassword: boolean=false;
  token: any| null = null;
  popupText: string | undefined;
  popupVisible: boolean=false;

  constructor(
    private userDetailsService: UserDetailsService,
    private router: Router,
    private manager: CookieManagerService
  ) {}

  RememberMe(event: any) {
    this.priority = event.target.checked ? "high" : "low";
  }

  Login() {
    const loginData = {
      email: this.email,
      Password: this.password
    };
    this.userDetailsService.GetUserDetails(loginData).subscribe({
      next: (response: any) => {
        this.Token = response;
        this.token=jwtDecode<any>(this.Token.token);
        const exp = this.token.exp;
        const expirationDate = new Date(exp * 1000);
        document.cookie = `token=${btoa(this.Token.token)};expires=${expirationDate.toUTCString()}; Secure;SameSite=Strict; Priority=${this.priority}; path=/`;
        this.showPopup("Logged in successfully");
        this.router.navigate(['products']);
        const expiry = 1;
        this.manager.checkToken(expiry);
      },
      error: (error: any) => {
        this.showPopup(error);
      }
    });
  }

  SignUpRedirect() {
    this.router.navigate(['signup']);
  }

  toggleShowPassword() {
    this.ShowPassword = !this.ShowPassword;
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}
