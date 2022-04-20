import { AuthActions } from './auth.actions';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { TrainingService } from './../training/training.service';
import { AuthData } from './auth-data.model';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as UI from '../shared/ui.actions';
import * as Auth from './auth.actions';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private router: Router,
    private auth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<{ ui: fromRoot.State }>
  ) {}

  initAuthListener() {
    this.auth.authState.subscribe({
      next: (user) => {
        if (user) {
          this.store.dispatch(new Auth.SetAuthenticated());
          this.router.navigate(['/training']);
        } else {
          this.trainingService.cancelSubscriptions();
          this.store.dispatch(new Auth.SetUnauthenticated());
          this.router.navigate(['/login']);
        }
      },
    });
  }

  registerUser(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .finally(() => this.store.dispatch(new UI.StopLoading()))
      .then((result) => {})
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(new UI.StartLoading());
    this.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .finally(() => {
        this.store.dispatch(new UI.StopLoading());
      })
      .then((result) => {})
      .catch((error) => {
        this.uiService.showSnackBar(error.message, null, 3000);
      });
  }

  logout() {
    this.auth.signOut();
  }
}
