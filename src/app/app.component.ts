import { NotifierService } from './services/notifier.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component } from '@angular/core';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { AuthenticatorComponent } from './tools/authenticator/authenticator.component';
import { FirebaseTSAuth } from 'firebasets/firebasetsAuth/firebaseTSAuth';
import { Router } from '@angular/router';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  public loading :boolean=false;
  title = 'iSocial';
  auth = new FirebaseTSAuth();
  firestore=new FirebaseTSFirestore();
  userHasProfile=true;
  private static userDocument: UserDocument;

  constructor(private loginSheet:MatBottomSheet,
              private router:Router,
              private notification:NotifierService) {
      this.loading=true;
     this.auth.listenToSignInStateChanges(
       user=>{
         this.auth.checkSignInState({
           whenSignedIn:user=>{
             this.loading=false;

           },
           whenSignedOut:user=>{
            AppComponent.userDocument!=null;
            this.loading=false;

           },
           whenSignedInAndEmailNotVerified:user=>{
             this.router.navigate(["emailVerification"]);
           },
           whenSignedInAndEmailVerified:user=>{
             this.getUserProfile();
             this.router.navigate(["/postfeed"]);
           },
           whenChanged:user=>{}
         });
       }
     );
  }

  public static getUserDocument(){
    return AppComponent.userDocument;
  }
  public  getUserDocument(){
    return AppComponent.userDocument!;
  }
  getUsername(){
   try{
    return AppComponent.userDocument.publicName;
   }catch(err){
    return throwError(err);
   }
  }

  getUserProfile(){
    this.firestore.listenToDocument({

      name:"Getting Document",
      path:["Users",this.auth.getAuth().currentUser?.uid!],
      onUpdate:(result)=>{
        AppComponent.userDocument = <UserDocument> result.data();
        this.userHasProfile=result.exists;
        AppComponent.userDocument.userId!=this.auth.getAuth().currentUser?.uid!;

        if(this.userHasProfile){
          this.router.navigate(["/postfeed"]);
          this.loading=false;
        }
      }

    });
  }

  loggedIn(){
    return this.auth.isSignedIn();
  }

  onLoginClick(){
    this.loginSheet.open(AuthenticatorComponent);
  }
  onLogoutClick(){
    this.auth.signOut();
    this.router.navigate(["/"]);

    this.notification.showNotification("BYE... See You Soon (:","Ok","success");
  }
}

export interface UserDocument{
  publicName:string;
  description:string;
  userId:string;
}
