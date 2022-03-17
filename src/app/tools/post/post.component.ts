import { ReplyComponent } from './../reply/reply.component';
import { UserDocument } from './../../app.component';
import { PostData } from './../../pages/post-feed/post-feed.component';
import { Component, Input, OnInit } from '@angular/core';
import { FirebaseTSFirestore } from 'firebasets/firebasetsFirestore/firebaseTSFirestore';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  firestore= new FirebaseTSFirestore();
  creatorName!: string;
  creatorDescription!:string;

  @Input() postData!:PostData;
  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
    this.getCreatorInfo();
  }

  onReplyClick(){
    this.dialog.open(ReplyComponent,{data:this.postData.postId});
  }

  getCreatorInfo(){
    this.firestore.getDocument({
      path:["Users",this.postData.creatorId],
      onComplete:result=>{
        let userDocument = result.data();
        this.creatorName=userDocument!['publicName'];
        this.creatorDescription=userDocument!['description'];

      }
    });
  }

}
