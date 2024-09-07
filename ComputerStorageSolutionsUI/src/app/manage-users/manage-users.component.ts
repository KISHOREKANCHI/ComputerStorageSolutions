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
  selectedUserStatus: boolean = false; // Default to false
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

  toggleUserStatus(userId: string, isActive: boolean) {
    this.selectedAction = isActive ? 'Deactivate User' : 'Activate User';
    this.selectedUserId = userId;
    this.selectedUserStatus = !isActive;
    this.openConfirmationModal();
  }

  confirmAction() {
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
      } else if (this.selectedAction === 'Deactivate User' || this.selectedAction === 'Activate User') {
        this.apiService.toggleUserStatus(this.selectedUserId, this.selectedUserStatus).subscribe({
          next: (response: any) => {
            this.loadUsers();
            this.showPopup(response);
          },
          error: (error: any) => {
            this.showPopup(`Error ${this.selectedUserStatus ? 'activating' : 'deactivating'} user`);
            console.error(`Error ${this.selectedUserStatus ? 'activating' : 'deactivating'} user`, error); // Optional: Keep console log for debugging
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
    }
  }

  closeConfirmationModal() {
    // Close the modal using Bootstrap's JavaScript methods
    const modalElement = document.getElementById('confirmationModal');
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
    this.selectedAction = null;
    this.selectedUserId = null;
    this.selectedUserStatus = false; // Reset to default
  }

  showPopup(message: string): void {
    this.popupText = message;
    this.popupVisible = true;

    setTimeout(() => {
      this.popupVisible = false;
    }, 2000);
  }
}
