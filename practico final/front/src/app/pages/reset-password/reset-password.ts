import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordPage implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  token = '';
  password = '';
  confirmPassword = '';
  success = signal(false);
  loading = signal(false);

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!this.token) {
      this.toast.error('El enlace no es válido (falta el token)');
    }
  }

  async submit(): Promise<void> {
    if (this.password.length < 8) {
      this.toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }
    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.resetPassword(this.token, this.password));
      this.success.set(true);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'No se pudo restablecer la contraseña');
    } finally {
      this.loading.set(false);
    }
  }
}
