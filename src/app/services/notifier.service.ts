import { NotifierComponent } from './../tools/notifier/notifier.component';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotifierService {

  constructor(private snackBar:MatSnackBar) { }

  showNotification(msg:string,btnText:string,type:'success'|'error'){
    this.snackBar.openFromComponent(NotifierComponent,{
      data:{
        message:msg,
        buttonText:btnText
      },
      duration:5000,
      verticalPosition:'top',
      horizontalPosition:'right',
      panelClass:type
    });
  }


}
