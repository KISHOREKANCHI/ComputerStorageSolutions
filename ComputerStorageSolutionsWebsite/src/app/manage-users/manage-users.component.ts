import { Component, OnInit } from '@angular/core';
import { ApiServiceService } from '../Services/api-service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  users: any[] = [];
  selectedAction: string | null = null;
  selectedUserId: string | null = null;
  popupText: string | undefined;
  popupVisible: boolean = false;
  

  constructor(private apiService: ApiServiceService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe({
      next: (data: any) => {
        this.users = data;
        console.log("data",this.users)
      },
      error: (error: any) => {
        this.showPopup('Error loading users');
        console.error('Error loading users', error); // Optional: Keep console log for debugging
      }
    });
  }

  promoteToAdmin(userId: string) {
    this.selectedAction = 'Promote to Admin';
    this.selectedUserId = userId;
    this.openConfirmationModal();
  }

  demoteToUser(userId: string) {
    this.selectedAction = 'Demote to User';
    this.selectedUserId = userId;
    this.openConfirmationModal();
  }

  deleteUser(userId: string) {
    this.selectedAction = 'Delete User';
    this.selectedUserId = userId;
    this.openConfirmationModal();
  }

  confirmAction() {
    console.log('Confirm action called for:', this.selectedAction);
    if (this.selectedUserId) {
      if (this.selectedAction === 'Promote to Admin') {
        this.apiService.promoteToAdmin(this.selectedUserId).subscribe({
          next: (response: any) => {
            this.loadUsers();
            this.showPopup('User promoted to Admin successfully!');
          },
          error: (error: any) => {
            this.showPopup('Error promoting user');
            console.error('Error promoting user', error); // Optional: Keep console log for debugging
          }
        });
      } else if (this.selectedAction === 'Demote to User') {
        this.apiService.demoteToUser(this.selectedUserId).subscribe({
          next: (response: any) => {
            this.loadUsers();
            this.showPopup('User demoted to User successfully!');
          },
          error: (error: any) => {
            this.showPopup('Error demoting user');
            console.error('Error demoting user', error); // Optional: Keep console log for debugging
          }
        });
      } else if (this.selectedAction === 'Delete User') {
        this.apiService.deleteUser(this.selectedUserId).subscribe({
          next: (response: any) => {
            this.loadUsers();
            this.showPopup('User deleted successfully!');
          },
          error: (error: any) => {
            this.showPopup('Error deleting user');
            console.error('Error deleting user', error); // Optional: Keep console log for debugging
          }
        });
      }
    }
    this.closeConfirmationModal();
  }

  openConfirmationModal() {
    // Open the modal using Bootstrap's JavaScript methods
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
      console.log('Modal opened for action:', this.selectedAction);
    }
  }

  closeConfirmationModal() {
    // Close the modal using Bootstrap's JavaScript methods
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
        console.log('Modal closed');
      }
    }
    this.selectedAction = null;
    this.selectedUserId = null;
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}
