import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.scss' ],
})
export class LoginComponent implements OnInit {
    email: string;
    password: string;
    loginMessage: string;
    userRole: number;

    constructor(
        private authService: SocialAuthService,
        private router: Router,
        private userService: UserService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        this.userService.authState$.subscribe((authState) => {
            if (authState) {
                this.router.navigateByUrl(this.route.snapshot.queryParams.returnUrl || '/profile');
            } else {
                this.router.navigateByUrl('/login');
            }
        });
    }

    signInWithGoogle() {
        this.userService.signInWithGoogle();
    }

    login(form: NgForm) {
        const email = this.email;
        const password = this.password;

        if (form.invalid) {
            return;
        }

        form.reset();
        this.userService.loginUser(email, password);

        this.userService.loginMessage$.subscribe((msg) => {
            this.loginMessage = msg;
            setTimeout(() => {
                this.loginMessage = '';
            }, 2000);
        });
    }
}
