import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserDetailsService } from '../Services/user-details.service';

@Component({
  selector: 'app-signuppage',
  templateUrl: './signuppage.component.html',
  styleUrls: ['./signuppage.component.css']
})
export class SignuppageComponent {
  Username: string = '';
  Email: string = '';
  Password: string = '';
  ConfirmPassword: string = '';
  TermsAccepted: boolean = false;
  UsernameError: string = '';
  EmailError: string = '';
  PasswordError: string = '';
  ConfirmPasswordError: string = '';
  RegistrationMessage: string = ''; 
  ShowPassword: boolean = false; 
  ShowConfirmPassword: boolean = false; 

  constructor(
    private router: Router, 
    private userDetailsService: UserDetailsService
  ) {}

  toggleShowPassword() {
    this.ShowPassword = !this.ShowPassword;
  }

  toggleShowConfirmPassword() {
    this.ShowConfirmPassword = !this.ShowConfirmPassword;
  }

  validateUsername() {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]{2,}$/;
    if (!usernameRegex.test(this.Username)) {
      this.UsernameError = 'Username must start with a letter and be at least 3 characters long.';
    } else {
      this.UsernameError = '';
    }
  }

  validateEmail() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.Email)) {
      this.EmailError = 'Please enter a valid email address.';
    } else {
      this.EmailError = '';
    }
  }

  validatePassword() {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(this.Password)) {
      this.PasswordError = 'Password must be at least 8 characters long, and include 1 lowercase, 1 uppercase, 1 number, and 1 special character.';
    } else {
      this.PasswordError = '';
    }
    this.validateConfirmPassword(); // Validate confirm password when typing
  }

  validateConfirmPassword() {
    this.ConfirmPasswordError = this.Password !== this.ConfirmPassword ? 'Passwords do not match.' : '';
  }

  handleCheckboxChange() {
    this.RegistrationMessage = ''; // Remove error when checkbox is ticked
  }

  LoginRedirect() {
    this.router.navigate(['login']);
  }

  CreateAccount() {
    this.validateUsername();
    this.validateEmail();
    this.validatePassword();
    this.validateConfirmPassword();

    if (this.UsernameError || this.EmailError || this.PasswordError || this.ConfirmPasswordError) {
      return; // Prevent form submission if there are errors
    }

    if (!this.TermsAccepted) {
      this.RegistrationMessage = 'You must accept the Terms of Service to register.';
      return;
    }

    const SignupData = {
      Username: this.Username,
      Email: this.Email,
      Password: this.Password,
    };

    this.userDetailsService.RegisterDetails(SignupData).subscribe({
      next: (response: any) => {
        console.log(response);
        this.RegistrationMessage = response.message+' Redirecting to login...';
        setTimeout(() => {
          this.router.navigate(['login']);
        }, 2000); // Redirect after 2 seconds
      },
      error: (error: any) => {
        console.log(error);
        this.RegistrationMessage = error.message+'Registration failed. Please try again.';
      }
    });
  }
}
