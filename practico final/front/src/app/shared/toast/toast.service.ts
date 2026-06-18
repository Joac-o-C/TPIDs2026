import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;
  private readonly defaultDuration = 4000;

  success(text: string, duration = this.defaultDuration): void {
    this.show('success', text, duration);
  }

  error(text: string, duration = this.defaultDuration): void {
    this.show('error', text, duration);
  }

  info(text: string, duration = this.defaultDuration): void {
    this.show('info', text, duration);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(type: ToastType, text: string, duration: number): void {
    const id = this.nextId++;
    this.toasts.update((list) => [...list, { id, type, text }]);
    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }
}
