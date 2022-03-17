import { Router } from '@angular/router';
import { NotifierService } from './../../services/notifier.service';
import { Component, OnInit } from '@angular/core';
import {FirebaseTSAuth} from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-authenticator',
  templateUrl: './authenticator.component.html',
  styleUrls: ['./authenticator.component.css']
})
export class AuthenticatorComponent implements OnInit {

  state = AuthenticatorCompState.LOGIN;
  firebaseAuth!: FirebaseTSAuth;

  constructor(private bottomSheetRef:MatBottomSheetRef,private notification:NotifierService,private router:Router) {
    this.firebaseAuth=new FirebaseTSAuth();
  }

  ngOnInit(): void {
  }

  onRegisterClick(
    registerEmail:HTMLInputElement,
    registerPassword:HTMLInputElement,
    registerConfirmPassword:HTMLInputElement){
    let email=registerEmail.value;
    let password=registerPassword.value;
    let confirmPassword=registerConfirmPassword.value;
    if(this.isNotEmpty(email)
    && this.isNotEmpty(password)
    && this.isNotEmpty(confirmPassword)
    && this.isAMatch(password,confirmPassword)){
      this.firebaseAuth.createAccountWith(
        {
          email:email,
          password:password,
          onComplete:(uc)=>{
            this.bottomSheetRef.dismiss();
          },
          onFail:(err)=>{
            alert("Faild to create the account: "+err);
          }
        }
      );
    }

  }

  onLogin(loginEmail:HTMLInputElement
    ,loginPassword:HTMLInputElement){
      let email=loginEmail.value;
      let password=loginPassword.value;

      if(this.isNotEmpty(email)
      && this.isNotEmpty(password)){
        this.firebaseAuth.signInWith({
          email:email,
          password:password,
          onComplete:(uc)=>{
            this.bottomSheetRef.dismiss();

            this.router.navigate(["/postfeed"]);
            this.notification.showNotification("LoggedIn Successfuly ..","Ok","success");
          },
          onFail:(err)=>{
            console.log("Faild to login: "+err);
            this.notification.showNotification("LoggedIn Failed :( ","Try Later","error");

          }
        });
      }
  }

  onRestClick(resetEmail:HTMLInputElement){
    let email=resetEmail.value;
    if(this.isNotEmpty(email)){
      this.firebaseAuth.sendPasswordResetEmail({
        email:email,
        onComplete:(error)=>{
          this.bottomSheetRef.dismiss();
        }
      });
    }
  }

  isNotEmpty(text:string){
    return text!=null && text.length>0;
  }

  isAMatch(text:string,comparedWith:string){
    return text==comparedWith;
  }

  onForgotPasswordClick(){
    this.state=AuthenticatorCompState.FORGOT_PASSWORD;
  }
  onCreateAccountClick(){
    this.state=AuthenticatorCompState.REGISTER;
  }
  onLoginClick(){
    this.state=AuthenticatorCompState.LOGIN;
  }

  isLoginState(){
    return this.state == AuthenticatorCompState.LOGIN;
  }
  isForgotPasswordState(){
    return this.state == AuthenticatorCompState.FORGOT_PASSWORD;
  }
  isRegisterState(){
    return this.state == AuthenticatorCompState.REGISTER;
  }

  getStateText(){
    switch(this.state){
      case AuthenticatorCompState.LOGIN: return "Login";
      case AuthenticatorCompState.REGISTER: return "Register";
      case AuthenticatorCompState.FORGOT_PASSWORD: return "Forgot Password";
    }
  }

}

export enum AuthenticatorCompState{
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD
}
