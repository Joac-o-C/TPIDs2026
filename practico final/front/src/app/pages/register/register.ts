import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterPage {
  private auth = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);

  async submit(): Promise<void> {
    if (this.password !== this.confirmPassword) {
      this.toast.error('Las contraseñas no coinciden');
      return;
    }

    this.loading.set(true);
    try {
      await firstValueFrom(this.auth.register({ email: this.email, password: this.password }));
      this.router.navigate(['/verify-pending']);
    } catch (err: any) {
      this.toast.error(err.error?.message || 'Error al registrarse');
    } finally {
      this.loading.set(false);
    }
  }
}
