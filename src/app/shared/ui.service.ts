import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UIService {
  constructor(private snackbar: MatSnackBar) {}

  loadingStateChanged = new Subject<boolean>();

  showSnackBar(message, action, duration) {
    this.snackbar.open(message, action, {
      duration: duration,
    });
  }
}
