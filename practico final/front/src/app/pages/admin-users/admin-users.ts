import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { UsersService } from '../../services/users.service';
import { SafeUser, UserRole } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-admin-users',
  imports: [DatePipe, FormsModule],
  templateUrl: './admin-users.html',
  styleUrl: './admin-users.css',
})
export class AdminUsersPage implements OnInit {
  private usersService = inject(UsersService);
  auth = inject(AuthService);
  private toast = inject(ToastService);

  users = signal<SafeUser[]>([]);

  async ngOnInit(): Promise<void> {
    try {
      const users = await firstValueFrom(this.usersService.findAll());
      this.users.set(users);
    } catch {
      this.toast.error('Error al cargar usuarios');
    }
  }

  async changeRole(userId: string, role: UserRole): Promise<void> {
    try {
      const updated = await firstValueFrom(this.usersService.updateRole(userId, { role }));
      this.users.update((users) =>
        users.map((u) => (u.id === updated.id ? updated : u)),
      );
      this.toast.success('Rol actualizado');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al cambiar rol');
    }
  }
}
