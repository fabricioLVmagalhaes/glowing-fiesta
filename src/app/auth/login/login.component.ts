import { map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { UIService } from '../../shared/ui.service';
import { AuthService } from './../auth.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import * as fromApp from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    public uiService: UIService,
    private store: Store<{ ui: fromApp.State }>
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.pipe(map((state) => state.ui.isLoading));
    // this.store.subscribe((data) => console.log(data));
    // this.uiService.loadingStateChanged.subscribe((isLoading) => {
    //   this.isLoading = isLoading;
    // });
    this.loginForm = new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl('', { validators: [Validators.required] }),
    });
  }

  onSubmit() {
    this.authService.login({
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    });
  }
}
