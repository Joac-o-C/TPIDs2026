import { ConfigService } from '@nestjs/config';
export declare class MailService {
    private readonly cfg;
    private readonly logger;
    private readonly transporter;
    private readonly from;
    private readonly frontendUrl;
    constructor(cfg: ConfigService);
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendPasswordResetEmail(to: string, token: string): Promise<void>;
    private send;
}
