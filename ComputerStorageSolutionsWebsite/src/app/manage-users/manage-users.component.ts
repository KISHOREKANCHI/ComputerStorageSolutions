import { Component } from '@angular/core';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent {
  users = [
    { id: 1, username: 'john_doe', email: 'john@example.com', role: 'User' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', role: 'Admin' },
    // Add more users as needed
  ];

  selectedAction: string | null = null;
  selectedUser: any = null;

  promoteToAdmin(user: any) {
    this.selectedAction = 'Promote to Admin';
    this.selectedUser = user;
    this.openConfirmationModal();
  }

  demoteToUser(user: any) {
    this.selectedAction = 'Demote to User';
    this.selectedUser = user;
    this.openConfirmationModal();
  }

  deleteUser(user: any) {
    this.selectedAction = 'Delete User';
    this.selectedUser = user;
    this.openConfirmationModal();
  }

  confirmAction() {
    if (this.selectedAction === 'Promote to Admin') {
      this.selectedUser.role = 'Admin';
    } else if (this.selectedAction === 'Demote to User') {
      this.selectedUser.role = 'User';
    } else if (this.selectedAction === 'Delete User') {
      this.users = this.users.filter((u) => u.id !== this.selectedUser.id);
    }
    this.closeConfirmationModal();
  }

  openConfirmationModal() {
    // Logic to open the modal, depends on how you've implemented the modal
  }

  closeConfirmationModal() {
    // Logic to close the modal
    this.selectedAction = null;
    this.selectedUser = null;
  }
}

