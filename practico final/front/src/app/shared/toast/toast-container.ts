import { Component, inject } from '@angular/core';
import { ToastService, ToastType } from './toast.service';

@Component({
  selector: 'app-toast-container',
  templateUrl: './toast-container.html',
  styleUrl: './toast-container.css',
})
export class ToastContainer {
  toast = inject(ToastService);

  bgClass(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'text-bg-success';
      case 'error':
        return 'text-bg-danger';
      default:
        return 'text-bg-info';
    }
  }

  icon(type: ToastType): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle';
      case 'error':
        return 'bi-exclamation-triangle';
      default:
        return 'bi-info-circle';
    }
  }
}
