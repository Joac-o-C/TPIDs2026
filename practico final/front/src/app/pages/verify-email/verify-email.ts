import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../services/auth.service';

type Status = 'loading' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  imports: [RouterLink],
  templateUrl: './verify-email.html',
  styleUrl: './verify-email.css',
})
export class VerifyEmailPage implements OnInit {
  private auth = inject(AuthService);
  private route = inject(ActivatedRoute);

  status = signal<Status>('loading');
  message = '';

  async ngOnInit(): Promise<void> {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.status.set('error');
      this.message = 'Falta el token de verificación en el enlace';
      return;
    }
    try {
      const res = await firstValueFrom(this.auth.verifyEmail(token));
      this.message = res.message;
      this.status.set('success');
    } catch (err: any) {
      this.message = err.error?.message || 'No se pudo verificar el email';
      this.status.set('error');
    }
  }
}
