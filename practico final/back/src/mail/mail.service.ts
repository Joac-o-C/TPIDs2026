import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly frontendUrl: string;

  constructor(private readonly cfg: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.cfg.getOrThrow<string>('MAIL_HOST'),
      port: Number(this.cfg.get<string>('MAIL_PORT') ?? '2525'),
      auth: {
        user: this.cfg.getOrThrow<string>('MAIL_USER'),
        pass: this.cfg.getOrThrow<string>('MAIL_PASS'),
      },
    });
    this.from = this.cfg.get<string>('MAIL_FROM') ?? 'no-reply@tpids.local';
    this.frontendUrl =
      this.cfg.get<string>('FRONTEND_URL') ?? 'http://localhost:4200';
  }

  async sendVerificationEmail(to: string, token: string): Promise<void> {
    const url = `${this.frontendUrl}/verify-email?token=${token}`;
    await this.send(
      to,
      'Verificá tu email',
      `<p>¡Bienvenido! Confirmá tu cuenta haciendo clic en el siguiente enlace:</p>
       <p><a href="${url}">Verificar mi email</a></p>
       <p>Si no creaste esta cuenta, ignorá este mensaje.</p>`,
    );
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const url = `${this.frontendUrl}/reset-password?token=${token}`;
    await this.send(
      to,
      'Restablecé tu contraseña',
      `<p>Recibimos un pedido para restablecer tu contraseña.</p>
       <p><a href="${url}">Crear una nueva contraseña</a></p>
       <p>El enlace vence en 1 hora. Si no lo solicitaste, ignorá este mensaje.</p>`,
    );
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({ from: this.from, to, subject, html });
    this.logger.log(`Email "${subject}" enviado a ${to}`);
  }
}
