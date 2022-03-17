import { throwError } from 'rxjs';
import { AppComponent } from './../../app.component';
import { Component, Inject, OnInit } from '@angular/core';
import { FirebaseTSFirestore, OrderBy } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FirebaseTSApp } from 'firebasets/firebasetsApp/firebaseTSApp';
@Component({
  selector: 'app-reply',
  templateUrl: './reply.component.html',
  styleUrls: ['./reply.component.css']
})
export class ReplyComponent implements OnInit {

  firebase=new FirebaseTSFirestore();
  comments:Comment[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private postId:string) { }

  ngOnInit(): void {
    this.getComments();
  }

  isCommentCreator(comment:Comment){
    try{
      return  comment.creatorId == AppComponent.getUserDocument().userId;
    }catch(err){console.log(err);return throwError(err)}
  }

  getComments(){
    this.firebase.listenToCollection({
      name:"Post Comments",
      path:["Posts",this.postId,"PostComments"],
      where:[new OrderBy("timestamp","asc")],
      onUpdate:(result)=>{
        result.docChanges().forEach(
          postCommentDoc=>{
            if(postCommentDoc.type =="added"){
              this.comments.unshift(<Comment>postCommentDoc.doc.data());
            }
          }
        );
      }
    });
  }

  onSendClick(commentInput:HTMLInputElement){
    console.log(AppComponent.getUserDocument().userId!);

    if(!(commentInput.value.length>0))return;
    this.firebase.create({
      path:["Posts",this.postId,"PostComments"],
      data:{
        comment: commentInput.value,
        creatorId: AppComponent.getUserDocument().userId!,
        creatorName: AppComponent.getUserDocument().publicName,
        timestamp: FirebaseTSApp.getFirestoreTimestamp()
      },
      onComplete:(docId)=>{
        commentInput.value="";
      }
    }).catch((err)=>{
      console.log(err);
    });
  }

}

export interface Comment{
  creatorId:string;
  creatorName:string;
  comment:string;
  timestamp:firebase.default.firestore.Timestamp;
}
