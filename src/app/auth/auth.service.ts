import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../app.reducer';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe({
      next: (user) => {
        if (user) {
          this.isAuthenticated = true;
          this.authChange.next(true);
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.authChange.next(false);
          this.router.navigate(['/login']);
          this.isAuthenticated = false;
        }
      },
    });
  }

  registerUser(authData: AuthData) {
    // this.uiService.loadingStateChanged.next(true);
    this.store.dispatch({ type: 'START_LOADING' });
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .finally(() => this.store.dispatch({ type: 'STOP_LOADING' }))
      .then((result) => {})
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch({ type: 'START_LOADING' });
    this.uiService.loadingStateChanged.next(true);
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .finally(() => {
        this.store.dispatch({ type: 'STOP_LOADING' });
      })
      .then((result) => {})
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  logout() {
    this.auth.signOut();
  }

  isAuth() {
    return this.isAuthenticated;
  }
}
