import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from 'src/app/shared/user/user.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-create-custom',
  templateUrl: './create-editor.component.html',
  styleUrls: ['./create-editor.component.scss', '../home.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, ReactiveFormsModule, RouterModule, NgIf],
})
export class CreateEditorComponent implements OnInit {

  registerForm: FormGroup;
  loginForm: FormGroup;
  passwordRecoveryForm: FormGroup;


  constructor(private fb: FormBuilder, private userService: UserService, private toastController: ToastController) {
    this.registerForm = this.fb.group({
      username: ['', Validators.compose([Validators.required, (Validators.pattern(/^[^@]+$/))])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
    this.passwordRecoveryForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }
  ngOnInit() {
  }

  register(username: string, email: string, password: string): void {
    this.userService.registerUser({ username: username, password: password, email: email }).subscribe(value => UserComponent.user = value);
  }

  login(email: string, password: string): void {
    this.userService.loginUser({ username: email, password: password, email: email }).subscribe(value => UserComponent.user = value);
  }

  passwordRecovery(email: string): void {
    this.userService.recoverUser(email).subscribe(() => this.presentOkToast("Email sent"));
  }


  isUserLogged() {
    return UserComponent.user != null;
  }


  async presentOkToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }
}
