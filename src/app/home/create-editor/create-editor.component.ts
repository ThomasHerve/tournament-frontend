import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';

import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserComponent } from 'src/app/shared/user/user.component';
import { UserDTO } from 'src/app/shared/DTO/userDTO';
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
      unemail: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8)])],
    });
    this.passwordRecoveryForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
    });
  }
  ngOnInit() {
  }

  register(username: string, email: string, password: string): void {
    this.userService.registerUser(new UserDTO({ username: username, email: email, password: password })).subscribe(value => this.userLogged(value));
  }

  login(usernameEmail: string, password: string): void {
    this.userService.loginUser(new UserDTO({ username: usernameEmail, password: password })).subscribe(value => this.userLogged(value));
  }

  passwordRecovery(email: string): void {
    this.userService.recoverUser(email).subscribe(() => this.presentOkToast("Email sent"));
  }


  userLogged(user: UserDTO) {
    UserComponent.user = user;
    console.log(UserComponent.user)
    this.presentOkToast("Bienvenue " + UserComponent.user.username)
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
