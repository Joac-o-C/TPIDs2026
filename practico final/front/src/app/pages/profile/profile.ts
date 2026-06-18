import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-profile',
  imports: [DatePipe, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfilePage {
  auth = inject(AuthService);
  private users = inject(UsersService);
  private toast = inject(ToastService);

  loading = signal(false);

  // Cambiar contraseña
  currentPassword = '';
  newPassword = '';
  confirmNewPassword = '';
  changingPassword = signal(false);

  // Cambiar email
  emailCurrentPassword = '';
  newEmail = '';
  changingEmail = signal(false);

  async resendVerification(): Promise<void> {
    this.loading.set(true);
    try {
      const res = await firstValueFrom(this.auth.resendVerification());
      this.toast.success(res.message);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo reenviar el email');
    } finally {
      this.loading.set(false);
    }
  }

  async changePassword(): Promise<void> {
    if (this.newPassword.length < 8) {
      this.toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (this.newPassword !== this.confirmNewPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    this.changingPassword.set(true);
    try {
      await firstValueFrom(
        this.users.changePassword({
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
        }),
      );
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmNewPassword = '';
      this.toast.success('Contraseña actualizada');
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar la contraseña');
    } finally {
      this.changingPassword.set(false);
    }
  }

  async changeEmail(): Promise<void> {
    this.changingEmail.set(true);
    try {
      const updated = await firstValueFrom(
        this.users.changeEmail({
          currentPassword: this.emailCurrentPassword,
          newEmail: this.newEmail,
        }),
      );
      this.auth.user.set(updated);
      this.emailCurrentPassword = '';
      this.newEmail = '';
      this.toast.success(
        'Email actualizado. Revisá tu nuevo correo para verificarlo.',
      );
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo cambiar el email');
    } finally {
      this.changingEmail.set(false);
    }
  }
}
