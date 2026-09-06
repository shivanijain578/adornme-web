import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ModalVariant = 'success' | 'error' | 'warning' | 'delete' | 'confirm';

export interface ModalConfig
{
  variant?: ModalVariant;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService
{
  private readonly modalSubject = new BehaviorSubject<ModalConfig | null>(null);
  readonly modalState$ = this.modalSubject.asObservable();

  open(config: ModalConfig): void
  {
    this.modalSubject.next({
      variant: 'confirm',
      title: 'Confirmation',
      confirmText: 'OK',
      cancelText: 'Cancel',
      showCancel: true,
      ...config,
    });
  }

  close(): void
  {
    this.modalSubject.next(null);
  }
}
