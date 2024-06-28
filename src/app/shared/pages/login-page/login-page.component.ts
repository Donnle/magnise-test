import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { MatFormField } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatLabel } from "@angular/material/select";
import { MatButton } from "@angular/material/button";
import { Subject, takeUntil } from 'rxjs';
import { AuthorizationService } from '../../../core/services/authorization/authorization.service';

@Component({
	selector: 'app-login-page',
	standalone: true,
  imports: [ReactiveFormsModule, MatFormField, MatInput, MatLabel, MatButton],
	templateUrl: './login-page.component.html',
	styleUrl: './login-page.component.scss',
})
export class LoginPageComponent implements OnDestroy {
	private unsubscribe$: Subject<void> = new Subject<void>();

	public loginForm: FormGroup = new FormGroup({
		username: new FormControl(''),
		password: new FormControl(''),
	});

	constructor(
		private authorizationService: AuthorizationService,
		private router: Router,
	) {
    // TODO: Just to have opportunity to refresh token before end
		// if (this.authorizationService.isLoggedIn) {
		// 	this.router.navigate(['/chart']);
		// }
	}

	onSubmit() {
		const credentials = this.loginForm.value;

		this.authorizationService
			.login(credentials)
			.pipe(takeUntil(this.unsubscribe$))
			.subscribe({
				next: () => {
					this.router.navigate(['/chart']);
				},
				error: (err) => {
					alert('Error while log in!')
				},
			});
	}

	ngOnDestroy() {
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	}
}
