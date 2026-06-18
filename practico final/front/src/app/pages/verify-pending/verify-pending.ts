import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-verify-pending',
  imports: [RouterLink],
  templateUrl: './verify-pending.html',
  styleUrl: './verify-pending.css',
})
export class VerifyPendingPage {
  auth = inject(AuthService);
  private toast = inject(ToastService);

  loading = signal(false);

  async resend(): Promise<void> {
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
}
